/**
 * @flow
 */

import RowMetadata from './RowMetadata';

export default class DummyDataProvider {
	constructor() {}

	fetchData(callbackFn) {
		callbackFn([
			new RowMetadata('Title 1 - Google', 'user1', 'http://google.com'),
			new RowMetadata('Title 2 - Yahoo', 'user2', 'http://yahoo.com'),
			new RowMetadata('Title 2 - Yahoo', 'user2', 'http://yahoo.com'),
			new RowMetadata('Title 2 - Yahoo', 'user2', 'http://yahoo.com'),
			new RowMetadata('Title 2 - Yahoo', 'user2', 'http://yahoo.com')
		]);
	}
}