/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ScrollView } from 'react-native';
import { Cell, TableView } from 'react-native-tableview-simple';

class ReaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowMetadataList: null
    };
  }

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
    for (let i = 0; i < data.length; i++) {
      rows.push(this._makeRow(i, data[i]));
    }
    return rows;
  }

  componentDidMount() {
    // make network request to load data, which will set state
    this.props.dataProvider.fetchData((rowMetadataList) => {
      this.setState({
        rowMetadataList: rowMetadataList
      });
    });
  }

  render() {
    if (!this.state.rowMetadataList) {
      return (
        <View>
          <Text>Loading Data</Text>
        </View>
      );
    }

    const rows = this._generateRows(this.state.rowMetadataList);
    return (
      <ScrollView>
        <TableView>
          {rows}
        </TableView>
      </ScrollView>
    );
  }
}

ReaderView.propTypes = {
  navigate: PropTypes.func.isRequired,
  dataProvider: PropTypes.object.isRequired
};

export default ReaderView;