/**
 * @flow
 */

export default class RowMetadata {
	constructor(id, title, user, url, content, score, commentCount, isRead) {
		this._id = id;
		this._title = title;
		this._user = user;
		this._url = url;
		this._content = content;
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
			this.content(),
			this.score(),
			this.commentCount(),
			isRead);
	}

	withContent(content) {
		return new RowMetadata(
			this.id(),
			this.title(),
			this.user(),
			this.url(),
			content,
			this.score(),
			this.commentCount(),
			this.isRead());
	}

	forMetrics() {
		return {
			type: 'Story',
			id: this.id(),
			title: this.title(),
			user: this.user(),
			url: this.url(),
			content_length: this.content() ? this.content().length : 0,
			score: this.score(),
			comment_count: this.commentCount()
		};
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

	content() {
		return this._content;
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