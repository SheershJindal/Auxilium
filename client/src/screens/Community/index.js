import { useState } from "react";
import { useEffect } from "react";
import { Image, Text, View, StyleSheet, Button } from "react-native";
import useCommunityService from "../../hooks/api/communityService";
import colors from "../../theme/colors";

const Community = ({ navigation, route }) => {
    const communityService = useCommunityService();

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const [isLoading, setIsLoading] = useState(true)

    const [community, setCommunity] = useState({})

    useEffect(() => {
        (async () => {
            if (route.params && route.params['community']) {
                const communityId = route.params['community'];
                const community = await communityService.getCommunity(communityId);
                console.log(community)
                setCommunity(community)
                setIsLoading(false)
            }
        })();

    }, [route.params])

    if (isLoading) return <Text>Loading...</Text>
    return (
        <View style={styles.wrapper}>
            <View style={styles.titleContainer}>
                <View>
                    <Image source={{ uri: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80" }} style={styles.image} />
                    <Text style={styles.title}>{community.name}</Text>
                </View>
                <View style={styles.buttonWrapper}>
                    {!community.joined ?
                        <Text style={styles.joinButton}>Joined</Text> :
                        <Button title="Join"/> 
                    }
                </View>
            </View>
            <Text style={styles.description}>{community.description}</Text>
            <Text style={styles.membersWrapper}><Text style={styles.members}>{numberWithCommas(community.members)}</Text> Members</Text>
            <Button title="Create Post" onPress={() => navigation.navigate('CreatePost', { isHome: false, communityName: "CommunityTitle" })} />
        </View>
    )
}

export default Community

const styles = StyleSheet.create({
    wrapper: {
        padding: 20, paddingRight: 30, backgroundColor: '#fff', marginBottom: 10
    },
    titleContainer: { flexDirection: 'row', justifyContent: 'space-between', },
    image: { height: 100, width: 100, borderRadius: 100 },
    title: { fontWeight: 'bold', fontFamily: 'Roboto', marginTop: 5, },
    buttonWrapper: { flexDirection: 'row', alignItems: 'center' },
    joinButton: { backgroundColor: colors.primary, padding: 5, paddingHorizontal: 20, borderRadius: 20, fontWeight: '600', color: 'white' },
    description: { marginTop: 10 },
    membersWrapper: { marginTop: 10 },
    members: { fontWeight: 'bold' }
})