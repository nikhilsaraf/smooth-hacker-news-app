/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Cell, TableView } from 'react-native-tableview-simple';

class ReaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataList: null };
  }

  _makeRow(i, data) {
    const bgColor = i % 2 == 0 ? '#effaff' : '#f7f7f7';
    const cellContentView = this.props.cellContentViewFactory({
      navigate: this.props.navigate,
      data: data
    });

    return (
      <Cell
        key = {i}
        cellContentView={ cellContentView }
        onPress={ () => this.props.cellOnPressFn(this.props.navigate, data) }
        backgroundColor={bgColor}
      />
    );
  }

  _generateRows(dataList) {
    rows = [];
    for (let i = 0; i < dataList.length; i++) {
      rows.push(this._makeRow(i, dataList[i]));
    }
    return rows;
  }

  componentDidMount() {
    // make network request to load data, which will set state
    this.props.dataProviderFn((dataList) => {
      this.setState({
        dataList: dataList
      });
    });
  }

  render() {
    if (!this.state.dataList) {
      return (<ActivityIndicator
        size="large"
        style={{ flex: 1 }} />);
    }

    const rows = this._generateRows(this.state.dataList);
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
  dataProviderFn: PropTypes.func.isRequired,
  cellContentViewFactory: PropTypes.func.isRequired,
  cellOnPressFn: PropTypes.func.isRequired
};

export default ReaderView;