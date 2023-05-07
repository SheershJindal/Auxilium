import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Modal, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import colors from '../../theme/colors'
import ImageViewer from 'react-native-image-zoom-viewer'

const PostItem = ({ id, profilePhotoUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", username, postedAt, content, likes, dislikes, isShownInDiscover = false, navigation, likedByMe = false, dislikedByMe = false, imageURI = "", imageZoomStatus, setImageZoomStatus, }) => {

    const openModal = () =>
        setImageZoomStatus({ id: id, isOpen: true })


    const closeModal = () =>
        setImageZoomStatus(prev => ({ ...prev, isOpen: false }))

    const handleCommentPress = () =>
        navigation.navigate("Post", { id })

    const isModalVisible = (imageZoomStatus.id == id && imageZoomStatus.isOpen)

    return <View style={{ ...postStyles.container, backgroundColor: isShownInDiscover ? '#fff' : 'none' }}>
        <View style={postStyles.headerContainer}>
            <Image style={postStyles.profilePhoto} source={{ uri: profilePhotoUrl }} />
            <View style={postStyles.infoContainer}>
                <Text style={{ fontSize: 16, margin: 0, padding: 0, color: '#0f0f0f' }}>{username}</Text>
                <Text style={{ fontSize: 11, ...margin(4, 0, 0, 0), padding: 0, color: colors.tertiary }}>{postedAt}</Text>
            </View>
            <TouchableOpacity style={postStyles.PostOptions}>
                <Entypo name="dots-three-horizontal" size={16} color={colors.secondary} />
            </TouchableOpacity>
        </View>
        <View>
            <Text>{content}</Text>
            {imageURI && <TouchableOpacity onPress={openModal}>
                <Image style={postStyles.image} source={{ uri: imageURI }} />
            </TouchableOpacity>}

            <Modal visible={isModalVisible} transparent={true} onRequestClose={closeModal}>
                <ImageViewer
                    imageUrls={[{ url: imageURI }]}
                    onShowModal={openModal}
                    onCancel={closeModal}
                    enableSwipeDown={true}
                    saveToLocalByLongPress={false}
                    renderIndicator={() => <View style={zoomedImageStyles.headerContainer}><Text style={zoomedImageStyles.text}>{username}</Text></View>}
                    renderFooter={() => <View style={{ width: Dimensions.get('window').width }}><Text style={zoomedImageStyles.text}>{content}</Text></View>}
                    menus={() => null}
                />
            </Modal>
            <View style={postStyles.details}>
                <View style={postStyles.likes}>
                    <TouchableOpacity>
                        <AntDesign name={likedByMe ? 'like1' : 'like2'} size={16} color={likedByMe ? "black" : colors.secondary} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, ...margin(0, 0, 0, 8), padding: 0, color: '#0f0f0f' }}>{likes}</Text>

                </View>
                <View style={postStyles.likes}>
                    <TouchableOpacity>
                        {/* <Ionicons name="ios-heart-outline" size={24} color={colors.secondary} /> */}
                        <AntDesign name={dislikedByMe ? "dislike1" : "dislike2"} size={16} color={dislikedByMe ? 'black' : colors.secondary} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, ...margin(0, 0, 0, 8), padding: 0, color: '#0f0f0f' }}>{dislikes}</Text>

                </View>
                {isShownInDiscover && <View style={postStyles.comments}>
                    <Ionicons name="ios-chatbox-outline" size={24} color={colors.secondary} />
                </View>}
            </View>
        </View>
    </View>

}

export default PostItem

const margin = (a, b, c, d) => ({
    marginTop: a,
    marginRight: b ?? a,
    marginBottom: c ?? a,
    marginLeft: d ?? b ?? a,
})

const postStyles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    container: {
        // ...margin(16, 16, 0, 16),
        marginBottom: 16,
        borderRadius: 6,
        padding: 8,
    },
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
    },
    profilePhoto: {
        width: 48,
        height: 48,
        borderRadius: 24
    },
    infoContainer: {
        flex: 1,
        ...margin(0, 16),
    },
    post: {
        marginLeft: 64,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        borderRadius: 6,
    },
    details: {
        flexDirection: 'row',
        marginTop: 8,
    },
    likes: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    comments: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16
    }
})

const zoomedImageStyles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        width: '100%',
        top: 20
    },
    text: {
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 10,
    }

})