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
import DataProvider from './data/DummyDataProvider';
import CommentDataProvider from './data/DummyCommentDataProvider';

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News App',
  };

  _openComments(commentsDataProvider, navigate, commentIds) {
    console.log('opening comments for commentIds: ' + JSON.stringify(commentIds));
    const cellContentViewFactory = (props) => <CommentCell
      {...props}
      openCommentsFn = { this._openComments.bind(this, commentsDataProvider) }
      />;
    navigate('Comments', {
      navigate: navigate,
      dataProviderFn: commentsDataProvider.fetchData.bind(commentsDataProvider, commentIds),
      cellContentViewFactory: cellContentViewFactory,
      cellOnPressFn: this._openComments.bind(this, commentsDataProvider)
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
    const topStoriesProvider = new DataProvider('https://hacker-news.firebaseio.com/v0/topstories.json');
    const commentsDataProvider = new CommentDataProvider();
    const cellContentViewFactory = (props) => <StoryCell
      {...props}
      openCommentsFn = { this._openComments.bind(this, commentsDataProvider) }
      />;

    return (<ReaderView
      navigate = { navigate }
      dataProviderFn = { topStoriesProvider.fetchData }
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