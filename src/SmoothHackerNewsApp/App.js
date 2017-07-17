/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Cell from './components/Cell';
import Article from './components/Article';

class RootView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Cell
          title = 'Alibaba Cloud'
          subtitle = ''
          url = 'https://www.alibabacloud.com/'
          navigate = { this.props.navigate }
          />
      </View>
    );
  }
}

RootView.propTypes = {
  navigate: PropTypes.func.isRequired
};

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News App',
  };

  render() {
    const { navigate } = this.props.navigation;
    return <RootView navigate = { navigate }/>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StackNavigator({
  Home: { screen: App },
  Article: { screen: Article }
});