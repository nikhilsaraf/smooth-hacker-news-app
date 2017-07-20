/**
 * @flow
 */

import React from 'react';
import { StackNavigator } from 'react-navigation';
import Article from './components/Article';
import ReaderView from './components/ReaderView';

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News App',
  };

  render() {
    const { navigate } = this.props.navigation;
    return <ReaderView navigate = { navigate }/>;
  }
}

export default StackNavigator({
  Home: { screen: App },
  Article: { screen: Article }
});