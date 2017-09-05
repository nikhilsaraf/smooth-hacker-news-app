/**
 * @flow
 */

import CommentMetadata from '../model/CommentMetadata';

export default class CommentDataProvider {
	constructor(itemDataProvider) {
		this._itemDataProvider = itemDataProvider;
	}

	_transformComments(comments) {
		if (!comments) {
			return null;
		}

		const commentItems = [];
		for (let i = 0; i < comments.length; i++) {
			const comment = comments[i];
			commentItems.push(new CommentMetadata(
				comment['id'],
				comment['user'],
				comment['content'],
				this._transformComments(comment['comments'])));
		}
		return commentItems;
	}

	fetchData(parentId, callbackFn) {
		this._itemDataProvider.fetchData([parentId], (itemObjects) => {
			const comments = itemObjects[0]['comments'];
			const transformedComments = this._transformComments(comments);
			// finally call the callback here
			callbackFn(transformedComments, itemObjects[0]['content']);
		});
	}
}