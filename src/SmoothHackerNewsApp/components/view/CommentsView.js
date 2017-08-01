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
                    flex: .14,
                    backgroundColor: '#d8e3ff',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 1
                }}>
                {params.firstCellView}
                </View>
                <View style={{ flex: .86, flexDirection: 'row' }}>
                    <View style={{ flex: .01, paddingRight: 10, backgroundColor: "#fff" }}/>
                    <View style={{ flex: .99, backgroundColor: "#fff" }}>
                        <ReaderView
                            navigate = { params.navigate }
                            dataProviderFn = { params.dataProviderFn }
                            cellContentViewFactory = { params.cellContentViewFactory }
                            cellOnPressFn = { params.cellOnPressFn }
                            />
                    </View>
                </View>
            </View>
        );
    }
}

export default CommentsView;