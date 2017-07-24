/**
 * @flow
 */

import RowMetadata from './RowMetadata';

export default class DummyDataProvider {
	fetchData(callbackFn) {
		callbackFn([
			new RowMetadata(0, 'Title 1 - Google', 'user1', 'http://google.com', 23, [100]),
			new RowMetadata(1, 'Title 2 - Yahoo', 'user2', 'http://yahoo.com', 302, []),
			new RowMetadata(2, 'Title 2 - Yahoo', 'user2', 'http://yahoo.com', 2, [102, 103]),
			new RowMetadata(3, 'Title 2 - Yahoo', 'user2', 'http://yahoo.com', 32, []),
			new RowMetadata(4, 'Title 2 - Yahoo', 'user2', 'http://yahoo.com', 0, [])
		]);
	}
}