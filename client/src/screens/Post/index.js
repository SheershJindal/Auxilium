import { Platform, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PostItem from '../../components/Feed/PostItem'
import Comments from '../../components/Feed/Comments'
import colors from '../../theme/colors'
import Scrollbars from 'react-custom-scrollbars'
import usePostService from '../../hooks/api/postService'
import { useEffect } from 'react'
import { Entypo, Feather } from '@expo/vector-icons'

const Post = ({ route, navigation }) => {

    const postService = usePostService();

    const Scrollable = ({ children }) => <>
        {Platform.OS == 'web' ? <Scrollbars>{children}</Scrollbars> : <ScrollView overScrollMode='never'>{children}</ScrollView>}
    </>

    const { id } = route.params || ""

    const [imageZoomStatus, setImageZoomStatus] = useState({ id: undefined, isOpen: false })
    const [post, setPost] = useState({
        "_id": "",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-01-27T05:05:12.426Z",
        "username": "",
        "likedByMe": false,
        "dislikedByMe": false,
        "content": "",
        "imageURI": null,
        "videoURI": null
    })
    const [comments, setComments] = useState([])
    const [replyingTo, setReplyingTo] = useState({ id: "", commentContent: "", })
    const [commentValue, setCommentValue] = useState("")
    const [sending, setSending] = useState(false)

    useEffect(() => {
        if (replyingTo.id == "") setCommentValue("")
    }, [replyingTo.id])


    const resetReplying = () => {
        setReplyingTo({ id: "", commentContent: "" })
    }

    const getPostById = async (postId) => {
        const { post, comments } = await postService.getPostById(postId);
        setPost(post)
        setComments(comments)
    }

    const addValue = (v) => {
        setCommentValue(v)
    }

    const createComment = async () => {
        setSending(true)
        const response = await postService.createComment(id, commentValue, replyingTo.id);
        setSending(false)
    }

    useEffect(() => {
        getPostById(id)
    }, [id])

    return (
        <SafeAreaView style={{ flex: 1, width: Platform.OS == 'web' ? '50%' : '100%', alignSelf: 'center', }}>
            <Scrollable>
                <PostItem id={post._id} imageZoomStatus={imageZoomStatus} setImageZoomStatus={setImageZoomStatus} likes={post.likes} dislikes={post.likes} comments={2} postedAt={post.createdAt} content={post.content} imageURI={post.imageURI} isShownInDiscover={false} dislikedByMe={post.dislikedByMe} likedByMe={post.likedByMe} navigation={navigation} username={post.username} />
                <Comments setReplyingTo={setReplyingTo} comments={comments} />
            </Scrollable>

            <View style={{ marginHorizontal: 10 }}>
                {replyingTo.id && <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1 }} numberOfLines={1}><Text style={{ fontWeight: 'bold' }}>Replying to - </Text>{replyingTo.commentContent}</Text>
                    <TouchableOpacity onPress={resetReplying}>
                        <Entypo style={{ alignSelf: 'flex-end' }} name="circle-with-cross" size={24} color="black" />
                    </TouchableOpacity>
                </View>}

                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }} >
                    <TextInput style={{ color: 'black', backgroundColor: colors.secondary, padding: 10, paddingHorizontal: 20, borderRadius: 15, flex: 1, textAlignVertical: 'center', marginRight: 10 }} placeholder='Add a comment' placeholderTextColor={colors.tertiary} value={commentValue} onChangeText={addValue} />
                    <TouchableOpacity style={{ height: '90%', aspectRatio: 1, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }} onPress={!sending ? createComment : () => { }}>
                        {sending ? <ActivityIndicator color='white' /> : <Feather name="send" size={20} color="white" style={{ marginRight: 2, marginTop: 2 }} />}
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default Post

const styles = StyleSheet.create({})