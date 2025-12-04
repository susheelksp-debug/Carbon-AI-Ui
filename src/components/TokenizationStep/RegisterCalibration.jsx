import React from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    Box
} from "@mui/material";
import { uploadFiletoIPFS } from "../../store/apiCall/projects";
import { registerCalibrationSensorDevices } from "../../store/apiCall/tokenize";
import { useDispatch, useSelector } from "react-redux";

// --------- VALIDATION --------- //
const schema = Yup.object().shape({
    modules: Yup.array().of(
        Yup.object().shape({
            sensorId: Yup.string().required("Sensor ID is required."),
            metaDataFile: Yup.mixed().required("Certificate JSON file is required."),
            certificateCid: Yup.string().required("Certificate CID is required."),
            expiresAt: Yup.number().required("Expiry timestamp required."),
            metadata: Yup.object().shape({
                verifier: Yup.string().required("Verifier is required."),
                standard: Yup.string().required("Standard is required.")
            })
        })
    )
});

export default function RegisterCalibration({ modules, handleNext, handleBack, projectId }) {
    const sensors = modules?.flatMap((m) => m.sensors || []) || [];
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            modules: sensors.map((m) => ({
                sensorId: m.sensorId || "",
                metaDataFile: null,
                certificateCid: "",
                expiresAt: "",
                metadata: {
                    verifier: "",
                    standard: ""
                }
            }))
        },

        validationSchema: schema,

        onSubmit: (values) => {
            console.log("FINAL SENSOR PAYLOAD:", values);

            let payload = values.modules.map((m) => ({
                sensorId: m.sensorId,
                certificateCid: m.certificateCid,
                expiresAt: Number(m.expiresAt),
                metadata: m.metadata
            }));

            dispatch(
                registerCalibrationSensorDevices(setLoading, payload, () => {
                    handleNext(true);
                })
            );
        }
    });

    const { values, errors, touched, setFieldValue, handleSubmit } = formik;

    const hasCalibration = (sensor) =>
        sensor?.calibration?.certificateUri &&
        sensor.calibration.certificateUri.trim().length > 0;

    const everySensorHavingCalibration = sensors?.every(hasCalibration) || false;

    if (everySensorHavingCalibration) {
        return (
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">All Sensor Calibration are  registered.</Typography>

                </Grid>
                {sensors
                    .map((s, index) => (
                        <Grid key={index} size={{ xs: 12 }}>
                            <Paper sx={{ p: 2, background: "#f7f7f7" }}>
                                <Typography variant="h6">
                                    <Typography variant="h6">
                                        SensorId-{s.sensorId}
                                    </Typography>
                                </Typography>


                                <Box mt={1}>
                                    <Typography><b>Certificate Uri:</b> {s?.calibration?.certificateUri}</Typography>
                                    <Typography><b>Certificate Hash:</b> {s?.calibration?.certificateHash}</Typography>
                                    <Typography><b>Certificate Pointer:</b> {s?.calibration?.certificatePointer}</Typography>
                                </Box>

                            </Paper>
                        </Grid>
                    ))}
                <Grid size={{ xs: 12 }} display="flex" justifyContent="space-between" mt={2}>
                    <Button
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                </Grid>
            </Grid>
        )
    } else if (user?.role !== 'owner') {
        return (
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    The user is yet to register calibration data.
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back
                    </Button>

                </Box>
            </Paper>
        )
    }

    return (
        <FormikProvider value={formik}>
            <form onSubmit={handleSubmit}>
                <FieldArray
                    name="modules"
                    render={() => (
                        <Grid container spacing={2}>
                            {values.modules.map((module, index) => {
                                const moduleErrors = errors.modules?.[index] || {};
                                const moduleTouched = touched.modules?.[index] || {};

                                return (
                                    <Grid size={{ xs: 12 }} key={module.moduleIndex}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6">
                                                SensorId-{module.sensorId}
                                            </Typography>

                                            {/* Sensor ID */}
                                            {/* <TextField
                                                fullWidth
                                                label="Sensor ID"
                                                size="small"
                                                disabled
                                                sx={{ mt: 2 }}
                                                value={module.sensorId}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `modules.${index}.sensorId`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.sensorId &&
                                                    Boolean(moduleErrors.sensorId)
                                                }
                                                helperText={
                                                    moduleTouched.sensorId && moduleErrors.sensorId
                                                }
                                            /> */}

                                            {/* Metadata Upload */}
                                            <Box mt={2}>
                                                <Typography variant="body2">
                                                    Upload Certificate JSON
                                                </Typography>

                                                <TextField
                                                    type="file"
                                                    fullWidth
                                                    size="small"
                                                    accept="application/json"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setFieldValue(
                                                            `modules.${index}.metaDataFile`,
                                                            file
                                                        );

                                                        const formData = new FormData();
                                                        formData.append("file", file);

                                                        const cid = await uploadFiletoIPFS(formData);

                                                        if (cid?.data?.cid) {
                                                            setFieldValue(
                                                                `modules.${index}.certificateCid`,
                                                                cid.data.cid
                                                            );
                                                        }
                                                    }}
                                                />

                                                {moduleErrors.metaDataFile &&
                                                    moduleTouched.metaDataFile && (
                                                        <Typography variant="caption" color="error">
                                                            {moduleErrors.metaDataFile}
                                                        </Typography>
                                                    )}

                                                {module.certificateCid && (
                                                    <Typography variant="caption" color="green">
                                                        CID: {module.certificateCid}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* Expiry Timestamp */}
                                            <TextField
                                                fullWidth
                                                label="Expires At (unix timestamp)"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                value={module.expiresAt}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `modules.${index}.expiresAt`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.expiresAt &&
                                                    Boolean(moduleErrors.expiresAt)
                                                }
                                                helperText={
                                                    moduleTouched.expiresAt &&
                                                    moduleErrors.expiresAt
                                                }
                                            />

                                            {/* Verifier */}
                                            <TextField
                                                fullWidth
                                                label="Verifier"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                value={module.metadata.verifier}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `modules.${index}.metadata.verifier`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.metadata?.verifier &&
                                                    Boolean(moduleErrors.metadata?.verifier)
                                                }
                                                helperText={
                                                    moduleTouched.metadata?.verifier &&
                                                    moduleErrors.metadata?.verifier
                                                }
                                            />

                                            {/* Standard */}
                                            <TextField
                                                fullWidth
                                                label="Standard"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                value={module.metadata.standard}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `modules.${index}.metadata.standard`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.metadata?.standard &&
                                                    Boolean(moduleErrors.metadata?.standard)
                                                }
                                                helperText={
                                                    moduleTouched.metadata?.standard &&
                                                    moduleErrors.metadata?.standard
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                );
                            })}

                            <Grid size={{ xs: 12 }} display="flex" justifyContent="space-between" mt={2}>
                                <Button
                                    disabled={loading}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={loading}
                                    loading={loading}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                />
            </form>
        </FormikProvider>
    );
}
