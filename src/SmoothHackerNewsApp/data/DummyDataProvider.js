/**
 * @flow
 */

import RowMetadata from './RowMetadata';

export default class DummyDataProvider {
	constructor() {}

	fetchData(callbackFn) {
		callbackFn([
			new RowMetadata('Title 1 - Google', 'user1', 'http://google.com', 23, 34),
			new RowMetadata('Title 2 - Yahoo', 'user2', 'http://yahoo.com', 302, 14),
			new RowMetadata('Title 2 - Yahoo', 'user2', 'http://yahoo.com', 2, 9),
			new RowMetadata('Title 2 - Yahoo', 'user2', 'http://yahoo.com', 32, 4),
			new RowMetadata('Title 2 - Yahoo', 'user2', 'http://yahoo.com', 0, 83)
		]);
	}
}