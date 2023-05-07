import { useDispatch, useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig";

const useCommunityService = () => {
    const dispatch = useDispatch();

    const tokenFromStore = useSelector(state => state.auth.token);

    const getTrendingCommunities = async () => {

    }

    const getSubscribedCommunities = async () => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/community', tokenFromStore)
            const response = await authenticatedAxios.get('/my')
            return response
        } catch (e) {
        }
    }

    const getAllCommunities = async () => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/community', tokenFromStore);
            const response = await authenticatedAxios.get('/');
            return response;
        } catch (error) {
        }
    }

    const getCommunity = async (id) => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/community', tokenFromStore);
            const response = await authenticatedAxios.get(`${id}?page=0`);
            return response
        } catch (error) {

        }
    }

    const subscribeToCommunity = async (communityId) => {
        try {
            const communityAxios = getAuthenticatedAxios('/community', tokenFromStore);
            const response = await communityAxios.post(`/${communityId}/subscribe`);
            return response;
        } catch (error) {

        }
    }

    const leaveSubscribedCommunity = async (communityId) => {
        try {
            const communityAxios = getAuthenticatedAxios('/community', tokenFromStore);
            const response = await communityAxios.delete(`/${communityId}/leave`);
            return response;
        } catch (error) {

        }
    }

    return { getSubscribedCommunities, getAllCommunities, getCommunity, subscribeToCommunity, leaveSubscribedCommunity }

}

export default useCommunityService;