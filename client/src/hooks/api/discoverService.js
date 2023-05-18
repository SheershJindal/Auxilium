import { useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig";

const useDiscoverService = () => {
    const tokenFromStore = useSelector(state => state.auth.token);

    const getDiscover = async () => {
        try {
            const discoverAxios = getAuthenticatedAxios('/discover', tokenFromStore)
            const response = await discoverAxios.get('/');
            console.log(response)
            return response;
        } catch (error) {

        }
    }

    return { getDiscover }
}
export default useDiscoverService