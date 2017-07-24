/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';

 class CommentCell extends React.Component {
 	constructor(props) {
 		super(props);
 	}

 	_extractCommentIds(comments) {
 		const ids = [];
 		for (let i = 0; i < comments.length; i++) {
 			ids.push(comments[i].id());
 		}
 		return ids;
 	}

 	render() {
 		const commentMetadata = this.props.data;
 		return (
	 		<View style={{ paddingTop: 10, paddingBottom: 10, flex: 200, flexDirection: 'column' }}>

	            <View style={{ flex: 100, paddingBottom: 5, flexDirection: 'row' }}>
	              <Text
	                style={{ flex: 1, fontSize: 18, alignItems: 'flex-start' }}
	                allowFontScaling
	                numberOfLines={1}
	                >
	                {commentMetadata.text()}
	              </Text>
	              <Text
	                style={{ fontSize: 12, paddingTop: 4, alignItems: 'flex-end' }}
	                allowFontScaling
	                numberOfLines={1}
	                >
	                {"by " + commentMetadata.user()}
	              </Text>
	            </View>

	            <View style={{ flex: 100, flexDirection: 'row' }}>
	              <TouchableOpacity
	                style={{ flex: 1, alignItems: 'flex-start' }}
	                // TODO if we already have the commend data here then maybe it can be made simpler, rather than having to extract the commentIds and re-fetch all the time
	                // this way only the StoryCell will perform a network call and the CommentCell will use cached data
	                onPress={() => this.props.openCommentsFn(this.props.navigate, this._extractCommentIds(commentMetadata.children()))}
	                >
	                <Text
	                  style={{ fontSize: 12 }}
	                  allowFontScaling
	                  numberOfLines={1}
	                  >
	                  {commentMetadata.children().length + " replies"}
	                </Text>
	              </TouchableOpacity>
	            </View>

	          </View>
          	);
 	}
}

CommentCell.propTypes = {
	navigate: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
	openCommentsFn: PropTypes.func.isRequired
};

export default CommentCell;