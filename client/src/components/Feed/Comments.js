import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Octicons } from '@expo/vector-icons';
import mockDelayedResponse from '../../utils/mockDelayedResponse';

const CommentComponent = ({ _id, children, isEdited = false, likes, dislikes, userId, postId, content, parentId, createdAt, updatedAt, likedByMe, dislikedByMe, setReplyingTo, profilePhotoURI }) => {
    // const { id, text, likes, dislikes, children, postedAt, username, profilePhotoUrl } = comment;

    const [isLiked, setIsLiked] = useState(false)
    const [isDisliked, setIsDisliked] = useState(false)

    const [isChildrenExpanded, setIsChildrenExpanded] = useState(true)

    const like = async () => {
        await mockDelayedResponse(() => { }, 200)
        setIsLiked(true)
        setIsDisliked(false)
    }
    const unlike = async () => {
        await mockDelayedResponse(() => { }, 200)
        setIsLiked(false)
    }
    const dislike = async () => {
        await mockDelayedResponse(() => { }, 200)
        setIsDisliked(true)
        setIsLiked(false)
    }
    const undislike = async () => {
        await mockDelayedResponse(() => { }, 200)
        setIsDisliked(false)
    }

    const replyTo = () => {
        setReplyingTo({ id: _id, commentContent: content })
    }

    return (
        <TouchableOpacity activeOpacity={0.6} onPress={() => setIsChildrenExpanded(prev => !prev)} style={{ marginLeft: 10, paddingLeft: 10, paddingTop: 10, borderLeftWidth: 0.5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginRight: 10 }}>
                    {
                        /**
                         * @TODO
                         * https://reactnative.dev/docs/image.html#defaultsource
                         * Switch to default source
                         * It is kept conditional here because on Android default source does not work in debug mode
                         * Will remove this once the app is ready to ship to production 
                         */
                    }
                    <Image source={{ uri: profilePhotoURI }} style={{ height: 25, aspectRatio: 1, borderRadius: 50 }} />
                </View>
                <Text style={{ marginRight: 10 }}>{userId}</Text>
                <Text>{createdAt}</Text>
            </View>
            <View style={{}}>
                <Text>{content} {_id}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 20 }}>
                <TouchableOpacity onPress={replyTo}>
                    <Octicons name="reply" size={16} color="black" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={!isLiked ? like : unlike} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    {isLiked ?
                        <AntDesign name="like1" size={16} color="black" />
                        :
                        <AntDesign name="like2" size={16} color="black" />
                    }
                    <Text>{likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={!isDisliked ? dislike : undislike} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <AntDesign name={isDisliked ? "dislike1" : "dislike2"} size={16} color="black" />
                    <Text>{dislikes}</Text>
                </TouchableOpacity>
            </View>
            {isChildrenExpanded && children && children.length > 0 && children.map(child => <CommentComponent key={child._id} {...child} setReplyingTo={setReplyingTo} />)}
            {
                /** 
                 * @TODO If not expanded, we render the first child in a small view 
                 * 
                {!isChildrenExpanded && children && children.length > 0 && <View>
                    <Text></Text>
                </View>}
                */
            }
        </TouchableOpacity>
    )
}

const Comments = ({ comments, setReplyingTo }) => {
    return <View style={{ flex: 1 }}>
        {comments.map(({ _id, children,
            isEdited,
            likes,
            dislikes,
            userId,
            postId,
            content,
            parentId,
            createdAt,
            updatedAt,
            likedByMe,
            dislikedByMe,
            profilePhotoURI }) => <CommentComponent key={_id} children={children} isEdited={isEdited} likes={likes} content={content} createdAt={createdAt} dislikedByMe={dislikedByMe} dislikes={dislikes} _id={_id} likedByMe={likedByMe} parentId={parentId} postId={postId} updatedAt={updatedAt} userId={userId} setReplyingTo={setReplyingTo} profilePhotoURI={profilePhotoURI} />)}
    </View>

}

export default Comments

const styles = StyleSheet.create({})