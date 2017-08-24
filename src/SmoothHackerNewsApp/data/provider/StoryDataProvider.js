/**
 * @flow
 */

import RowMetadata from '../model/RowMetadata';

export default class StoryDataProvider {
	constructor(url, isReadFn) {
		this._url = url;
		this._isReadFn = isReadFn;
	}

	// updates the isRead property for the items and calls the callback once only if all items are finished
	_barrier(originalRowMetadata, items, idx, isRead, counter, callbackFn) {
		items[idx] = new RowMetadata(
			originalRowMetadata.id(),
			originalRowMetadata.title(),
			originalRowMetadata.user(),
			originalRowMetadata.url(),
			originalRowMetadata.score(),
			originalRowMetadata.commentCount(),
			isRead);

		if (counter == items.length) {
			// finally call the callbackFn here
			callbackFn(items);
		}
	}

	fetchData(callbackFn) {
		fetch(this._url)
			.then((response) => response.json())
			.then((itemObjects) => {
				// track number of read statuses
				let readCounter = 0;

				// track transformed itemObjects into items
				const items = [];
				for (let i = 0; i < itemObjects.length; i++) {
					items.push(null);
				}

				// transform itemObjects and fetch their read status
				for (let i = 0; i < itemObjects.length; i++) {
					const item = itemObjects[i];

					const id = item['id'];
					const rowMetadata = new RowMetadata(
						id,
						item['title'],
						item['user'],
						item['url'],
						item['points'] ? item['points'] : 0,
						item['comments_count'] ? item['comments_count'] : 0,
						null);

					// the barrier will call the callbackFn only once
					this._isReadFn(id, (isRead) => this._barrier(rowMetadata, items, i, isRead, ++readCounter, callbackFn));
				}
			});
	}
}