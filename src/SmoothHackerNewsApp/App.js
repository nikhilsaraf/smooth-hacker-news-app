/**
 * @flow
 */

import React from 'react';
import { ScrollView, AsyncStorage, Linking, Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Article from './components/view/Article';
import CommentsView from './components/view/CommentsView';
import ReaderView from './components/view/ReaderView';
import StoryCell from './components/cell/StoryCell';
import CommentCell from './components/cell/CommentCell';
import ItemDataProvider from './data/provider/ItemDataProvider';
import StoryDataProvider from './data/provider/StoryDataProvider';
import CommentDataProvider from './data/provider/CommentDataProvider';
import { Icon } from 'react-native-elements';
import Metrics from './metrics/Metrics';

const subscriptFontSize = 12;
const textFontSize = 16;
const headerTitleFontSize = 14;
const tabFontSize = 12;

class App extends React.Component {

  _openCommentLink(navigate, depth, idx, commentMetadata, url) {
    this.props.metrics.track('Comment: pressed link', {
      url: url,
      index: idx,
      depth: depth,
      data: commentMetadata.forMetrics()
    });

    console.log('opening web view for url: ' + url);
    navigate('Article', {
      title: url,
      headerTitleFontSize: headerTitleFontSize,
      url: url
    });
  }

  _onScroll(fromViewName, depth, yOffset) {
    this.props.metrics.track('Scroll', {
      fromView: fromViewName,
      depth: depth,
      yOffset: yOffset
    });
  }

  _openComments(commentsDataProvider, depth, data, navigate, commentCount) {
    // we don't want to open any comments if there is nothing to show (0 comments case)
    if (commentCount == 0) {
      return;
    }

    const cellContentViewFactory = (props, _1, idx, _2) => <CommentCell
      data = { props.data }
      subscriptFontSize={subscriptFontSize}
      onLinkPress = { this._openCommentLink.bind(this, navigate, depth, idx) }
      />;
    let firstCellView;
    let firstCellHeight;
    let dataProviderFn;
    if (depth == 1) {
      firstCellHeight = 0.19;
      const onTitlePressFn = this._isWebLink(data) ? this._openWebView.bind(this, 'Comments View', -1, navigate, data) : null;
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
        (<ScrollView
          scrollEventThrottle = {250}
          onScroll = { (event) => this._onScroll('Top Level Comment', depth, event.nativeEvent.contentOffset.y) }
          >
          <CommentCell
            data = {data}
            subscriptFontSize = {subscriptFontSize}
            onLinkPress = { this._openCommentLink.bind(this, navigate, depth, -1) }
          />
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
      cellOnPressFn: ((_1, idx, _2, navigate, comment) => {
        this.props.metrics.track('Comment: drill down', {
          index: idx,
          depth: depth,
          data: comment.forMetrics()
        });
        this._openComments(commentsDataProvider, depth + 1, comment, navigate, comment.children().length);
      }),
      onPressRateApp: this._onPressRateApp.bind(this, 'Comments View', depth),
      onLoadDataStart: this._onLoadDataStart.bind(this, 'Comments View', depth),
      onLoadDataFinish: this._onLoadDataFinish.bind(this, 'Comments View', depth),
      onScroll: this._onScroll.bind(this, 'Comments View', depth)
    });
  }

  _onPressRateApp(fromViewName, depth, listLength) {
    this.props.metrics.track('Rate App', {
      depth: depth,
      fromView: fromViewName,
      list_length: listLength
    });

    Linking.openURL("https://shn.app.link/rate-story-list");
  }

  _openWebView(fromViewName, idx, navigate, rowMetadata) {
    this.props.metrics.track('Story: pressed story', {
      index: idx,
      fromView: fromViewName,
      isUrl: true,
      data: rowMetadata.forMetrics()
    });

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

  _onStoryCellPress(commentsDataProvider, markReadFn, dataList, idx, updateListFn, navigate, rowMetadata) {
    // mark the item as read
    markReadFn(rowMetadata);

    // update the view to indicate the updated cell
    updateListFn(this._makeNewListByMarkingAsRead(dataList, idx));

    if (this._isWebLink(rowMetadata)) {
      this._openWebView('Story List View', idx, navigate, rowMetadata);
    } else {
      this.props.metrics.track('Story: pressed story', {
        index: idx,
        fromView: 'Story List View',
        isUrl: false,
        data: rowMetadata.forMetrics()
      });
      this._openComments(commentsDataProvider, 1, rowMetadata, navigate, rowMetadata.commentCount());
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

  _onLoadDataStart(fromViewName, depth, isRefresh) {
    this.props.metrics.track('Load Data: start', {
      fromView: fromViewName,
      depth: depth,
      isRefresh: isRefresh
    });
  }

  _onLoadDataFinish(fromViewName, depth, isRefresh, timeMs, dataList) {
    const mappedDataList = dataList.map((item) => item.forMetrics());
    this.props.metrics.track('Load Data: finish', {
      fromView: fromViewName,
      depth: depth,
      isRefresh: isRefresh,
      timeMs: timeMs,
      dataList: mappedDataList,
      dataListSize: dataList.length
    });
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
          this.props.metrics.track('Story: pressed comments', {
            index: idx,
            data: props.data.forMetrics()
          });
          this._openComments(commentsDataProvider, 1, props.data, navigate, commentCount);
        }
      }
      />;

    return (<ReaderView
      canRefresh = { true }
      navigate = { navigate }
      dataProviderFn = { storiesDataProvider.fetchData.bind(storiesDataProvider) }
      cellContentViewFactory = { cellContentViewFactory }
      cellOnPressFn = { this._onStoryCellPress.bind(this, commentsDataProvider, markReadFn) }
      onPressRateApp = { this._onPressRateApp.bind(this, 'Story List View', 0) }
      onLoadDataStart = { this._onLoadDataStart.bind(this, 'Story List View', 0) }
      onLoadDataFinish = { this._onLoadDataFinish.bind(this, 'Story List View', 0) }
      onScroll = { () => {} /* doesn't work with PullToRefresh (canRefresh=true) for now */ }
  	/>);
  }
}
const metrics = Metrics.makeInitialized();
const tabNavigator = TabNavigator({
  Ask: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/ask?page=1"
      metrics = { metrics.bindTab('Ask').bindSource('hn') }
      />),
    navigationOptions: {
      tabBarLabel: 'Ask',
      title: "Ask Hacker News",
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="question" color={tintColor} />)
    }
  },
  Show: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/show?page=1"
      metrics = { metrics.bindTab('Show').bindSource('hn') }
      />),
    navigationOptions: {
      tabBarLabel: 'Show',
      title: "Show Hacker News",
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="rocket" color={tintColor} />)
    }
  },
  Top: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/news?page=1"
      metrics = { metrics.bindTab('Top').bindSource('hn') }
      />),
    navigationOptions: {
      tabBarLabel: 'Top',
      title: "Smooth Hacker News",
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="newspaper-o" color={tintColor} />)
    }
  },
  New: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/newest?page=1"
      metrics = { metrics.bindTab('New').bindSource('hn') }
      />),
    navigationOptions: {
      tabBarLabel: 'New',
      title: "New Hacker News",
      tabBarIcon: (({ tintColor }) => <Icon type="foundation" name="burst-new" color={tintColor} />)
    }
  },
  Jobs: {
    screen: ((props) => <App
      navigation = {props.navigation}
      primaryUrl = "http://node-hnapi.herokuapp.com/jobs?page=1"
      metrics = { metrics.bindTab('Jobs').bindSource('hn') }
      />),
    navigationOptions: {
      tabBarLabel: 'Jobs',
      title: "Hacker News Jobs",
      tabBarIcon: (({ tintColor }) => <Icon type="font-awesome" name="briefcase" color={tintColor} />)
    }
  }
}, {
  initialRouteName: "Top",
  tabBarOptions: {
    // common options for iOS & Android -- TabBarBottom and TabBarTop
    activeTintColor: '#000',
    inactiveTintColor: '#c1c1c1',
    labelStyle: { fontSize: tabFontSize },
    style: { backgroundColor: "#fff" },

    // additional options for Android -- TabBarTop
    showIcon: true,
    upperCaseLabel: false,
    indicatorStyle: { backgroundColor: "#000" }
  }
});
const navigationOptions = {
  headerTitleStyle: {
    fontSize: headerTitleFontSize,
    textAlign: 'center',
    alignSelf: 'center'
  }
};
const rightPadding = { paddingRight: Platform.OS == 'ios' ? 0 : 40 };
const MyStackNavigator = StackNavigator({
  Home: {
    screen: tabNavigator,
    navigationOptions: navigationOptions
  },
  Article: {
    screen: Article,
    navigationOptions: Object.assign({}, navigationOptions, rightPadding)
  },
  Comments: {
    screen: CommentsView,
    navigationOptions: Object.assign({}, navigationOptions, rightPadding)
  }
}, {
  navigationOptions: {
    headerStyle: {
      marginTop: Platform.OS == 'ios' ? 0 : 30
    }
  }
});

const getRouteName = (navigationState) => {
  const route = navigationState.routes[navigationState.index];
  const currentPart = route.routeName;
  if (route.routes) {
    return getRouteName(route) + "/" + currentPart;
  }
  return currentPart;
};
const trackNavigation = (prevState, currentState) => {
  const prevScreen = getRouteName(prevState);
  const currentScreen = getRouteName(currentState);

  if (prevScreen !== currentScreen) {
    metrics.trackNavigation(prevScreen, currentScreen);
  }
};

export default () => <MyStackNavigator onNavigationStateChange = { trackNavigation }/>;