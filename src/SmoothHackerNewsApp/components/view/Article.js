/**
 * @flow
 */

import React from 'react';
import { View, WebView, TouchableOpacity, Text } from 'react-native';

class Article extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		title: `${navigation.state.params.title}`,
		headerTitleStyle: { fontSize: navigation.state.params.headerTitleFontSize }
	});

	constructor(props) {
		super(props);
		this.state = {
	      canGoBack: false,
	      canGoForward: false
	    };
	}

	onBack() {
		this.refs["WEBVIEW_REF"].goBack();
	}

	onForward() {
		this.refs["WEBVIEW_REF"].goForward();
	}

	onNavigationStateChange(navState) {
		this.setState({
			canGoBack: navState.canGoBack,
			canGoForward: navState.canGoForward
		})
	}

	render() {
		const { params } = this.props.navigation.state;
		const fontColorButtonEnabled = "#2877ff";
		const fontColorButtonDisabled = "#7f7f7f";
		const buttonFontSize = 18;

		const shareButton = !params.onShare ? null :
			(<TouchableOpacity
			 	style = {{ flex: 1, alignItems: 'center' }}
				onPress = { params.onShare }
			>
				<Text style = {{
					fontSize: buttonFontSize,
					color: fontColorButtonEnabled
				}}>
				Share
				</Text>
			</TouchableOpacity>);

		return (
			<View style = {{ flex: 1 }}>
				<WebView
					ref="WEBVIEW_REF"
					style = {{ flex: 1 }}
					source = { { uri: params.url } }
		            scalesPageToFit = {true}
		            onNavigationStateChange = { this.onNavigationStateChange.bind(this) }
				/>
				<View style = {{ height: 30, alignItems: 'center', flexDirection: 'row' }}>
					<TouchableOpacity
					 	style = {{ flex: 1, alignItems: 'flex-start', paddingLeft: 10 }}
						disabled = { !this.state.canGoBack }
						onPress = { this.onBack.bind(this) }
					>
						<Text style = {{
							fontSize: buttonFontSize,
							color: this.state.canGoBack ? fontColorButtonEnabled : fontColorButtonDisabled
						}}>
						&lt; Back
						</Text>
					</TouchableOpacity>
					{shareButton}
					<TouchableOpacity
					 	style = {{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}
						disabled = { !this.state.canGoForward }
						onPress = { this.onForward.bind(this) }
					>
						<Text style = {{
							fontSize: buttonFontSize,
							color: this.state.canGoForward ? fontColorButtonEnabled : fontColorButtonDisabled
						}}>
						Next &gt;
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export default Article;