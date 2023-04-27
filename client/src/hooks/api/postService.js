import { useDispatch, useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig";

const usePostService = () => {
    const dispatch = useDispatch();

    const tokenFromStore = useSelector(state => state.auth.token);

    const createPost = async (text, communityId, mediaData) => {
        try {
            const createPostAxios = getAuthenticatedAxios('/post', tokenFromStore);
            const mediaAxios = getAuthenticatedAxios('/uploads', tokenFromStore, { headers: { "Content-Type": "multipart/form-data" } })

            let mediaRequest = null;

            if (mediaData.URI) {
                var formData = new FormData();
                // formData.append('photos', { name: 'Name', uri: mediaData.URI, type: mediaData.type })
                formData.append('photos', { name: 'image.png', uri: mediaData.URI, type: 'image/png' })
                mediaRequest = await mediaAxios.post('/media', formData)
                console.log(formData)
            }

            console.log(mediaRequest)

            const createPostRequest = await createPostAxios.post('/' + communityId, { data: { content: text, imageURI: mediaRequest.photos[0] } })
            return createPostRequest

        } catch (err) {
            console.log(err)
        }
    }

    return { createPost }

}

export default usePostService;