import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig";
import * as mime from 'mime'

const usePostService = () => {
    const dispatch = useDispatch();

    const tokenFromStore = useSelector(state => state.auth.token);

    const createPost = async (text, communityId, mediaData) => {
        try {
            const createPostAxios = getAuthenticatedAxios('/post', tokenFromStore);
            const mediaAxios = getAuthenticatedAxios('/uploads', tokenFromStore, { headers: { "Content-Type": "multipart/form-data" } })

            let mediaRequest = null;

            if (mediaData.URI) {
                let formData = new FormData();
                let mimeType;

                switch (Platform.OS) {
                    case "web":
                        function DataURIToBlob(dataURI) {
                            const splitDataURI = dataURI.split(',')
                            const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
                            const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

                            const ia = new Uint8Array(byteString.length)
                            for (let i = 0; i < byteString.length; i++)
                                ia[i] = byteString.charCodeAt(i)

                            return new Blob([ia], { type: mimeString })
                        }
                        let file = DataURIToBlob(mediaData.URI)
                        formData.append('photos', file)
                        break;

                    case "android":
                        mimeType = mime.getType(mediaData.URI);
                        formData.append('photos', { name: 'user_uploads', uri: mediaData.URI, type: mimeType })
                        break;

                    case "ios":
                        let uri = `file://${mediaData.URI}`;
                        mimeType = mime.getType(mediaData.URI);
                        formData.append('photos', { name: 'user_uploads', uri, type: mimeType });
                        break;

                    default:
                        formData.append('photos', { name: 'user_uploads', uri: mediaData.URI, type: 'image/png' })
                }

                mediaRequest = await mediaAxios.post('/media', formData)
            }

            const createPostRequest = await createPostAxios.post('/' + communityId, { data: { content: text, imageURI: mediaRequest.photos[0] } })
            return createPostRequest

        } catch (err) {
            console.error(err)
        }
    }

    const getPostById = async (postId) => {
        try {
            const postAxios = getAuthenticatedAxios('/post', tokenFromStore);
            const response = await postAxios.get(`/${postId}`);
            return response;
        } catch (error) {

        }
    }

    const createComment = async (postId, content, parentCommentId = undefined) => {
        try {
            const postAxios = getAuthenticatedAxios('/post', tokenFromStore);
            const response = await postAxios.post(`/${postId}/comment`, {
                content,
                parentId: parentCommentId
            });
            return response;
        } catch (error) {

        }
    }

    return { createPost, getPostById, createComment };

}

export default usePostService;