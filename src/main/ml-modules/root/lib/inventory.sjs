'use strict';

/**
 * Return the number of bottles of the specified beer at the specified location.
 * @param beer
 * @param location
 * @returns
 */
function getByLocation(beer, location) {
  let result = fn.head(
    cts.search(
      cts.andQuery([
        cts.collectionQuery('inventory'),
        cts.jsonPropertyValueQuery('beer', beer),
        cts.jsonPropertyValueQuery('branch', location)
      ])
    )
  );
  return result ? result.toObject().available : null;
}

function getByBeer(beer) {
  return cts.doc(`/inventory/beer/${beer}.json`).root.available.valueOf();
}

function setInventory(beer, location, available) {
  xdmp.documentInsert(
    `/inventory/${beer}-${location}.json`,
    {
      beer: beer,
      branch: location,
      available: available
    },
    {
      collections: ['inventory']
    }
  );
}

module.exports = {
  getByLocation,
  getByBeer,
  setInventory
};
