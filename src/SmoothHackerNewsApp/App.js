/**
 * @flow
 */

import React from 'react';
import { StackNavigator } from 'react-navigation';
import Article from './components/view/Article';
import CommentsView from './components/view/CommentsView';
import ReaderView from './components/view/ReaderView';
import StoryCell from './components/cell/StoryCell';
import CommentCell from './components/cell/CommentCell';
import ItemDataProvider from './data/provider/ItemDataProvider';
import StoryDataProvider from './data/dummyprovider/StoryDataProvider';
import CommentDataProvider from './data/dummyprovider/CommentDataProvider';

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News App',
  };

  _openComments(commentsDataProvider, depth, data, navigate, commentIds) {
    // we don't want to open any comments if there is nothing to show (0 comments case)
    if (commentIds.length == 0) {
      return;
    }
    
    console.log('opening comments for commentIds: ' + JSON.stringify(commentIds));
    const cellContentViewFactory = (props) => <CommentCell
      {...props}
      openCommentsFn = { this._openComments.bind(this, commentsDataProvider, depth + 1, props.data) }
      />;

    let firstCellView;
    if (depth == 1) {
      firstCellView = (<StoryCell
        navigate = {navigate}
        data = {data}
        cellOnPressFn = { () => this._openWebView(navigate, data) }
        openCommentsFn = { () => {} }
        />);
    } else {
      firstCellView = (<CommentCell
        navigate = {navigate}
        data = {data}
        openCommentsFn = { () => {} }
        />);
    }

    navigate('Comments', {
      title: 'Comment Depth = ' + depth,
      navigate: navigate,
      firstCellView: firstCellView,
      dataProviderFn: commentsDataProvider.fetchData.bind(commentsDataProvider, commentIds),
      cellContentViewFactory: cellContentViewFactory,
      cellOnPressFn: ((navigate, comment) => this._openComments(commentsDataProvider, depth + 1, comment, navigate, comment.children()))
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
    const topStoriesProvider = new StoryDataProvider('https://hacker-news.firebaseio.com/v0/topstories.json', itemDataProvider);
    const commentsDataProvider = new CommentDataProvider(itemDataProvider);
    const cellContentViewFactory = (props) => <StoryCell
      {...props}
      openCommentsFn = { this._openComments.bind(this, commentsDataProvider, 1, props.data) }
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