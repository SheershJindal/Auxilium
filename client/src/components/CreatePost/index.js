import { Platform, StyleSheet, TouchableOpacity, Text, TextInput, SafeAreaView, View, Image, ActivityIndicator } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import colors from "../../theme/colors"
import sharedStyles from '../../screens/Auth/sharedStyles'
import * as ImagePicker from 'expo-image-picker'
import DropDownPicker from 'react-native-dropdown-picker'
import useCommunityService from '../../hooks/api/communityService'
import useTagService from '../../hooks/api/tagService'
import usePostService from '../../hooks/api/postService'

const CreatePost = ({ isHome, communityId, communityName }) => {
    const communityService = useCommunityService()
    const tagService = useTagService()
    const postService = usePostService()

    const [text, setText] = useState('')
    const [mediaData, setMediaData] = useState({ URI: null, type: null })
    const [communityOpen, setCommunityOpen] = useState(false)
    const [communityItems, setCommunityItems] = useState([])
    const [tagItems, setTagItems] = useState([])

    const getCommunities = async () => {
        const community = await communityService.getSubscribedCommunities()
        setCommunityItems(community)
    }
    const getTags = async () => {
        let tags = await tagService.getTags()
        tags = tags.map(tag => {
            return { label: tag, value: tag }
        })
        setTagItems(tags)
    }
    useEffect(() => {
        getCommunities()
        getTags()
    }, [])

    const [communityValue, setCommunityValue] = useState(communityId)
    const [tagOpen, setTagOpen] = useState(false)
    const [tagValue, setTagValue] = useState(null)
    const [sending, setSending] = useState(false)

    useEffect(() => {
        setCommunityValue(communityId)
    }, [communityId])


    const onCommunityOpen = useCallback(() => {
        setTagOpen(false)
    }, [])

    const onTagOpen = useCallback(() => {
        setCommunityOpen(false)
    }, [])

    const handleMediaUpload = async (res) => {
        if (res.canceled) return;
        let URI = res.assets[0].uri
        let type = res.assets[0].type
        setMediaData({ URI: URI, type: type })
    }

    const handleCreate = async () => {
        setSending(true)
        const res = await postService.createPost(text, communityValue, mediaData)
        setSending(false)
    }

    const handleCameraUpload = async () => {
        const res = await ImagePicker.launchCameraAsync({ mediaTypes: "All" })
        handleMediaUpload(res)
    }

    const handleGalleryUpload = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: "All" })
        handleMediaUpload(res)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={sharedStyles.titleText}>Enter Text</Text>
                <TextInput
                    style={styles.inputArea}
                    placeholder="Start Typing..."
                    multiline
                    value={text}
                    onChangeText={t => setText(t)}
                />
                <Text style={sharedStyles.titleText}>Upload</Text>
                {mediaData.URI && <Image source={{ uri: mediaData.URI }} style={{ height: 200, width: '100%', resizeMode: 'contain' }} />}
                <View style={styles.uploadContainer}>
                    {Platform.OS !== 'web' && <TouchableOpacity style={styles.button} onPress={handleCameraUpload}>
                        <Text style={{ ...sharedStyles.buttonText, fontSize: 16, fontWeight: undefined }}>From Camera</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity style={styles.button} onPress={handleGalleryUpload}>
                        <Text style={{ ...sharedStyles.buttonText, fontSize: 16, fontWeight: undefined }}>From Gallery</Text>
                    </TouchableOpacity>
                </View>
                {isHome && <Text style={sharedStyles.titleText}>Select Community</Text>}

                {/* {isHome && <DropDownPicker
                    ListEmptyComponent={() => <Text style={{ textAlign: 'center', padding: 5, paddingHorizontal: 10 }}>You need to subscribe to a community to post anything</Text>}
                    disabled={!isHome}
                    placeholder={isHome ? 'Select Communities' : communityName}
                    // multiple={isHome}
                    mode="BADGE"
                    open={communityOpen}
                    items={communityItems}
                    value={communityValue}
                    onOpen={onCommunityOpen}
                    setOpen={setCommunityOpen}
                    setItems={setCommunityItems}
                    schema={{ label: 'name', value: 'communityId' }}
                    setValue={setCommunityValue}
                    closeOnBackPressed
                    zIndex={3000}
                    zIndexInverse={1000}
                />} */}
                <Text style={sharedStyles.titleText}>Select Tags</Text>
                <DropDownPicker
                    placeholder='Select Tags'
                    mode="BADGE"
                    multiple
                    searchable
                    open={tagOpen}
                    items={tagItems}
                    value={tagValue}
                    onOpen={onTagOpen}
                    setOpen={setTagOpen}
                    setItems={setTagItems}
                    setValue={setTagValue}
                    closeOnBackPressed
                    zIndex={1000}
                    zIndexInverse={3000}
                />
                <TouchableOpacity style={sharedStyles.button} onPress={sending ? () => { } : handleCreate}>
                    {sending ? <ActivityIndicator color='white' /> : <Text style={sharedStyles.buttonText}>Create</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default CreatePost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 25,
        alignSelf: 'center',
        width: Platform.OS == "web" ? "30%" : "100%",
        minWidth: Platform.OS == "web" ? 500 : "auto"
    },
    topContainer: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        marginVertical: 40,
    },
    uploadContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly'
    },
    button: {
        backgroundColor: colors.primary,
        height: 40,
        borderRadius: 50,
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 20,
        paddingHorizontal: 10
    },
    inputArea: {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 12.5,
        width: '100%',
        padding: 10,
        marginBottom: 20,
        borderColor: colors.tertiary
    }
})