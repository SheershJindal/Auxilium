import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Dimensions } from 'react-native'
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import colors from '../../theme/colors'
import Scrollbars from 'react-custom-scrollbars'
import useAuthService from '../../hooks/api/authService'
import { useSelector } from 'react-redux'
import HoverableOpacity from '../../components/HoverableOpacity'
import useCommunityService from '../../hooks/api/communityService'

const RenderCommunityItem = ({ item }) => {

    return <HoverableOpacity activeOpacity={0.7} hoverStyle={{ backgroundColor: colors.primary, borderRadius: 10 }} outerStyle={{}} onPress={item.onPress} style={{ flexDirection: 'row', marginLeft: 20, height: 50, alignItems: 'center', }}>
        {item.icon ?
            (typeof item.icon !== "string") ? (item.icon)() : <Image source={{ uri: item.icon }} style={{ height: '90%', aspectRatio: 1 }} /> : null
        }
        <Text style={{ textTransform: 'uppercase', marginLeft: 20, fontSize: 16 }}>{item.title}</Text>
    </HoverableOpacity>
}

const LeftSidebar = ({ navigation }) => {
    const initialList = [
        { id: 0, title: "Announcements", onPress: () => { navigation.navigate('Announcement') }, icon: () => <Entypo name="megaphone" size={24} color='black' /> },
    ]

    const [communities, setCommunities] = useState(initialList)

    const authService = useAuthService();
    const communityService = useCommunityService();

    const user = useSelector(state => state.auth.user)

    const logout = () => {
        authService.logout()
    }

    useEffect(() => {
        (async () => {
            const communities = await communityService.getAllCommunities();
            setCommunities(communities)
        })();
    }, [])

    const getAction = (communityId) => {
        navigation.navigate("Community", { id: communityId })
    }


    return (
        <View style={{ height: '100%', flex: 1, flexDirection: 'column' }}>
            <View style={{ marginBottom: 20, flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 24, }}>Auxilium</Text>
            </View>
            <View style={{ flex: 1, }}>
                <Scrollbars>
                    <FlatList style={{
                        flex: 1
                    }} data={initialList} renderItem={RenderCommunityItem}
                        keyExtractor={item => item.id}
                    />
                    <FlatList data={communities}
                        renderItem={({ item }) => RenderCommunityItem({ item: { onPress: () => getAction(item._id), title: item.name } })}
                    />
                </Scrollbars>
            </View>
            <View style={{ bottom: 0, justifyContent: 'flex-end', }}>
                <HoverableOpacity activeOpacity={0.7} hoverStyle={{ backgroundColor: colors.primary, borderRadius: 10, }} outerStyle={{ marginBottom: 20, }} onPress={() => navigation.navigate('CreatePost')} style={{ justifyContent: 'center', marginBottom: 20, height: '100%', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="create-outline" size={30} color="black" style={{ marginRight: 20 }} />
                        <Text style={{ fontWeight: '600', fontSize: 16, textTransform: 'uppercase' }}>Create</Text>
                    </View>
                </HoverableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign name="user" size={30} color="black" style={{ marginRight: 20 }} />
                        <View>
                            <Text style={{ fontWeight: '600', fontSize: 18 }}>{user.username ? user.username : "User"}</Text>
                            <Text>{user.graduationYear ?? user.graduationYear}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={logout}>
                        <MaterialIcons name="logout" size={24} color='black' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default LeftSidebar
