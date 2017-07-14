/**
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Cell from './components/Cell';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Cell
          title = "test title"
          subtitle = "test subtitle"
          url="google.com"
          />
      </View>
    );
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
