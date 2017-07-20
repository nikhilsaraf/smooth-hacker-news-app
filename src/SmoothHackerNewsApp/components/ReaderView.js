/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { Cell, TableView } from 'react-native-tableview-simple';
import RowMetadata from '../data/RowMetadata';

class ReaderView extends React.Component {
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

ReaderView.propTypes = {
  navigate: PropTypes.func.isRequired
};

export default ReaderView;