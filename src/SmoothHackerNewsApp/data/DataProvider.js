/**
 * @flow
 */

import RowMetadata from './RowMetadata';

export default class DataProvider {
	constructor(url) {
		this._url = url;
	}

	fetchData(callbackFn) {
		const staticUrlPrefix = 'https://hacker-news.firebaseio.com/v0/item/'
		const staticUrlSuffix = '.json'
		fetch(this._url).then((response) => {
			// console.log("returning response: " + JSON.stringify(response));

			// can also use _bodyText
			const storyIds = JSON.parse(response['_bodyInit']);
			// console.log("storyIds: " + JSON.stringify(storyIds));

			// create and initialize storyObjects
			const storyObjects = [];
			for (let _i = 0; _i < storyIds.length; _i++) {
				storyObjects.push({});
			}

			let numSubcallsFinished = 0;
			for (let i = 0; i < storyIds.length; i++) {
				const storyId = storyIds[i];
				const itemUrl = staticUrlPrefix + storyId + staticUrlSuffix;
				// console.log('fetching story from url: ' + itemUrl);

				fetch(itemUrl).then((itemResponse) => {
					// console.log('setting data for item ' + i + ': ' + JSON.stringify(itemResponse));

					// transform itemResponse
					const itemBody = JSON.parse(itemResponse['_bodyInit']);
					const itemRowMetadata = new RowMetadata(
						itemBody['title'],
						itemBody['by'],
						itemBody['url'],
						itemBody['score'],
						itemBody['descendants']);

					// set item and update counter
					storyObjects[i] = itemRowMetadata;
					numSubcallsFinished++;

					// if this was the last call then invoke the callback passed in
					if (numSubcallsFinished >= storyIds.length) {
						callbackFn(storyObjects);
					}
				});
			}
		});
	}
}