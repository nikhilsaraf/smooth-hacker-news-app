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
    const fontColor = rowMetadata.isRead() ? '#a3a3a3' : '#000';
    
    const commentsText =
 			(<Text
 				style={{ fontSize: this.props.subscriptFontSize, color: fontColor }}
                allowFontScaling
                numberOfLines={1}
                >
                {rowMetadata.commentCount() + " comments"}
            </Text>);
 		const touchableComments =
 			(<TouchableOpacity
                onPress={() => this.props.openCommentsFn(this.props.navigate, rowMetadata.commentCount())}
                >
                {commentsText}
            </TouchableOpacity>);
        const comments = this.props.openCommentsFn ? touchableComments : commentsText;

    const byUserComponent = rowMetadata.user() == null ? null : (<Text
      style={{ fontSize: this.props.subscriptFontSize, color: fontColor, paddingLeft: 4, alignItems: 'flex-end' }}
      allowFontScaling
      numberOfLines={1}
      >
      {"by " + rowMetadata.user()}
      </Text>);
    
    const titleText =
      (<Text style={{ fontSize: this.props.textFontSize, color: fontColor }} allowFontScaling>
      {rowMetadata.title()}
      </Text>);
    const touchableTitleText =
      (<TouchableOpacity onPress={ this.props.cellOnPressFn }>
      {titleText}
      </TouchableOpacity>);
    const titleComponent = this.props.cellOnPressFn ? touchableTitleText : titleText;

 		return (
	 		<View style={{ paddingTop: 10, paddingBottom: 10, flex: 1, flexDirection: 'column' }}>

        <View style={{ flex: 1, paddingBottom: 8 }}>
      	{titleComponent}
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
              <Text
                style={{ fontSize: this.props.subscriptFontSize, color: fontColor, alignItems: 'flex-start' }}
                allowFontScaling
                numberOfLines={1}
                >
                {rowMetadata.score() + " points"}
              </Text>
              { byUserComponent }
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
  subscriptFontSize: PropTypes.number.isRequired,
  textFontSize: PropTypes.number.isRequired,
  cellOnPressFn: PropTypes.func,
  openCommentsFn: PropTypes.func
};

export default StoryCell;