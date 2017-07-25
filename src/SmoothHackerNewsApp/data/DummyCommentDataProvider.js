/**
 * @flow
 */

import CommentMetadata from './CommentMetadata';

export default class DummyCommentDataProvider {
	constructor() {
		this.state = {
			comments: [
				new CommentMetadata(100, 'userA', 'blue is the best color', [102, 104]),
				new CommentMetadata(102, 'userB', 'no, I think that red is the best color', [103]),
				new CommentMetadata(103, 'userC', 'both of you are incorrect, it is actually Green that is the best color', []),
				new CommentMetadata(104, 'userD', 'no, green is the best!', []),
				new CommentMetadata(101, 'userB', 'i think that red is the best color', [])
			]
		}
	}

	_collectComments(commentDatasetList, commentIds, collector) {
		// base case when list is empty
		if (commentDatasetList.length == 0) {
			return;
		}

		for (let i = 0; i < commentDatasetList.length; i++) {
			const comment = commentDatasetList[i];
			const children = comment.children();
			// TODO make more efficient if this ends up staying as ids instead of a pointer
			if (commentIds.includes(comment.id())) {
				collector.push(comment);
			}

			// recurse
			this._collectComments(children, commentIds, collector);
		}
	}

	fetchData(commentIds, callbackFn) {
		console.log('fetching comment data for commentIds: ' + JSON.stringify(commentIds));

		// TODO need to cut down the search space every time we go deeper

		// collect the comments that have ids in commentIds into the searchResult
		const searchResult = [];
		this._collectComments(this.state.comments, commentIds, searchResult);

		// invoke callback
		callbackFn(searchResult);
	}
}