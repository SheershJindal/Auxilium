import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Button, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/reducers/authSlice";
import useCommunityService from "../hooks/api/communityService";
import { useState, useEffect } from "react";

const CustomDrawer = ({ navigation, ...props }) => {

    const dispatch = useDispatch();
    const communityService = useCommunityService();

    const [communities, setCommunities] = useState([])

    const logout = () => {
        dispatch(logoutUser())
    }

    useEffect(() => {
        (async () => {
            const communities = await communityService.getAllCommunities();
            setCommunities(communities)
        })();
    }, [])

    const getAction = (communityId) => {
        navigation.navigate("Community", { 'community': communityId })
    }


    return <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
                <Text>Your Communities</Text>
                {communities.map(community => <DrawerItem label={community.name} key={community._id} onPress={() => getAction(community._id)} />)}
            </View>
            <Button title="Logout" onPress={logout} />
        </View>
    </DrawerContentScrollView>
}
export default CustomDrawer;