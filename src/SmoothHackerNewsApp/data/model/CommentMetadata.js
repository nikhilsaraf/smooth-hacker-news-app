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