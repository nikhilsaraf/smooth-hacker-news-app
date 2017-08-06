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
 				style={{ fontSize: 10 }}
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
	 		<View style={{ paddingTop: 10, paddingBottom: 10, flex: 1, flexDirection: 'column' }}>

        <View style={{ flex: 1, paddingBottom: 5 }}>
      	  <TouchableOpacity
            onPress={ this.props.cellOnPressFn }
            >
            <Text
              style={{ fontSize: 14 }}
              allowFontScaling
              >
              {rowMetadata.title()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
              <Text
                style={{ fontSize: 10, alignItems: 'flex-start' }}
                allowFontScaling
                numberOfLines={1}
                >
                {rowMetadata.score() + " points"}
              </Text>
              <Text
                style={{ fontSize: 10, paddingLeft: 4, alignItems: 'flex-end' }}
                allowFontScaling
                numberOfLines={1}
                >
                {"by " + rowMetadata.user()}
              </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {comments}
          </View>
        </View>

      </View>);
 	}
}

StoryCell.propTypes = {
	navigate: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
	cellOnPressFn: PropTypes.func.isRequired,
	openCommentsFn: PropTypes.func
};

export default StoryCell;