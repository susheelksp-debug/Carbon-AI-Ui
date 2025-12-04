import axiosInstance from "../../instance";
import { enqueue } from "../slices/snakbar";


/** * This function is used to register sensor devices for  a project
 * @param {string} projectId 
 * @param {Function} setLoading
 * @param {ArrayIterator} payloadArray
 * @param {Function} onAllSuccess - callback function to be called if all registrations succeed
 */
export const registerMultipleSensorDevices = (
    projectId,
    setLoading,
    payloadArray,
    onAllSuccess // <-- callback function
) => async (dispatch) => {
    setLoading(true)
    const results = {
        success: [],
        failed: []
    };

    for (const payload of payloadArray) {
        try {
            const response = await axiosInstance.post(
                `/admin/projects/${projectId}/sensors`,
                payload
            );

            results.success.push({
                moduleIndex: payload.moduleIndex,
                response: response.data
            });

        } catch (error) {
            results.failed.push({
                moduleIndex: payload.moduleIndex,
                error: error.response?.data || error.message
            });
            dispatch(enqueue({ message: error?.response?.data?.error || "Sensor registration is failed. Please try again.", variant: 'error' }));
            setLoading(false);
            return; // Exit on first failure
        }
    }

    // 🔥 only call callback if everything succeeded
    if (results.failed.length === 0) {
        if (typeof onAllSuccess === "function") {
            onAllSuccess(results.success);
            dispatch(enqueue({ message: "Sensors registered successfully.", variant: 'success' }));
        }
    }
    setLoading(false);

    return results;
};


/** * This function is used to register Calibration of sensor device for a project
 * @param {Function} setLoading
 * @param {ArrayIterator} payloadArray
 * @param {Function} onAllSuccess - callback function to be called if all registrations succeed
 */
export const registerCalibrationSensorDevices = (
    setLoading,
    payloadArray,
    onAllSuccess // <-- callback function
) => async (dispatch) => {
    setLoading(true)
    const results = {
        success: [],
        failed: []
    };

    for (const payload of payloadArray) {
        try {
            const response = await axiosInstance.post(
                `/admin/sensors/calibrations`,
                payload
            );

            results.success.push({
                sensorId: payload.sensorId,
                response: response.data
            });

        } catch (error) {
            results.failed.push({
                sensorId: payload.sensorId,
                error: error.response?.data || error.message
            });
            dispatch(enqueue({ message: error?.response?.data?.error || "Calibration registration is failed. Please try again.", variant: 'error' }));
            setLoading(false);
            return; // Exit on first failure
        }
    }

    // 🔥 only call callback if everything succeeded
    if (results.failed.length === 0) {
        if (typeof onAllSuccess === "function") {
            onAllSuccess(results.success);
            dispatch(enqueue({ message: "Calibration registered successfully.", variant: 'success' }));
        }
    }
    setLoading(false);

    return results;
};


/** * This function is used to register telemetry data of sensor device for a project
 * @param {Function} setLoading
 * @param {ArrayIterator} payloadArray
 * @param {Function} onAllSuccess - callback function to be called if all registrations succeed
 */
export const recordTelemetryData = (
    setLoading,
    payloadArray,
    onAllSuccess // <-- callback function
) => async (dispatch) => {
    setLoading(true)
    const results = {
        success: [],
        failed: []
    };

    for (const payload of payloadArray) {
        try {
            const response = await axiosInstance.post(
                `/admin/sensors/data`,
                payload
            );

            results.success.push({
                sensorId: payload.sensorId,
                response: response.data
            });

        } catch (error) {
            results.failed.push({
                sensorId: payload.sensorId,
                error: error.response?.data || error.message
            });
            dispatch(enqueue({ message: error?.response?.data?.error || "Telemetry data registration is failed. Please try again.", variant: 'error' }));
            setLoading(false);
            return; // Exit on first failure
        }
    }

    // 🔥 only call callback if everything succeeded
    if (results.failed.length === 0) {
        if (typeof onAllSuccess === "function") {
            onAllSuccess(results.success);
            dispatch(enqueue({ message: "Telemetry data registered successfully.", variant: 'success' }));
        }
    }
    setLoading(false);

    return results;
};


/**
 * This function used to link methodology to project.
 * @param {string} projectId
 * @param {Function} setLoading 
 * @param {JSON} payload 
 * @param {Function} callBack 
 */


export const linkMethodologyToProject = (projectId, setLoading, payload, callBack) => async (dispatch) => {
    setLoading(true);
    try {
        const response = await axiosInstance.post(`/admin/projects/${projectId}/methodology-link`, payload)
        if (response.status === 200) {
            dispatch(enqueue({ message: "Methodology linked successfully.", variant: 'success' }));
            if (callBack) callBack();
        }
    } catch (error) {
        console.error("Methodology linking is failed:", error);
        dispatch(enqueue({ message: error?.response?.data?.error || "Methodology linking is failed. Please try again.", variant: 'error' }));
    } finally {
        setLoading(false);
    }
}


/**
 * This function used to add nominal to project.
 * @param {string} projectId
 * @param {Function} setLoading 
 * @param {JSON} payload 
 * @param {Function} callBack 
 */


