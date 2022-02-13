'use strict';

const test = require('/test/test-helper.xqy');
const inv = require('/lib/inventory.sjs');

let actual = inv.getByBeer('Philly Special IPA');

let assertions = [test.assertEqual(57, actual)];
assertions;
