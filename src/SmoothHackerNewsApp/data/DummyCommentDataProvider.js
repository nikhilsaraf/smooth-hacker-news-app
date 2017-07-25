/**
 * @flow
 */

import CommentMetadata from './CommentMetadata';

const dummyComments = [
	new CommentMetadata(100, 'userA', 'blue is the best color', [102, 104]),
	new CommentMetadata(102, 'userB', 'no, I think that red is the best color', [103]),
	new CommentMetadata(103, 'userC', 'both of you are incorrect, it is actually Green that is the best color', []),
	new CommentMetadata(104, 'userD', 'no, green is the best!', []),
	new CommentMetadata(101, 'userB', 'i think that red is the best color', [])
];

export default class DummyCommentDataProvider {
	fetchData(commentIds, callbackFn) {
		// collect the comments that have ids in commentIds into the searchResult
		const searchResult = [];
		for (let i = 0; i < dummyComments.length; i++) {
			const comment = dummyComments[i];
			// TODO make more efficient if this ends up staying as ids instead of a pointer
			if (commentIds.includes(comment.id())) {
				searchResult.push(comment);
			}
		}

		// invoke callback
		callbackFn(searchResult);
	}
}