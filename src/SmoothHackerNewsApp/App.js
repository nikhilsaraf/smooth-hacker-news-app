/**
 * @flow
 */

import React from 'react';
import { StackNavigator } from 'react-navigation';
import Article from './components/Article';
import ReaderView from './components/ReaderView';
import DataProvider from './data/DataProvider';

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News App',
  };

  render() {
    const { navigate } = this.props.navigation;
    return <ReaderView
    	dataProvider = {new DataProvider()}
    	navigate = { navigate }
    	/>;
  }
}

export default StackNavigator({
  Home: { screen: App },
  Article: { screen: Article }
});