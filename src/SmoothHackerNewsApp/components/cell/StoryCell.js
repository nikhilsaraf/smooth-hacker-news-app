/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import HtmlView from 'react-native-htmlview';

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
 			(<TouchableOpacity onPress={() => this.props.openCommentsFn(this.props.navigate, rowMetadata.commentCount())}>
      {commentsText}
      </TouchableOpacity>);
    const comments = this.props.openCommentsFn ? touchableComments : commentsText;

    const byUserComponent = rowMetadata.user() == null ? null :
      (<Text
        style={{ fontSize: this.props.subscriptFontSize, color: fontColor, alignItems: 'flex-end' }}
        allowFontScaling
        numberOfLines={1}
      >
      {"by " + rowMetadata.user()}
      </Text>);
    
    const titleText =
      (<Text style={{ fontSize: this.props.titleFontSize, color: fontColor }} allowFontScaling>
      {rowMetadata.title()}
      </Text>);
    const touchableTitleText =
      (<TouchableOpacity onPress={ this.props.cellOnPressFn }>
      {titleText}
      </TouchableOpacity>);
    const titleComponent = this.props.cellOnPressFn ? touchableTitleText : titleText;

    const optionalContent = !rowMetadata.content() ? null : 
      (<View style={{ paddingTop: 20 }}>
        <HtmlView
          value = {rowMetadata.content()}
          onLinkPress = { (url) => this.props.onContentLinkPress(rowMetadata, url) }
          stylesheet = {{
            p : {
              fontSize: this.props.textFontSize
            }
          }}
        />
      </View>);

 		return (
	 		<View style={{ flex: 1, paddingTop: 10, paddingBottom: 10, flexDirection: 'column' }}>

        <View style={{ flex: 1, paddingBottom: 8 }}>
      	{titleComponent}
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text
            style={{ flex: 1, fontSize: this.props.subscriptFontSize, color: fontColor, alignItems: 'flex-start' }}
            allowFontScaling
            numberOfLines={1}
          >
          {rowMetadata.score() + " points"}
          </Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {comments}
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
          { byUserComponent }
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={ () => this.props.onShare() }>
              <Text
                style={{ fontSize: this.props.subscriptFontSize, color: fontColor, alignItems: 'flex-start' }}
                allowFontScaling
                numberOfLines={1}
              >
              Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        { optionalContent }

      </View>);
 	}
}

StoryCell.propTypes = {
	navigate: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
  subscriptFontSize: PropTypes.number.isRequired,
  titleFontSize: PropTypes.number.isRequired,
  textFontSize: PropTypes.number.isRequired,
  onShare: PropTypes.func.isRequired,
  cellOnPressFn: PropTypes.func,
  openCommentsFn: PropTypes.func,
  onContentLinkPress: PropTypes.func
};

export default StoryCell;