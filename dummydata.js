// 2 processors, 3 haulers, 1 farmer

module.exports = {
  processors: [
    {
      id: '1qghxme9xpg1verkbwcsixovtl0_PROC1',
      partnertype: 'processor',
      name: 'Pig Processor 1',
      locations: {
        '1qGhvlGM0Pg1UdcCjhyfHaEQ7lL': {
          id: '1qGhvlGM0Pg1UdcCjhyfHaEQ7lL',
          name: 'Orlando East Plant',
          address: 'someplace in orlando',
          lat: 28.515899,
          lon: -81.426453,
        },
      },
    },
    {
      id: '1qGhrd1CXtzV87kFvWIIHKw3RDh_PROC2',
      partnertype: 'processor',
      name: 'Pig Processor 2',
      locations: {
        '1qGhyLUD1DmnuWNw9muWAasmL90': {
          id: '1qGhyLUD1DmnuWNw9muWAasmL90',
          name: 'Tampa West Plant',
          address: 'someplace in tampa',
          lat: 28.051389,
          lon: -82.701483,
        },
      },
    },


  ],

  haulers: [
    {
      id: '1qGhZLIgqcdjNuOWqDU8YX6DjEM_HAUL1',
      partnertype: 'hauler',
      name: 'Happy Hauler #1',
    },
    {
      id: '1qGhauHBm6NJUUUhqaxWQe3GDxo_HAUL2',
      partnertype: 'hauler',
      name: 'Happy Hauler #2',
    },
    {
      id: '1qGhc83n5usBsfnb0huPQzQbxcz_HAUL3',
      partnertype: 'hauler',
      name: 'Happy Hauler #3',
    },
  ],

  farmers: [
    {
      id: '1qGheivAkEiJHjgpEV4gUbNnRda_FARMER1',
      partnertype: 'farmer',
      name: 'Frank Farmer',
      locations: {
        '1qGhgP0GaJpBe327RFO3PdPiY3X_EASTBARN': {
          id: '1qGhgP0GaJpBe327RFO3PdPiY3X_EASTBARN',
          name: 'East barn',
          premiseid: '9294823',
        },
        '1qGhi5iDlg8wQUtUNLOmP8CIXsw_WESTBARN': {
          id: '1qGhi5iDlg8wQUtUNLOmP8CIXsw_WESTBARN',
          name: 'West barn',
          premiseid: '54832093',
        },
      },
    },
    
  ],

}

