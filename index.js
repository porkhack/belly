const { resolve } = require("path");

const pointer = require("jsonpointer");

const { connect } = require("@oada/client");
const { asn: asntree } = require("@pork/trees");

// Build our tree?
const tree = Object.assign({}, asntree);
pointer.set(tree, "/bookmarks/trellisfw/trading-partners", {
  _type: "application/json",
});
pointer.set(tree, "/bookmarks/trellisfw/trading-partners/*", {
  _type: "application/json",
  ...asntree,
});

console.dir(tree, { depth: null });

async function run(domain, { farmer, hauler, processor }) {
  const farmerc = await connect({ domain, token: farmer.token });
  const haulerc = farmerc.clone(hauler.token);
  const processorc = farmerc.clone(processor.token);

  // Share other bookmarks with farmer user?
  const req = {
    path: `/bookmarks/_meta/_permissions/${farmer.id}`,
    data: { read: true, write: true, owner: false },
  };
  await haulerc.put(req);
  await processorc.put(req);

  // Link bookmarks into tree as in miro??
  await farmerc.put({
    tree,
    path: "/bookmarks/trellisfw/trading-partners/hauler",
    data: {
      type: "hauler",
      bookmarks: {
        _id: (await haulerc.head({ path: "/bookmarks" })).headers[
          "content-location"
        ].substr(1),
      },
    },
  });
  await farmerc.put({
    tree,
    path: "/bookmarks/trellisfw/trading-partners/processor",
    data: {
      type: "processor",
      bookmarks: {
        _id: (await processorc.head({ path: "/bookmarks" })).headers[
          "content-location"
        ].substr(1),
      },
    },
  });

  await farmerc.disconnect();
}

// Load secrets?
const secrets = require(resolve("./", process.argv[2]));

// Find farmer domain??
for (const [key, value] of Object.entries(secrets)) {
  if (key.match(/^farmer\./)) {
    // Do stuff
    return run(key, value);
  }
}
