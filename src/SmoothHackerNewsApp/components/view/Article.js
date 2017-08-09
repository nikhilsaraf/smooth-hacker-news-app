/**
 * @flow
 */

import React from 'react';
import { WebView } from 'react-native';

class Article extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		title: `${navigation.state.params.title}`,
		headerTitleStyle: { fontSize: 14 }
	});

	render() {
		const { params } = this.props.navigation.state;
		return <WebView
			source = { { uri: params.url } }
            scalesPageToFit = {true}
		/>;
	}
}

export default Article;