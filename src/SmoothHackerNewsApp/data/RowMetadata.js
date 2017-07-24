/**
 * @flow
 */

export default class RowMetadata {
	constructor(title, user, url, score, numComments) {
		this._title = title;
		this._user = user;
		this._url = url;
		this._score = score;
		this._numComments = numComments;
	}

	title() {
		return this._title;
	}

	user() {
		return this._user;
	}

	url() {
		return this._url;
	}

	score() {
		return this._score;
	}

	numComments() {
		return this._numComments;
	}
}