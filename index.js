const { resolve } = require("path");
const Promise = require('bluebird');
const clone = require('clone');

const pointer = require("jsonpointer");

const { connect } = require("@oada/client");
const { tree } = require("@pork/trees");
const dummydatamaster = require('./dummydata.js')

async function runFarmer(domain, { farmer, hauler, processor }) {
  const farmerc = await connect({ domain, token: farmer.token });
  const haulerc = farmerc.clone(hauler.token);
  const processorc = farmerc.clone(processor.token);
  const dummydata = clone(dummydatamaster);

  console.log(`Connected to ${domain} as farmer, hauler, processor tokens`);
  // Hauler and Processor share bookmarks w/ Farmer to ensure permissions
  const req = {
    path: `/bookmarks/_meta/_permissions/${farmer.id}`,
    data: { read: true, write: true, owner: false },
  };
  await haulerc.put(req);
  await processorc.put(req);
  console.log(`Added farmer permissions to hauler and processor bookmarks`);


  // Figure out the bookmarks ids for hauler and processor:
  const hauler_bookmarks = (await haulerc.head({ path: "/bookmarks" }))
    .headers["content-location"]
    .substr(1);
  const processor_bookmarks = (await processorc.head({ path: "/bookmarks" }))
    .headers["content-location"]
    .substr(1);
  dummydata.processors[0].bookmarks = { _id: processor_bookmarks };
  dummydata.haulers[0].bookmarks = { _id: hauler_bookmarks };
  console.log(`Found bookmarks _id's for hauler and processor`);

  // Put all the processors:
  await Promise.each(dummydata.processors, async p => {
    const path = `/bookmarks/trellisfw/trading-partners/${p.id}`;
    const exists = await farmerc.get({ path })
      .then(() => true)
      .catch(e => false);
    if (exists) {
      console.log(`Processor ${p.name} at id ${p.id} already exists on remote, skipping`);
      return;
    }
    console.log(`Putting processor ${p.name} at id ${p.id} to remote....`);
    await farmerc.put({
      tree,
      path,
      data: p
    });
    console.log(`Successfully put processor ${p.name} at id ${p.id}`);
  });
  console.log(`Finished adding processors`);

  // Put all the haulers:
  await Promise.each(dummydata.haulers, async h => {
    const path = `/bookmarks/trellisfw/trading-partners/${h.id}`;
    const exists = await farmerc.get({ path })
      .then(() => true)
      .catch(e => false);
    if (exists) {
      console.log(`Hauler ${h.name} at id ${h.id} already exists on remote, skipping`);
      return;
    }
    console.log(`Putting hauler ${h.name} at id ${h.id} to remote....`);
    await farmerc.put({
      tree,
      path,
      data: h
    });
    console.log(`Successfully put hauler ${h.name} at id ${h.id}`);
  });
  console.log(`Finished adding haulers`);

  // Put the farmer:
  await Promise.each(dummydata.farmers, async f => {
    const path = `/bookmarks/trellisfw/trading-partners/${f.id}`;
    const exists = await farmerc.get({ path })
      .then(() => true)
      .catch(e => false);
    if (exists) {
      console.log(`Farmer ${f.name} at id ${f.id} already exists on remote, skipping`);
      return;
    }
    console.log(`Putting farmer ${f.name} at id ${f.id} to remote....`);
    await farmerc.put({
      tree,
      path,
      data: f
    });
    console.log(`Successfully put farmer ${f.name} at id ${f.id}`);
  });

  // Put the locations for the farmer at top level:
  await Promise.each(Object.keys(dummydata.farmers[0].locations), async k => {
    const l = dummydata.farmers[0].locations[k];
    const path = `/bookmarks/trellisfw/locations/${l.id}`;
    const exists = await farmerc.get({ path })
      .then(() => true)
      .catch(e => false);
    if (exists) {
      console.log(`Location ${l.name} at id ${l.id} already exists on remote, skipping`);
      return;
    }
    console.log(`Putting location ${l.name} at id ${l.id} to remote....`);
    await farmerc.put({
      tree,
      path,
      data: l
    });
    console.log(`Successfully put location ${l.name} at id ${l.id}`);
  });

  console.log('Done!');
  await farmerc.disconnect();
}




// Load secrets?
const secrets = require(resolve("./", process.argv[2]));

// Find farmer domain??
for (const [key, value] of Object.entries(secrets)) {
  if (key.match(/^farmer\./)) {
    // Do stuff
    return runFarmer(key, value);
  }

}
