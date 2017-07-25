/**
 * @flow
 */

import CommentMetadata from './CommentMetadata';

export default class DataProvider {
	constructor(itemDataProvider) {
		this._itemDataProvider = itemDataProvider;
	}

	fetchData(commentIds, callbackFn) {
		this._itemDataProvider.fetchData(commentIds, (itemObjects) => {
			// transform itemObjects
			const items = [];
			for (let i = 0; i < itemObjects.length; i++) {
				const item = itemObjects[i];
				items.push(new CommentMetadata(
					item['id'],
					item['by'],
					item['text'],
					item['kids'] ? item['kids'] : []));
			}

			// finally call the callback here
			callbackFn(items);
		});
	}
}