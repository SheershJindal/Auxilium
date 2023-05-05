import { Platform, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feed from '../../components/Feed'
import PostItem from '../../components/Feed/PostItem'
import Comments from '../../components/Feed/Comments'
import colors from '../../theme/colors'
import dummyPostData from '../../dummy-data/postData'
import dummyComments from '../../dummy-data/commentsData'
import Scrollbars from 'react-custom-scrollbars'

const Post = ({ route, navigation }) => {
    const Scrollable = ({ children }) => <>
        {Platform.OS == 'web' ? <Scrollbars>{children}</Scrollbars> : <ScrollView overScrollMode='never'>{children}</ScrollView>}
    </>

    const { id } = route.params || ""

    const [imageZoomStatus, setImageZoomStatus] = useState({ id: undefined, isOpen: false })

    const handleUserComment = (id) => {
        navigation.navigate("ReactToPost", { title: "Comment", id })
    }


    return (
        <SafeAreaView style={{ flex: 1, width: Platform.OS == 'web' ? '50%' : '100%', alignSelf: 'center', }}>
            <Scrollable>
                <PostItem id={dummyPostData.id} user={dummyPostData.user} post={dummyPostData.post} postedAt={dummyPostData.postedAt} comments={dummyPostData.comments} imageZoomStatus={imageZoomStatus} setImageZoomStatus={setImageZoomStatus} likes={dummyPostData.likes} photoUrl={dummyPostData.photoUrl} isShownInDiscover={false} />
                <Comments comments={dummyComments} />
            </Scrollable>
            <TouchableOpacity activeOpacity={0.7} style={{ height: 50, justifyContent: 'center', marginHorizontal: 10, }} onPress={() => handleUserComment(dummyPostData.id)}>
                <Text style={{ color: colors.tertiary, backgroundColor: colors.secondary, padding: 10, paddingHorizontal: 20, borderRadius: 20 }}>Add a comment</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default Post

const styles = StyleSheet.create({})