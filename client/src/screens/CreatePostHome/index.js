import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CreatePost from '../../components/CreatePost'

const CreatePostHome = ({ route }) => {
    const [isHome, setIsHome] = useState({})
    const [communityName, setCommunityName] = useState("")
    useEffect(() => {
        const isHome = JSON.parse(route.params.isHome)
        setIsHome(isHome)

        const communityName = route.params.communityName
        setCommunityName(communityName)
    }, [route.params])

    return (
        <>
            <CreatePost isHome={isHome} communityName={communityName} />
        </>
    )
}

export default CreatePostHome

const styles = StyleSheet.create({})