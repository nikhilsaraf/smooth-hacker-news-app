/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

class Cell extends React.Component {
	render() {
		return (
			<TouchableHighlight onPress={() => this._openWebView(this.props.title, this.props.url)}>
				<View>
					<View>
						<Text>{this.props.title}</Text>
					</View>
					<View>
						<Text>{this.props.subtitle}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}

	_openWebView(title, url) {
		console.log('opening web view for url: ' + url);
		const articleData = {
			title: title,
			url: url
		};
		this.props.navigate('Article', articleData);
	}
}

Cell.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	navigate: PropTypes.func.isRequired
};

export default Cell;