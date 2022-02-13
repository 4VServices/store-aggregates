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
  return cts
    .search(cts.andQuery([cts.collectionQuery('inventory'), cts.jsonPropertyValueQuery('beer', beer)]))
    .toArray()
    .reduce((prev, curr) => prev + curr.root.available.valueOf(), 0);
}

module.exports = {
  getByLocation,
  getByBeer
};
