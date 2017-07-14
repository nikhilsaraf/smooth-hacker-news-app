/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

class Cell extends React.Component {
	render() {
		return (
			<View onclick='javascript:open({this.props.url})'>
				<View>
					<Text>{this.props.title}</Text>
				</View>
				<View>
					<Text>{this.props.subtitle}</Text>
				</View>
			</View>
		);
	}
}

Cell.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired
};

export default Cell;