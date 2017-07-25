/**
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReaderView from './ReaderView';

class CommentsView extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        // TODO put some title here
        title: 'temp put some title here'
        // title: `${navigation.state.params.title}`,
    });

    render() {
        const { params } = this.props.navigation.state;
    	// TODO need to add JSX for current comment - this should be a ReaderView + a floating parent comment
        return (<ReaderView
            navigate = { params.navigate }
            dataProviderFn = { params.dataProviderFn }
            cellContentViewFactory = { params.cellContentViewFactory }
            cellOnPressFn = { params.cellOnPressFn }
            />);
    }
}

export default CommentsView;