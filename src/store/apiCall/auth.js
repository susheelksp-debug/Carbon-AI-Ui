import axiosInstance from "../../instance/index"
import { loginSuccess } from "../slices/auth";
import { enqueue } from '../slices/snakbar';




export const login = (credentials, setLoading, callBack) => async (dispatch) => {
    setLoading(true);
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        if (response.status === 200) {
            const { token, user } = response.data;
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            dispatch(loginSuccess({
                token: {
                    access_token: token,
                }, user
            }));

            dispatch(enqueue({ message: "Login successfully", variant: 'success' }));

            if (callBack) callBack();
        } else {
            dispatch(enqueue({ message: "Login failed. Please try again.", variant: 'error' }));
        }


    } catch (error) {
        console.error("Login failed:", error);
        dispatch(enqueue({ message: error?.response?.data?.error || "Login failed. Please try again.", variant: 'error' }));

    } finally {
        setLoading(false);
    }
}