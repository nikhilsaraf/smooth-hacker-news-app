/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Article from './components/Article';
import { Cell, TableView } from 'react-native-tableview-simple';
import RowMetadata from './data/RowMetadata';

class RootView extends React.Component {
  _openWebView(title, url) {
    console.log('opening web view for url: ' + url);
    this.props.navigate('Article', {
      title: title,
      url: url
    });
  }

  _makeRow(i, rowMetadata) {
    return (
      <Cell
        key = {i}
        cellStyle="Basic"
        title={rowMetadata.title()}
        subtitle={rowMetadata.subtitle()}
        onPress={() => this._openWebView(rowMetadata.title(), rowMetadata.url())}
      />
    );
  }

  _generateRows(data) {
    rows = [];
    for (var i = 0; i < data.length; i++) {
      rows.push(this._makeRow(i, data[i]));
    }
    return rows;
  }

  render() {
    const data = [
      new RowMetadata('Alibaba Cloud', '', 'https://www.alibabacloud.com/'),
      new RowMetadata('Google', '', 'https://google.com/')
    ];
    const rows = this._generateRows(data);
    return (
      <ScrollView>
        <TableView>
          {rows}
        </TableView>
      </ScrollView>
    );
  }
}

RootView.propTypes = {
  navigate: PropTypes.func.isRequired
};

class App extends React.Component {
  static navigationOptions = {
    title: 'Smooth Hacker News App',
  };

  render() {
    const { navigate } = this.props.navigation;
    return <RootView navigate = { navigate }/>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StackNavigator({
  Home: { screen: App },
  Article: { screen: Article }
});