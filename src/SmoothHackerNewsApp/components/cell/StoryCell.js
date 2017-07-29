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
 		return (
	 		<View style={{ paddingTop: 10, paddingBottom: 10, flex: 200, flexDirection: 'column' }}>

	            <View style={{ flex: 100, paddingBottom: 5, flexDirection: 'row' }}>
	              <Text
	                style={{ flex: 1, fontSize: 18, alignItems: 'flex-start' }}
	                allowFontScaling
	                numberOfLines={1}
	                >
	                {rowMetadata.title()}
	              </Text>
	              <Text
	                style={{ fontSize: 12, paddingTop: 4, alignItems: 'flex-end' }}
	                allowFontScaling
	                numberOfLines={1}
	                >
	                {"by " + rowMetadata.user()}
	              </Text>
	            </View>

	            <View style={{ flex: 100, flexDirection: 'row' }}>
	              <TouchableOpacity
	                style={{ flex: 1, alignItems: 'flex-start' }}
	                onPress={() => this.props.openCommentsFn(this.props.navigate, rowMetadata.comments())}
	                >
	                <Text
	                  style={{ fontSize: 12 }}
	                  allowFontScaling
	                  numberOfLines={1}
	                  >
	                  {rowMetadata.comments().length + " comments"}
	                </Text>
	              </TouchableOpacity>
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
	openCommentsFn: PropTypes.func.isRequired
};

export default StoryCell;