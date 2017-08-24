/**
 * @flow
 */

import React from 'react';
import { ScrollView } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Article from './components/view/Article';
import CommentsView from './components/view/CommentsView';
import ReaderView from './components/view/ReaderView';
import StoryCell from './components/cell/StoryCell';
import CommentCell from './components/cell/CommentCell';
import ItemDataProvider from './data/provider/ItemDataProvider';
import StoryDataProvider from './data/provider/StoryDataProvider';
import CommentDataProvider from './data/provider/CommentDataProvider';
import { Icon } from 'react-native-elements'

const subscriptFontSize = 12;
const textFontSize = 16;
const headerTitleFontSize = 14;
const tabFontSize = 12;

class App extends React.Component {
  _openComments(commentsDataProvider, depth, data, navigate, commentCount) {
    // we don't want to open any comments if there is nothing to show (0 comments case)
    if (commentCount == 0) {
      return;
    }
    
    const cellContentViewFactory = (props) => <CommentCell {...props} subscriptFontSize={subscriptFontSize} />;
    let firstCellView;
    let firstCellHeight;
    let dataProviderFn;
    if (depth == 1) {
      firstCellHeight = 0.15;
      firstCellView = (<StoryCell
        navigate = {navigate}
        data = {data}
        textFontSize = {textFontSize}
        subscriptFontSize = {subscriptFontSize}
        cellOnPressFn = { () => this._openWebView(navigate, data) }
        />);
      dataProviderFn = commentsDataProvider.fetchData.bind(commentsDataProvider, data.id());
    } else {
      firstCellHeight = 0.25;
      firstCellView = 
        (<ScrollView>
          <CommentCell
            navigate = {navigate}
            data = {data}
            subscriptFontSize = {subscriptFontSize} />
        </ScrollView>);
      dataProviderFn = (callbackFn) => callbackFn(data.children());
    }

    navigate('Comments', {
      title: 'Comment Depth = ' + depth,
      headerTitleFontSize: headerTitleFontSize,
      navigate: navigate,
      firstCellHeight: firstCellHeight,
      firstCellView: firstCellView,
      dataProviderFn: dataProviderFn,
      cellContentViewFactory: cellContentViewFactory,
      cellOnPressFn: ((navigate, comment) => this._openComments(commentsDataProvider, depth + 1, comment, navigate, comment.children().length))
    });
  }

  _openWebView(navigate, rowMetadata) {
    const title = rowMetadata.title();
    const url = rowMetadata.url();

    console.log('opening web view for url: ' + url);
    navigate('Article', {
      title: title,
      headerTitleFontSize: headerTitleFontSize,
      url: url
    });
  }

  _onCellPress(commentsDataProvider, depth, navigate, data) {
    if (data.url().startsWith("item?")) {
      this._openComments(commentsDataProvider, depth, data, navigate, data.commentCount());
    } else {
      this._openWebView(navigate, data);
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const isReadFn = ((id, callbackFn) => callbackFn(true));
    const storiesDataProvider = new StoryDataProvider(this.props.primaryUrl, isReadFn);
    const itemDataProvider = new ItemDataProvider('http://node-hnapi.herokuapp.com/item/');
    const commentsDataProvider = new CommentDataProvider(itemDataProvider);
    const cellContentViewFactory = (props) => <StoryCell
      {...props}
      textFontSize = {textFontSize}
      subscriptFontSize = {subscriptFontSize}
      openCommentsFn = { this._openComments.bind(this, commentsDataProvider, 1, props.data) }
      />;

    return (<ReaderView
      canRefresh = { true }
      navigate = { navigate }
      dataProviderFn = { storiesDataProvider.fetchData.bind(storiesDataProvider) }
      cellContentViewFactory = { cellContentViewFactory }
      cellOnPressFn = { this._onCellPress.bind(this, commentsDataProvider, 1) }
    	/>);
  }
}

const tabNavigator = TabNavigator({
  Ask: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/ask?page=1"
      />),
    navigationOptions: {
      tabBarLabel: 'Ask',
      title: "Ask Hacker News",
      headerTitleStyle: { fontSize: headerTitleFontSize },
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="question" color={tintColor} />)
    }
  },
  Show: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/show?page=1"
      />),
    navigationOptions: {
      tabBarLabel: 'Show',
      title: "Show Hacker News",
      headerTitleStyle: { fontSize: headerTitleFontSize },
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="rocket" color={tintColor} />)
    }
  },
  Top: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/news?page=1"
      />),
    navigationOptions: {
      tabBarLabel: 'Top',
      title: "Smooth Hacker News",
      headerTitleStyle: { fontSize: headerTitleFontSize },
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="newspaper-o" color={tintColor} />)
    }
  },
  New: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/newest?page=1"
      />),
    navigationOptions: {
      tabBarLabel: 'New',
      title: "New Hacker News",
      headerTitleStyle: { fontSize: headerTitleFontSize },
      tabBarIcon: (({ tintColor }) => <Icon type="foundation" name="burst-new" color={tintColor} />)
    }
  },
  Jobs: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/jobs?page=1"
      />),
    navigationOptions: {
      tabBarLabel: 'Jobs',
      title: "Hacker News Jobs",
      headerTitleStyle: { fontSize: headerTitleFontSize },
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="briefcase" color={tintColor} />)
    }
  }
}, {
  initialRouteName: "Top",
  tabBarOptions: {
    activeTintColor: '#000',
    inactiveTintColor: '#c1c1c1',
    labelStyle: { fontSize: tabFontSize }
  }
});

export default StackNavigator({
  Home: { screen: tabNavigator },
  Article: { screen: Article },
  Comments: { screen: CommentsView }
});