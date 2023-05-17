import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import Feed from '../../components/Feed';
import { Ionicons } from '@expo/vector-icons';

const Discover = ({ navigation, isCommunityFeed = true }) => {

    return (
        <>
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', marginBottom: 10, borderRadius: 10, padding: 5, paddingHorizontal: 10, alignItems: 'center' }} onPress={() => navigation.navigate('Search')}>
                <Text>Start Searching</Text>
                <Ionicons name="search-outline" size={30} />
            </TouchableOpacity>
            <Feed navigation={navigation} isCommunityFeed={isCommunityFeed} />
        </>
    )
}

export default Discover

const styles = StyleSheet.create({})