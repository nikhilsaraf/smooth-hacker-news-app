/**
 * @flow
 */

import React from 'react';
import { ScrollView, AsyncStorage } from 'react-native';
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
    
    const cellContentViewFactory = (props, _1, _2, _3) => <CommentCell {...props} subscriptFontSize={subscriptFontSize} />;
    let firstCellView;
    let firstCellHeight;
    let dataProviderFn;
    if (depth == 1) {
      firstCellHeight = 0.19;
      const onTitlePressFn = this._isWebLink(data) ? this._openWebView.bind(this, navigate, data) : null;
      console.log('displaying first story cell...');
      console.log(data);
      new ItemDataProvider('http://node-hnapi.herokuapp.com/item/').fetchData([data.id()], (itemObjects) => {
        // 'content' data will show up here becuase we've loaded the story directly (rather than by topstories or show, etc.)
        // need to find some way to pre-load this every time and set it on the data.
        // one approach is to conver the data to a dataProvider so this can be asynchronous and/or we can reload it
        // although it's wasteful to reload every one every time -- we are already loading it once in the commentsDataProvider, so...
        // this brings me to the second (preferred) solution, to split up the data received from the commentsDataProvider into two parts,
        // one for the parent and the other for the comments (or we can just extract the content portion of it).
        // this will require potentially creating a wrapper around the commentsDataProvider that will route the parentData and commentsData
        // accordingly.
        console.log(itemObjects[0]);
      });
      // firstCellView for comments should always look like they're unread
      firstCellView = (<StoryCell
        navigate = {navigate}
        data = { data.withReadStatus(false) }
        textFontSize = {textFontSize}
        subscriptFontSize = {subscriptFontSize}
        cellOnPressFn = { onTitlePressFn }
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
      cellOnPressFn: ((_1, _2, _3, navigate, comment) => this._openComments(commentsDataProvider, depth + 1, comment, navigate, comment.children().length))
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

  _isWebLink(rowMetadata) {
    return !rowMetadata.url().startsWith("item?");
  }

  _onStoryCellPress(commentsDataProvider, depth, markReadFn, dataList, idx, updateListFn, navigate, rowMetadata) {
    // mark the item as read
    markReadFn(rowMetadata);

    // update the view to indicate the updated cell
    updateListFn(this._makeNewListByMarkingAsRead(dataList, idx));

    if (this._isWebLink(rowMetadata)) {
      this._openWebView(navigate, rowMetadata);
    } else {
      this._openComments(commentsDataProvider, depth, rowMetadata, navigate, rowMetadata.commentCount());
    }
  }

  _makeSaveKey(id) {
    return '@nikhilsaraf/SHN:' + id;
  }

  _isRead(id, callbackFn) {
    const key = this._makeSaveKey(id);
    try {
      // asynchronous so need to use a callback wrapper
      AsyncStorage.getItem(key, (error, value) => {
        // value is nullable so check directly for 'true'
        callbackFn(value === 'true' ? true : false);
      });
    } catch (error) {
      console.log('error retrieving save status for key (' + key + '): ' + error);
      // invoke callback in finally block to prevent blocking on errors
      callbackFn(false);
    }
  }

  _markRead(rowMetadata) {
    // short-circuit if no writing needed
    // if (rowMetadata.isRead()) {
    //   return rowMetadata;
    // }
    const key = this._makeSaveKey(rowMetadata.id());
    const newReadStatus = true;

    try {
      // asynchronous; we don't need the result so ignore it
      AsyncStorage.setItem(key, JSON.stringify(newReadStatus));
    } catch (error) {
      console.log('error saving for key (' + key + '): ' + error);
    }
  }

  _makeNewListByMarkingAsRead(currentList, idx) {
    const updatedDataList = currentList.slice();
    updatedDataList[idx] = updatedDataList[idx].withReadStatus(true);
    return updatedDataList;
  }

  render() {
    const { navigate } = this.props.navigation;
    const markReadFn = this._markRead.bind(this);
    const storiesDataProvider = new StoryDataProvider(this.props.primaryUrl, this._isRead.bind(this));
    const itemDataProvider = new ItemDataProvider('http://node-hnapi.herokuapp.com/item/');
    const commentsDataProvider = new CommentDataProvider(itemDataProvider);
    const cellContentViewFactory = (props, currentList, idx, updateListFn) => <StoryCell
      {...props}
      textFontSize = {textFontSize}
      subscriptFontSize = {subscriptFontSize}
      openCommentsFn = {
        (navigate, commentCount) => {
          markReadFn(props.data);
          updateListFn(this._makeNewListByMarkingAsRead(currentList, idx));
          this._openComments(commentsDataProvider, 1, props.data, navigate, commentCount);
        }
      }
      />;

    return (<ReaderView
      canRefresh = { true }
      navigate = { navigate }
      dataProviderFn = { storiesDataProvider.fetchData.bind(storiesDataProvider) }
      cellContentViewFactory = { cellContentViewFactory }
      cellOnPressFn = { this._onStoryCellPress.bind(this, commentsDataProvider, 1, markReadFn) }
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