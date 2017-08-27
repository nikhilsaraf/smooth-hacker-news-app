/**
 * @flow
 */

export default class CommentMetadata {
	constructor(id, user, text, children) {
		this._id = id;
		this._user = user;
		this._text = text;
		this._children = children;
	}

	forMetrics() {
		return {
			type: 'Comment',
			id: this.id(),
			user: this.user(),
			text_length: this.text().length,
			num_children: this.children().length,
		};
	}

	id() {
		return this._id;
	}

	user() {
		return this._user;
	}

	text() {
		return this._text;
	}

	children() {
		return this._children;
	}
}