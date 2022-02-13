'use strict';

declareUpdate();

const test = require('/test/test-helper.xqy');

['IPA-L1', 'IPA-L2'].forEach(beer => {
  xdmp.documentInsert(`/inventory/${beer}.json`, test.getTestFile(`inventory-${beer}.json`), {
    collections: ['inventory']
  });
});
