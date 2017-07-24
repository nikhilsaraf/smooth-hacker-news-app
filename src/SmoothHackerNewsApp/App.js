/**
 * @flow
 */

import React from 'react';
import { StackNavigator } from 'react-navigation';
import Article from './components/Article';
import ReaderView from './components/ReaderView';
import DataProvider from './data/DummyDataProvider';

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News App',
  };

  render() {
    const { navigate } = this.props.navigation;
    const topStoriesProvider = new DataProvider('https://hacker-news.firebaseio.com/v0/topstories.json');
    return <ReaderView
    	dataProvider = { topStoriesProvider }
    	navigate = { navigate }
    	/>;
  }
}

export default StackNavigator({
  Home: { screen: App },
  Article: { screen: Article }
});