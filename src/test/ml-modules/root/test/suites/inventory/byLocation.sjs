'use strict';

const test = require('/test/test-helper.xqy');
const inv = require('/lib/inventory.sjs');

let actual = inv.getByLocation('Philly Special IPA', 'Location 1');

let assertions = [test.assertEqual(23, actual)];
assertions;
