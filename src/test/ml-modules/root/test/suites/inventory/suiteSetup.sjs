'use strict';

declareUpdate();

const test = require('/test/test-helper.xqy');
const inv = require('/lib/inventory.sjs');

xdmp.invokeFunction(
  () => {
    [
      { beer: 'Philly Special IPA', branch: 'Location 1', available: 23 },
      { beer: 'Philly Special IPA', branch: 'Location 2', available: 34 }
    ].forEach(input => {
      inv.setInventory(input.beer, input.branch, input.available);
    });
  },
  {
    update: 'true'
  }
);

// Give time for the triggers to run
xdmp.sleep(100);
