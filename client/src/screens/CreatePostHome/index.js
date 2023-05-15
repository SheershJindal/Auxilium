import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CreatePost from '../../components/CreatePost'

const CreatePostHome = ({ route, navigation }) => {
    const [isHome, setIsHome] = useState({})
    const [communityName, setCommunityName] = useState("")
    const [communityId, setCommunityId] = useState('')

    useEffect(() => {
        const isHome = JSON.parse(route.params.isHome)
        setIsHome(isHome);
        const commId = route.params.communityId;
        setCommunityId(commId)
        const communityName = route.params.communityName
        setCommunityName(communityName)
    }, [route.params])

    return (
        <>
            <CreatePost isHome={isHome} communityName={communityName} communityId={communityId} navigation={navigation}/>
        </>
    )
}

export default CreatePostHome

const styles = StyleSheet.create({})