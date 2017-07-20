/**
 * @flow
 */

import RowMetadata from './RowMetadata';

export default class DataProvider {
	constructor() {}

	fetchData() {
		return [
	      new RowMetadata('Alibaba Cloud', '', 'https://www.alibabacloud.com/'),
	      new RowMetadata('Google', '', 'https://google.com/')
	    ];
	}
}