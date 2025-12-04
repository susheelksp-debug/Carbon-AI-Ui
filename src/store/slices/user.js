import { set } from "react-hook-form";
import axiosInstance from "../../instance";
import { enqueue } from "./snakbar";


/**
 * this function fetches the  user list.
 * @param {Function} setLoading 
 * @param {Function} setUsers 
 * @param {boolean} loading 
 * @returns 
 */
export const fetchUsers = (setLoading, setUsers, setFilteredUsers, loading = true) => async (dispatch) => {
    setLoading(loading);
    try {
        const response = await axiosInstance.get("/admin/users");
        if (response.status === 200) {
            setUsers(response?.data?.users || []);
            setFilteredUsers(response?.data?.users || []);
        }
    } catch (error) {
        dispatch(enqueue({ message: "Failed to fetch user data.", variant: "error" }));
    } finally {
        setLoading(false);
    }
};



/**
 * This function used to add new user.
 * @param {Function} setLoading 
 * @param {JSON} payload 
 * @param {Function} callBack 
 */


export const addUser = (setLoading, payload, callBack) => async (dispatch) => {
    setLoading(true);
    try {
        const response = await axiosInstance.post("/auth/signup", payload)
        if (response.status === 201) {
            dispatch(enqueue({ message: "User Created successfully.", variant: 'success' }));
            if (callBack) callBack();
        }
    } catch (error) {
        console.error("User creation is failed:", error);
        dispatch(enqueue({ message: error?.response?.data?.error || "User creation is failed. Please try again.", variant: 'error' }));
    } finally {
        setLoading(false);
    }
}
