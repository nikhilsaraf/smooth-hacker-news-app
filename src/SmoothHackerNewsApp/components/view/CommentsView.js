/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReaderView from './ReaderView';
import { View } from 'react-native';

class CommentsView extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
        headerTitleStyle: { fontSize: navigation.state.params.headerTitleFontSize }
    });

    render() {
        const { params } = this.props.navigation.state;
        return (<ReaderView
            style={{ alignItems: 'flex-end' }}
            canRefresh = { false }
            navigate = { params.navigate }
            dataProviderFn = { params.dataProviderFn }
            cellContentViewFactory = { params.cellContentViewFactory }
            cellOnPressFn = { params.cellOnPressFn }
            onPressRateApp = { params.onPressRateApp }
            onLoadDataStart = { params.onLoadDataStart }
            onLoadDataFinish = { params.onLoadDataFinish }
            onScroll = { params.onScroll }
            firstCellView = { params.firstCellView }
        />);
    }
}

export default CommentsView;