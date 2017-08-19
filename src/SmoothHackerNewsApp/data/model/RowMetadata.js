/**
 * @flow
 */

export default class RowMetadata {
	constructor(id, title, user, url, score, commentCount) {
		this._id = id;
		this._title = title;
		this._user = user;
		this._url = url;
		this._score = score;
		this._commentCount = commentCount;
	}

	id() {
		return this._id;
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

	commentCount() {
		return this._commentCount;
	}
}