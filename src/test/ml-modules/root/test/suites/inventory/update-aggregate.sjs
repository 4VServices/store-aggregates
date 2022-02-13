'use strict';

const test = require('/test/test-helper.xqy');
const inv = require('/lib/inventory.sjs');

// Update the inventory at Location 1 from 23 to 20. The new total should be 54.
xdmp.invokeFunction(
  () => {
    inv.setInventory('Philly Special IPA', 'Location 1', 20);
    xdmp.sleep(100);
  },
  { update: 'true' }
);

let actual = fn.head(xdmp.invokeFunction(() => inv.getByBeer('Philly Special IPA'), { update: 'true' }));

let assertions = [test.assertEqual(54, actual)];
assertions;
