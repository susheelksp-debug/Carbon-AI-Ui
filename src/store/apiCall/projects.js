import axiosInstance from "../../instance";
import { enqueue } from "../slices/snakbar";

/**
 * this function used to fetch project list
 * @param {Function} setLoading 
 * @param {Function} setProjects 
 */

export const getAllProject = (setLoading, setProjects, loading = true) => async (dispatch) => {
    setLoading(loading);
    try {
        const response = await axiosInstance.get("/owner/projects");
        if (response.status === 200) {
            setProjects(response?.data?.projects || [])
        }
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false);
    }
}


/**
 * this function used to fetch auditor assigned project list
 * @param {Function} setLoading 
 * @param {Function} setProjects 
 */

export const getAllProjectForAuditor = (setLoading, setProjects, loading = true) => async (dispatch) => {
    setLoading(loading);
    try {
        const response = await axiosInstance.get("/verifier/assignments");
        if (response.status === 200) {
            setProjects(response?.data?.assignments || [])
        }
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false);
    } 
}



/**
 * This function used fetch project details by projectId
 * @param {string} projectId 
 * @param {Function} setLoading 
 * @param {Function} setProjectDetails  
 */

export const getProjectDetailsById = (projectId, setLoading, setProjectDetails, loading = true) => async (dispatch) => {
    setLoading(loading);
    try {
        const response = await axiosInstance.get(`/owner/projects/${projectId}`);
        if (response.status === 200) {
            setProjectDetails(response?.data || null)
        }
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false);
    }
}


/**
 * this function is used to upload project details json file to ipfs
 * @param {FormData} formdata 
 * @returns JSON
 */
export const uploadFiletoIPFS = async (formdata) => {
    try {
        const response = await axiosInstance.post("/admin/ipfs/pinata/json", formdata)
        return response;
    } catch (error) {
        return error
    }
}



/**
 * This function used to create new project.
 * @param {Function} setLoading 
 * @param {JSON} payload 
 * @param {Function} callBack 
 */


export const creatProject = (setLoading, payload, callBack) => async (dispatch) => {
    setLoading(true);
    try {
        const response = await axiosInstance.post("/admin/projects", payload)
        if (response.status === 201) {
            dispatch(enqueue({ message: "Project created successfully.", variant: 'success' }));
            if (callBack) callBack();
        }
    } catch (error) {
        console.error("Project creation is failed:", error);
        dispatch(enqueue({ message: error?.response?.data?.error || "Project creation is failed. Please try again.", variant: 'error' }));
    } finally {
        setLoading(false);
    }
}



/**
 * This function used to fetch methodologies for a project
 * @param {Function} setLoading 
 * @param {Function} setProjectDetails  
 */

export const getMethodologies = (setLoading, setMethodologies, loading = true) => async (dispatch) => {
    setLoading(loading);
    try {
        const response = await axiosInstance.get(`/methodologies`);
        if (response.status === 200) {
            setMethodologies(response?.data?.methodologies || [])
        }
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false);
    }
}


