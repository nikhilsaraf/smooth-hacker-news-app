/**
 * @flow
 */

import React from 'react';
import { ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Article from './components/view/Article';
import CommentsView from './components/view/CommentsView';
import ReaderView from './components/view/ReaderView';
import StoryCell from './components/cell/StoryCell';
import CommentCell from './components/cell/CommentCell';
import ItemDataProvider from './data/provider/ItemDataProvider';
import StoryDataProvider from './data/provider/StoryDataProvider';
import CommentDataProvider from './data/provider/CommentDataProvider';

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News',
    headerTitleStyle: { fontSize: 14 }
  };

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

  render() {
    const { navigate } = this.props.navigation;
    const topStoriesProvider = new StoryDataProvider('http://node-hnapi.herokuapp.com/news?page=1');
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
      cellOnPressFn = {this._openWebView}
    	/>);
  }
}

export default StackNavigator({
  Home: { screen: App },
  Article: { screen: Article },
  Comments: { screen: CommentsView }
});