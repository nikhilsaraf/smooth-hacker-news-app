/**
 * @flow
 */

export default class RowMetadata {
	constructor(id, title, user, url, score, commentCount, isRead) {
		this._id = id;
		this._title = title;
		this._user = user;
		this._url = url;
		this._score = score;
		this._commentCount = commentCount;
		this._isRead = isRead;
	}

	withReadStatus(isRead) {
		return new RowMetadata(
			this.id(),
			this.title(),
			this.user(),
			this.url(),
			this.score(),
			this.commentCount(),
			isRead);
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

	isRead() {
		return this._isRead;
	}
}