/**
 * @flow
 */

import RowMetadata from '../model/RowMetadata';

export default class StoryDataProvider {
	constructor(url, itemDataProvider) {
		this._url = url;
		this._itemDataProvider = itemDataProvider;
	}

	fetchData(callbackFn) {
		fetch(this._url)
			.then((response) => response.json())
			.then((storyIds) => {
				// second level of fetch calls for the actual items
				this._itemDataProvider.fetchData(storyIds, (itemObjects) => {
					// transform itemObjects
					const items = [];
					for (let i = 0; i < itemObjects.length; i++) {
						const item = itemObjects[i];
						items.push(new RowMetadata(
							item['id'],
							item['title'],
							item['by'],
							item['url'],
							item['score'],
							item['kids'] ? item['kids'] : []));
					}
					
					// finally call the callback here
					callbackFn(items);
				});
			});
	}
}