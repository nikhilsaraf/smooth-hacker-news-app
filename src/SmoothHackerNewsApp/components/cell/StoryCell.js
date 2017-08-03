/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';

 class StoryCell extends React.Component {
 	constructor(props) {
 		super(props);
 	}

 	render() {
        const rowMetadata = this.props.data;
 		const commentsText =
 			(<Text
 				style={{ fontSize: 12 }}
                allowFontScaling
                numberOfLines={1}
                >
                {rowMetadata.comments().length + " comments"}
            </Text>);
 		const touchableComments =
 			(<TouchableOpacity
                onPress={() => this.props.openCommentsFn(this.props.navigate, rowMetadata.comments())}
                >
                {commentsText}
            </TouchableOpacity>);
        const comments = this.props.openCommentsFn ? touchableComments : commentsText;
 		return (
	 		<View style={{ paddingTop: 10, paddingBottom: 10, flex: 200, flexDirection: 'column' }}>

	            <View style={{ flex: 100, paddingBottom: 5, flexDirection: 'row' }}>
            	  <TouchableOpacity
	                style={{ flex: 1, alignItems: 'flex-start' }}
	                onPress={ this.props.cellOnPressFn }
	                >
		              <Text
		                style={{ fontSize: 18 }}
		                allowFontScaling
		                numberOfLines={1}
		                >
		                {rowMetadata.title()}
		              </Text>
	              </TouchableOpacity>
	              <Text
	                style={{ fontSize: 12, paddingTop: 4, alignItems: 'flex-end' }}
	                allowFontScaling
	                numberOfLines={1}
	                >
	                {"by " + rowMetadata.user()}
	              </Text>
	            </View>

	            <View style={{ flex: 100, flexDirection: 'row' }}>
	              <View style={{ flex: 1, alignItems: 'flex-start' }}>
	              {comments}
	              </View>
	              <Text
	                style={{ fontSize: 12, alignItems: 'flex-end' }}
	                allowFontScaling
	                numberOfLines={1}
	                >
	                {rowMetadata.score() + " points"}
	              </Text>
	            </View>

	          </View>
          	);
 	}
}

StoryCell.propTypes = {
	navigate: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
	cellOnPressFn: PropTypes.func.isRequired,
	openCommentsFn: PropTypes.func
};

export default StoryCell;