export const addnominaltoProject = (projectId, setLoading, payload, callBack) => async (dispatch) => {
    setLoading(true);
    try {
        const response = await axiosInstance.post(`/admin/projects/${projectId}/vintage-parameters`, payload)
        if (response.status === 201) {
            dispatch(enqueue({ message: "Nominal and Uncertainty are added successfully.", variant: 'success' }));
            if (callBack) callBack();
        }
    } catch (error) {
        console.error("Adding Nominal and Uncertainty  is failed:", error);
        dispatch(enqueue({ message: error?.response?.data?.error || "Adding Nominal and Uncertainty  is failed. Please try again.", variant: 'error' }));
    } finally {
        setLoading(false);
    }
}

/** * This function is used to add emission data to project
 * @param {string} projectId 
 * @param {Function} setLoading
 * @param {ArrayIterator} payloadArray
 * @param {Function} onAllSuccess - callback function to be called if all registrations succeed
 */
export const addEmissionData = (
    projectId,
    setLoading,
    payloadArray,
    onAllSuccess // <-- callback function
) => async (dispatch) => {
    setLoading(true)
    const results = {
        success: [],
        failed: []
    };

    for (const payload of payloadArray) {
        try {
            const response = await axiosInstance.post(
                `/admin/projects/${projectId}/emission-reports`,
                payload
            );

            results.success.push({
                moduleIndex: payload.moduleIndex,
                response: response.data
            });

        } catch (error) {
            results.failed.push({
                moduleIndex: payload.moduleIndex,
                error: error.response?.data || error.message
            });
            dispatch(enqueue({ message: error?.response?.data?.error || "Adding Emission data is failed. Please try again.", variant: 'error' }));
            setLoading(false);
            return; // Exit on first failure
        }
    }

    // 🔥 only call callback if everything succeeded
    if (results.failed.length === 0) {
        if (typeof onAllSuccess === "function") {
            onAllSuccess(results.success);
            dispatch(enqueue({ message: "Emission data Added successfully.", variant: 'success' }));
        }
    }
    setLoading(false);

    return results;
};


/** * This function is used to add lickage data to project
 * @param {string} projectId 
 * @param {Function} setLoading
 * @param {ArrayIterator} payloadArray
 * @param {Function} onAllSuccess - callback function to be called if all registrations succeed
 */
export const addLickageData = (
    projectId,
    setLoading,
    payloadArray,
    onAllSuccess // <-- callback function
) => async (dispatch) => {
    setLoading(true)
    const results = {
        success: [],
        failed: []
    };

    for (const payload of payloadArray) {
        try {
            const response = await axiosInstance.post(
                `/admin/projects/${projectId}/leakage`,
                payload
            );

            results.success.push({
                moduleIndex: payload.moduleIndex,
                response: response.data
            });

        } catch (error) {
            results.failed.push({
                moduleIndex: payload.moduleIndex,
                error: error.response?.data || error.message
            });
            dispatch(enqueue({ message: error?.response?.data?.error || "Adding lickage data is failed. Please try again.", variant: 'error' }));
            setLoading(false);
            return; // Exit on first failure
        }
    }

    // 🔥 only call callback if everything succeeded
    if (results.failed.length === 0) {
        if (typeof onAllSuccess === "function") {
            onAllSuccess(results.success);
            dispatch(enqueue({ message: "Lickage data Added successfully.", variant: 'success' }));
        }
    }
    setLoading(false);

    return results;
};


/** * This function is used to add buffer percentage data to project
 * @param {string} projectId 
 * @param {Function} setLoading
 * @param {ArrayIterator} payloadArray
 * @param {Function} onAllSuccess - callback function to be called if all registrations succeed
 */
export const addBufferPercentageData = (
    projectId,
    setLoading,
    payloadArray,
    onAllSuccess // <-- callback function
) => async (dispatch) => {
    setLoading(true)
    const results = {
        success: [],
        failed: []
    };

    for (const payload of payloadArray) {
        try {
            const response = await axiosInstance.post(
                `/admin/projects/${projectId}/buffer-limit`,
                payload
            );

            results.success.push({
                moduleIndex: payload.moduleIndex,
                response: response.data
            });

        } catch (error) {
            results.failed.push({
                moduleIndex: payload.moduleIndex,
                error: error.response?.data || error.message
            });
            dispatch(enqueue({ message: error?.response?.data?.error || "Adding buffer data is failed. Please try again.", variant: 'error' }));
            setLoading(false);
            return; // Exit on first failure
        }
    }

    // 🔥 only call callback if everything succeeded
    if (results.failed.length === 0) {
        if (typeof onAllSuccess === "function") {
            onAllSuccess(results.success);
            dispatch(enqueue({ message: "Buffer data Added successfully.", variant: 'success' }));
        }
    }
    setLoading(false);

    return results;
};



/** * This function is used to get issuance preview data by project id
 * @param {string} projectId 
 * @param {Function} setLoading 
 * @param {Function} setProjectDetails  
 */

export const getIssuanceDataByProjectId = (projectId, setLoading, setProjectDetails, loading = true) => async (dispatch) => {
    setLoading(loading);
    try {
        const response = await axiosInstance.post(`/admin/issuance/preview`, { projectId });
        if (response.status === 200) {
            setProjectDetails(response?.data || null)
        }
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false);
    }
}
