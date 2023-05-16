import { useState } from "react";
import { useEffect } from "react";
import { Image, Text, View, StyleSheet, Button, FlatList, TouchableOpacity } from "react-native";
import useCommunityService from "../../hooks/api/communityService";
import colors from "../../theme/colors";
import PostItem from "../../components/Feed/PostItem";
import { useReducer } from "react";
import { useCallback } from "react";

const Community = ({ navigation, route }) => {
    const communityService = useCommunityService();

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const [imageZoomStatus, setImageZoomStatus] = useState({ id: '', isOpen: false })

    function reducer(state, action) {
        const community = state.community
        switch (action.type) {
            case "INITIALISE_COMMUNITY": {
                const { community } = action.payload
                const posts = community.posts
                return { ...state, community, joined: community.joined, communityId: community._id, posts, loading: false }
            }

            case "TOGGLE_JOIN":
                if (state.joined) {
                    return { ...state, joined: false, community: { ...community, members: community.members - 1 } }
                }
                else {
                    return { ...state, joined: true, community: { ...community, members: community.members + 1 } }
                }
        }
        throw Error('Unknown action.');
    }

    const customDispatch = async (action) => {
        switch (action.type) {
            case "TOGGLE_JOIN":
                const communityId = state.communityId;
                if (!state.joined) {
                    await communityService.subscribeToCommunity(communityId);
                } else {
                    await communityService.leaveSubscribedCommunity(communityId)
                }
                dispatch(action)
                break
            default:
                dispatch(action)
        }
    }

    const [state, dispatch] = useReducer(reducer, { joined: false, community: {}, communityId: '', posts: [], loading: true })

    useEffect(() => {
        (async () => {
            if (route.params && route.params['community']) {
                const communityId = route.params['community'];
                const community = await communityService.getCommunity(communityId);
                customDispatch({ type: 'INITIALISE_COMMUNITY', payload: { community } });
            }
        })();

    }, [route.params])

    if (state.loading) return <Text>Loading...</Text>

    const HeaderComponent = () => <View style={headerStyles.wrapper}>
        <View style={headerStyles.titleContainer}>
            <View>
                <Image source={{ uri: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80" }} style={headerStyles.image} />
                <Text style={headerStyles.title}>{state.community.name}</Text>
            </View>
            <View style={headerStyles.buttonWrapper}>
                <TouchableOpacity style={{ ...headerStyles.joinButton, backgroundColor: state.joined ? colors.primary : '#DFDFDF' }} onPress={() => customDispatch({ type: 'TOGGLE_JOIN' })}>
                    <Text style={{ color: state.joined ? 'white' : colors.secondary, textTransform: 'uppercase', fontWeight: '500' }}>{state.joined ? 'Joined' : 'Join'}</Text>
                </TouchableOpacity>
            </View>
        </View>
        <Text style={headerStyles.description}>{state.community.description}</Text>
        <Text style={headerStyles.membersWrapper}><Text style={headerStyles.members}>{numberWithCommas(state.community.members.toString())}</Text> Members</Text>
        <TouchableOpacity
            onPress={() => navigation.navigate('CreatePost', { isHome: false, communityId: state.community._id, communityName: state.community.name })}
            style={{ ...headerStyles.joinButton, marginVertical: 10, backgroundColor: !state.joined ? '#DFDFDF' : colors.primary }}
            disabled={!state.joined}
        >
            <Text style={{ textAlign: 'center', textTransform: 'uppercase', color: state.joined ? 'white' : colors.secondary, fontWeight: '600' }}>{state.joined ? "Create Post" : "Join the community to post"}</Text>
        </TouchableOpacity>
    </View>


    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <FlatList ListHeaderComponent={HeaderComponent} data={state.posts} keyExtractor={post => post._id} renderItem={({ item }) => <TouchableOpacity onPress={() => navigation.navigate("Post", { id: post._id })}> <PostItem {...item} postedAt={item.createdAt} profilePhotoUrl={item.createdBy.profilePhotoUrl} content={item.data.content} dislikes={item.dislikes} likes={item.likes} navigation={navigation} username={item.createdBy.username} dislikedByMe={item.dislikedByMe} likedByMe={item.likedByMe} imageURI={item.data.imageURI} id={item._id} imageZoomStatus={imageZoomStatus} setImageZoomStatus={setImageZoomStatus} /></TouchableOpacity>} />
        </View>
    )
}

export default Community

const headerStyles = StyleSheet.create({
    wrapper: { paddingHorizontal: 10 },
    titleContainer: { flexDirection: 'row', justifyContent: 'space-between', },
    image: { height: 100, width: 100, borderRadius: 100 },
    title: { fontWeight: 'bold', fontFamily: 'Roboto', marginTop: 5, },
    buttonWrapper: { flexDirection: 'row', alignItems: 'center' },
    joinButton: { backgroundColor: colors.primary, padding: 5, paddingHorizontal: 20, borderRadius: 20, fontWeight: '600', color: 'white' },
    description: { marginTop: 10 },
    membersWrapper: { marginTop: 10 },
    members: { fontWeight: 'bold' }
})