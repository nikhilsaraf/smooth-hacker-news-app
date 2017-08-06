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
    });

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{
                    flex: 0.15,
                    backgroundColor: '#d8e3ff',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 1
                }}>
                {params.firstCellView}
                </View>
                <ReaderView
                    style={{ alignItems: 'flex-end' }}
                    navigate = { params.navigate }
                    dataProviderFn = { params.dataProviderFn }
                    cellContentViewFactory = { params.cellContentViewFactory }
                    cellOnPressFn = { params.cellOnPressFn }
                />
            </View>
        );
    }
}

export default CommentsView;