/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import HtmlView from 'react-native-htmlview';

 class CommentCell extends React.Component {
 	constructor(props) {
 		super(props);
 	}

 	render() {
 		const commentMetadata = this.props.data;
 		return (
	 		<View style={{ paddingTop: 10, paddingBottom: 10, flexDirection: 'column' }}>

	            <View style={{ paddingBottom: 5, flexDirection: 'row' }}>
	              <HtmlView
	              	value = {commentMetadata.text()}
	              	onLinkPress = {
	              	    (url) => this.props.navigate('Article', {
	              	        title: url,
	              	        url: url
	              	    })
	              	}
              	  />
	            </View>

	            <View style={{ flexDirection: 'row' }}>
		          <Text
		              style={{ flex: 1, fontSize: 10, alignItems: 'flex-start' }}
		              allowFontScaling
		              numberOfLines={1}
	              >
	              {"by " + commentMetadata.user()}
	              </Text>
	              <Text
			 		style={{ fontSize: 10, alignItems: 'flex-end' }}
			 		allowFontScaling
			 	  	numberOfLines={1}
		 		  >
		 		  {commentMetadata.children().length + " replies"}
				  </Text>
	            </View>

	          </View>
          	);
 	}
}

CommentCell.propTypes = {
	navigate: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired
};

export default CommentCell;