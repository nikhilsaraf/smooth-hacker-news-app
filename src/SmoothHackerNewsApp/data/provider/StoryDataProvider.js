/**
 * @flow
 */

import RowMetadata from '../model/RowMetadata';

export default class StoryDataProvider {
	constructor(url, itemDataProvider) {
		this._url = url;
	}

	fetchData(callbackFn) {
		fetch(this._url)
			.then((response) => response.json())
			.then((itemObjects) => {
				// transform itemObjects
				const items = [];
				for (let i = 0; i < itemObjects.length; i++) {
					const item = itemObjects[i];
					items.push(new RowMetadata(
						item['id'],
						item['title'],
						item['user'],
						item['url'],
						item['points'],
						item['comments_count'] ? item['comments_count'] : []));
				}
				
				// finally call the callback here
				callbackFn(items);
			});
	}
}