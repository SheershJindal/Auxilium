import { useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig";

const useSearchService = () => {
    const tokenFromStore = useSelector(state => state.auth.token);

    const getSearchTerm = async (term) => {
        try {
            const searchAxios = getAuthenticatedAxios('/search', tokenFromStore);
            const response = await searchAxios.get(`?term=${term}`);
            return response;
        } catch (error) {

        }
    }
    return { getSearchTerm }
}
export default useSearchService;