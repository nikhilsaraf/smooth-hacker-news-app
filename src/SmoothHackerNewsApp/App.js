/**
 * @flow
 */

import React from 'react';
import { StackNavigator } from 'react-navigation';
import Article from './components/Article';
import CommentsView from './components/CommentsView';
import ReaderView from './components/ReaderView';
import StoryCell from './components/StoryCell';
import CommentCell from './components/CommentCell';
import ItemDataProvider from './data/ItemDataProvider';
import DataProvider from './data/DummyDataProvider';
import CommentDataProvider from './data/DummyCommentDataProvider';

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News App',
  };

  _openComments(commentsDataProvider, depth, navigate, commentIds) {
    // we don't want to open any comments if there is nothing to show (0 comments case)
    if (commentIds.length == 0) {
      return;
    }
    
    console.log('opening comments for commentIds: ' + JSON.stringify(commentIds));
    const cellContentViewFactory = (props) => <CommentCell
      {...props}
      openCommentsFn = { this._openComments.bind(this, commentsDataProvider, depth + 1) }
      />;
    navigate('Comments', {
      title: 'Comment Depth = ' + depth,
      navigate: navigate,
      dataProviderFn: commentsDataProvider.fetchData.bind(commentsDataProvider, commentIds),
      cellContentViewFactory: cellContentViewFactory,
      cellOnPressFn: ((navigate, comment) => this._openComments(commentsDataProvider, depth + 1, navigate, comment.children()))
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

  render() {
    const { navigate } = this.props.navigation;
    const itemDataProvider = new ItemDataProvider('https://hacker-news.firebaseio.com/v0/item/', '.json');
    const topStoriesProvider = new DataProvider('https://hacker-news.firebaseio.com/v0/topstories.json', itemDataProvider);
    const commentsDataProvider = new CommentDataProvider(itemDataProvider);
    const cellContentViewFactory = (props) => <StoryCell
      {...props}
      openCommentsFn = { this._openComments.bind(this, commentsDataProvider, 1) }
      />;

    return (<ReaderView
      navigate = { navigate }
      dataProviderFn = { topStoriesProvider.fetchData.bind(topStoriesProvider) }
      cellContentViewFactory = { cellContentViewFactory }
      cellOnPressFn = {this._openWebView}
    	/>);
  }
}

export default StackNavigator({
  Home: { screen: App },
  Article: { screen: Article },
  Comments: { screen: CommentsView }
});