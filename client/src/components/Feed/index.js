import { FlatList, View, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import PostItem from './PostItem'
import Community from '../../screens/Community'
import feedData from '../../dummy-data/feedData'

const Feed = ({ navigation, isCommunityFeed }) => {

    const [imageZoomStatus, setImageZoomStatus] = useState({ id: '', isOpen: false })

    const Posts = () =>
        <FlatList
            data={feedData}
            keyExtractor={item => item._id}
            renderItem={({ item }) => {
                const { _id, likes, dislikedByMe, dislikes, data, communityId, createdAt, createdBy, likedByMe, type, updatedAt, comments } = item;
                return <TouchableOpacity onPress={() => navigation.navigate("Post", { id: _id })} activeOpacity={0.7}>
                    <PostItem
                        id={_id}
                        username={createdBy.username}
                        profilePhotoUrl={createdBy.profilePhotoUrl}
                        postedAt={createdAt}
                        content={data.content}
                        imageURI={data.imageURI}
                        likes={likes}
                        dislikes={dislikes}
                        comments={comments}
                        imageZoomStatus={imageZoomStatus}
                        setImageZoomStatus={setImageZoomStatus}
                        navigation={navigation}
                        likedByMe={likedByMe}
                        dislikedByMe={dislikedByMe}
                        isShownInDiscover={true}
                    />
                </TouchableOpacity>
            }}
        />

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS == 'web' ?
                <Scrollbars>
                    {isCommunityFeed && <Community />}
                    <Posts />
                </Scrollbars> :
                <Posts />
            }
        </View>
    )
}

export default Feed;
