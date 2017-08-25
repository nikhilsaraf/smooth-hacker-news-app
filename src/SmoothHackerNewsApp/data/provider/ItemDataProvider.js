/**
 * @flow
 */

export default class ItemDataProvider {
	constructor(staticUrlPrefix, staticUrlSuffix) {
		this._staticUrlPrefix = staticUrlPrefix;
	}

	fetchData(itemIds, callbackFn) {
		// create and initialize itemObjects
		const itemObjects = [];
		for (let _i = 0; _i < itemIds.length; _i++) {
			itemObjects.push({});
		}

		let numCallsFinished = 0;
		for (let i = 0; i < itemIds.length; i++) {
			const itemId = itemIds[i];
			const itemUrl = this._staticUrlPrefix + itemId;

			fetch(itemUrl)
				.then((response) => response.json())
				.then((itemBody) => {
					// console.log(itemBody);
					// set item and update counter
					itemObjects[i] = itemBody;
					numCallsFinished++;

					// if this was the last call then invoke the callback passed in
					if (numCallsFinished >= itemIds.length) {
						callbackFn(itemObjects);
					}
				});
		}
	}
}