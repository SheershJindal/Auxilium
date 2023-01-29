import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import Feed from '../../components/Feed';

import feedData from '../../dummy-data/feedData'

const Discover = ({ navigation }) => {

    return (<View style={{ flex: 1 }}>
        <Feed feedData={feedData} navigation={navigation} />
    </View>)
}

export default Discover

const styles = StyleSheet.create({})
