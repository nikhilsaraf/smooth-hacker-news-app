/**
 * @flow
 */

export default class RowMetadata {
	constructor(title, subtitle, url) {
		this._title = title;
		this._subtitle = subtitle;
		this._url = url;
	}

	title() {
		return this._title;
	}

	subtitle() {
		return this._subtitle;
	}

	url() {
		return this._url;
	}
}