import { useState } from "react";
import { useEffect } from "react";
import { Image, Text, View, StyleSheet, Button, FlatList } from "react-native";
import useCommunityService from "../../hooks/api/communityService";
import colors from "../../theme/colors";
import PostItem from "../../components/Feed/PostItem";
import { SafeAreaView } from "react-native-safe-area-context";

const Community = ({ navigation, route }) => {
    const communityService = useCommunityService();

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const [isLoading, setIsLoading] = useState(true)

    const [community, setCommunity] = useState({})
    const [posts, setPosts] = useState([])
    const [imageZoomStatus, setImageZoomStatus] = useState({ id: '', isOpen: false })


    useEffect(() => {
        (async () => {
            if (route.params && route.params['community']) {
                const communityId = route.params['community'];
                const community = await communityService.getCommunity(communityId);
                setCommunity(community)
                setPosts(community.posts)
                setIsLoading(false)
            }
        })();

    }, [route.params])

    if (isLoading) return <Text>Loading...</Text>

    const HeaderComponent = () => <View style={headerStyles.wrapper}>
        <View style={headerStyles.titleContainer}>
            <View>
                <Image source={{ uri: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80" }} style={headerStyles.image} />
                <Text style={headerStyles.title}>{community.name}</Text>
            </View>
            <View style={headerStyles.buttonWrapper}>
                {!community.joined ?
                    <Text style={headerStyles.joinButton}>Joined</Text> :
                    <Button title="Join" />
                }
            </View>
        </View>
        <Text style={headerStyles.description}>{community.description}</Text>
        <Text style={headerStyles.membersWrapper}><Text style={headerStyles.members}>{numberWithCommas(community.members)}</Text> Members</Text>
        <Button title="Create Post" onPress={() => navigation.navigate('CreatePost', { isHome: false, communityName: "CommunityTitle" })} />
    </View>


    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <FlatList ListHeaderComponent={HeaderComponent} data={posts} keyExtractor={post => post._id} renderItem={({ item }) => <PostItem {...item} postedAt={item.createdAt} profilePhotoUrl={item.createdBy.profilePhotoUrl} content={item.data.content} dislikes={item.dislikes} likes={item.likes} navigation={navigation} username={item.createdBy.username} dislikedByMe={item.dislikedByMe} likedByMe={item.likedByMe} imageURI={item.data.imageURI} id={item._id} imageZoomStatus={imageZoomStatus} setImageZoomStatus={setImageZoomStatus} />} />
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