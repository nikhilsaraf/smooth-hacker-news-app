/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Cell, TableView } from 'react-native-tableview-simple';
import PullToRefresh from 'react-native-pull-to-refresh';

class ReaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataList: null };
  }

  _makeRow(i, data) {
    const updateListFn = (dataList) => {
      this.setState({
        dataList: dataList
      });
    };
    const cellOnPressFn = (() => this.props.cellOnPressFn(this.state.dataList, i, updateListFn, this.props.navigate, data));
    const bgColor = i % 2 == 0 ? '#effaff' : '#f7f7f7';
    const cellContentView = this.props.cellContentViewFactory({
      navigate: this.props.navigate,
      data: data,
      cellOnPressFn: cellOnPressFn
    }, this.state.dataList, i, updateListFn);

    return (
      <Cell
        key = {i}
        cellContentView={ cellContentView }
        onPress={ cellOnPressFn }
        backgroundColor={bgColor}
      />
    );
  }

  _generateRows(dataList) {
    const rows = [];
    for (let i = 0; i < dataList.length; i++) {
      rows.push(this._makeRow(i, dataList[i]));
    }
    return rows;
  }

  componentDidMount() {
    this._loadData(false, () => {});
  }

  _loadData(isRefresh, onFinishLoading) {
    this.props.onLoadDataStart(isRefresh);
    const startMs = new Date().getTime();
    // make network request to load data, which will set state
    this.props.dataProviderFn((dataList) => {
      const endMs = new Date().getTime();
      this.setState({
        dataList: dataList
      });
      const timeMs = endMs - startMs;
      this.props.onLoadDataFinish(isRefresh, timeMs, dataList);
      onFinishLoading();
    });
  }

  _onRefresh() {
    return new Promise(this._loadData.bind(this, true));
  }

  render() {
    if (!this.state.dataList) {
      return (<ActivityIndicator
        size="large"
        style={{ flex: 1 }} />);
    }

    const rows =
      (<ScrollView
        scrollEventThrottle = {250}
        onScroll = { (event) => this.props.onScroll(event.nativeEvent.contentOffset.y) }
        >
        <TableView>
        {this._generateRows(this.state.dataList)}
        </TableView>
        <View style = {{ backgroundColor: "#1194e0", height: 40 }}>
          <TouchableOpacity onPress = { () => this.props.onPressRateApp(this.state.dataList.length) } style = {{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text numberOfLines={1} style={{
              fontSize: 18,
              fontWeight: "500",
              color: "#fff",
              textAlign: "center"
            }}>
            Rate App
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>);

    if (this.props.canRefresh) {
      return (
        <PullToRefresh
          onRefresh={this._onRefresh.bind(this)}
          offset = {50}
          >
          {rows}
        </PullToRefresh>
      );
    }
    return rows;
  }
}

ReaderView.propTypes = {
  canRefresh: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
  dataProviderFn: PropTypes.func.isRequired,
  cellContentViewFactory: PropTypes.func.isRequired,
  cellOnPressFn: PropTypes.func.isRequired,
  onPressRateApp: PropTypes.func.isRequired,
  onLoadDataStart: PropTypes.func.isRequired,
  onLoadDataFinish: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired
};

export default ReaderView;