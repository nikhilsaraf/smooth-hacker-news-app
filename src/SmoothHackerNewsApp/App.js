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

class App extends React.Component {
  _openComments(commentsDataProvider, depth, data, navigate, commentCount) {
    // we don't want to open any comments if there is nothing to show (0 comments case)
    if (commentCount == 0) {
      return;
    }
    
    const cellContentViewFactory = (props) => <CommentCell {...props} />;
    let firstCellView;
    let firstCellHeight;
    let dataProviderFn;
    if (depth == 1) {
      firstCellHeight = 0.15;
      firstCellView = (<StoryCell
        navigate = {navigate}
        data = {data}
        cellOnPressFn = { () => this._openWebView(navigate, data) }
        />);
      dataProviderFn = commentsDataProvider.fetchData.bind(commentsDataProvider, data.id());
    } else {
      firstCellHeight = 0.25;
      firstCellView = 
        (<ScrollView>
          <CommentCell navigate = {navigate} data = {data}/>
        </ScrollView>);
      dataProviderFn = (callbackFn) => callbackFn(data.children());
    }

    navigate('Comments', {
      title: 'Comment Depth = ' + depth,
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
    const topStoriesProvider = new StoryDataProvider(this.props.primaryUrl);
    const itemDataProvider = new ItemDataProvider('http://node-hnapi.herokuapp.com/item/');
    const commentsDataProvider = new CommentDataProvider(itemDataProvider);
    const cellContentViewFactory = (props) => <StoryCell
      {...props}
      openCommentsFn = { this._openComments.bind(this, commentsDataProvider, 1, props.data) }
      />;

    return (<ReaderView
      canRefresh = { true }
      navigate = { navigate }
      dataProviderFn = { topStoriesProvider.fetchData.bind(topStoriesProvider) }
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
      headerTitleStyle: { fontSize: 14 },
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
      headerTitleStyle: { fontSize: 14 },
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
      headerTitleStyle: { fontSize: 14 },
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
      headerTitleStyle: { fontSize: 14 },
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
      headerTitleStyle: { fontSize: 14 },
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="briefcase" color={tintColor} />)
    }
  }
}, {
  initialRouteName: "Top",
  tabBarOptions: {
    activeTintColor: '#000',
    inactiveTintColor: '#c1c1c1',
    labelStyle: { fontSize: 10 }
  }
});

export default StackNavigator({
  Home: { screen: tabNavigator },
  Article: { screen: Article },
  Comments: { screen: CommentsView }
});