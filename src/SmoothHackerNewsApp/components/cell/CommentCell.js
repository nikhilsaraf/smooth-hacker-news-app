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

 	render() {
 		const commentMetadata = this.props.data;
 		return (
	 		<View style={{ paddingTop: 10, paddingBottom: 10, flex: 200, flexDirection: 'column' }}>

	            <View style={{ flex: 100, paddingBottom: 5, flexDirection: 'row' }}>
	              <Text
	                style={{ flex: 1, fontSize: 18, alignItems: 'flex-start' }}
	                allowFontScaling
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
	                onPress={() => this.props.openCommentsFn(this.props.navigate, commentMetadata.children())}
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