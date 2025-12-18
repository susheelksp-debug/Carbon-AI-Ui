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
import { registerMultipleSensorDevices } from "../../store/apiCall/tokenize";
import { useDispatch, useSelector } from "react-redux";

// 🔥 Yup Validation Schema
const schema = Yup.object().shape({
    modules: Yup.array().of(
        Yup.object().shape({
            moduleIndex: Yup.number().required(),
            sensorId: Yup.string().required("Sensor ID is required."),
            purpose: Yup.string().required("Purpose is required."),
            metaDataFile: Yup.mixed().required("Metadata JSON file is required."),
            metadataCid: Yup.string().required("Metadata CID is required."),
            metadata: Yup.object().shape({
                type: Yup.string().required("Metadata type is required."),
                location: Yup.string().required("Location is required."),
                units: Yup.string().required("Units are required.")
            })
        })
    )
});

export default function RegisterSensorData({ modules, sensors, handleNext, projectId, handleBack }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = React.useState(false);
    const formik = useFormik({
        initialValues: {
            modules: modules.map((m) => ({
                moduleIndex: m.moduleIndex,   // ✔ use moduleIndex from backend
                sensorId: "",
                purpose: "",
                metaDataFile: null,
                metadataCid: "",
                metadata: {
                    type: "",
                    location: "",
                    units: ""
                }
            }))
        },

        validationSchema: schema,

        onSubmit: (values) => {
            console.log("FINAL MODULE METADATA:", values);
            let payload = values.modules.map((m) => ({
                moduleIndex: m.moduleIndex,
                sensorId: m.sensorId,
                purpose: m.purpose,
                metadataCid: m.metadataCid,
                metadata: m.metadata
            }));
            dispatch(registerMultipleSensorDevices(projectId, setLoading, payload, () => {
                handleNext(true);
            }))
        }
    });

    const { values, errors, touched, setFieldValue, handleSubmit } = formik;

    const modulesNeedingSensors = modules.filter(m => m.sensors.length === 0);

    // If ALL modules already have sensors → skip screen entirely
    if (modulesNeedingSensors.length === 0) {
        return (
            <Box>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">All modules already have sensors registered.</Typography>

                    </Grid>
                    {modules
                        .filter(m => m.sensors.length > 0)
                        .map((m) => (
                            <Grid key={m.moduleIndex} size={{ xs: 12 }}>
                                <Paper sx={{ p: 2, background: "#f7f7f7" }}>
                                    <Typography variant="h6">
                                        Module #{m.moduleIndex} – Sensor Registered
                                    </Typography>

                                    {m.sensors.map((s, idx) => (
                                        <Box key={idx} mt={1}>
                                            <Typography><b>Sensor ID:</b> {s.sensorId}</Typography>
                                            <Typography><b>Metadata CID:</b> {s.metadataCid}</Typography>
                                            <Typography><b>Created:</b> {s.createdAt}</Typography>
                                        </Box>
                                    ))}
                                </Paper>
                            </Grid>
                        ))}
                </Grid>

                <Grid size={{ xs: 12 }} display={"flex"} justifyContent="space-between">
                    <Button
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleNext}>
                        Next
                    </Button>
                </Grid>
            </Box>
        );
    } else if (user?.role !== 'owner') {
        return (
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    The user is yet to register sensor devices.
                </Typography>
                {/* <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button
                            onClick={handleBack}
                            variant="outlined"
                        >
                            Back
                        </Button>
    
                    </Box> */}
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
                                    <Grid size={{ xs: 12 }} key={index}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6">
                                                Module #{module.moduleIndex + 1}
                                            </Typography>

                                            {/* Sensor ID */}
                                            <TextField
                                                fullWidth
                                                label="Sensor ID"
                                                sx={{ mt: 2 }}
                                                size="small"
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
                                            />

                                            <TextField
                                                fullWidth
                                                label="Purpose"
                                                sx={{ mt: 2 }}
                                                size="small"
                                                value={module.purpose}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `modules.${index}.purpose`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.purpose &&
                                                    Boolean(moduleErrors.purpose)
                                                }
                                                helperText={
                                                    moduleTouched.purpose && moduleErrors.purpose
                                                }
                                            />

                                            {/* Metadata Upload */}
                                            <Box mt={2}>
                                                <Typography variant="body2">
                                                    Upload Metadata JSON
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
                                                        formData.append('file', file);
                                                        const cid = await uploadFiletoIPFS(formData);
                                                        if (cid?.data?.cid) {
                                                            setFieldValue(
                                                                `modules.${index}.metadataCid`,
                                                                cid.data.cid
                                                            );
                                                        }

                                                    }}
                                                />

                                                {moduleErrors.metaDataFile &&
                                                    moduleTouched.metaDataFile && (
                                                        <Typography color="error" variant="caption">
                                                            {moduleErrors.metaDataFile}
                                                        </Typography>
                                                    )}

                                                {module.metadataCid && (
                                                    <Typography variant="caption" color="green">
                                                        CID: {module.metadataCid}
                                                    </Typography>
                                                )}

                                                {moduleTouched.metadataCid &&
                                                    moduleErrors.metadataCid && (
                                                        <Typography color="error" variant="caption">
                                                            {moduleErrors.metadataCid}
                                                        </Typography>
                                                    )}
                                            </Box>

                                            {/* Metadata Type */}
                                            <TextField
                                                fullWidth
                                                label="Metadata Type"
                                                sx={{ mt: 2 }}
                                                size="small"
                                                value={module.metadata.type}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `modules.${index}.metadata.type`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.metadata?.type &&
                                                    Boolean(moduleErrors.metadata?.type)
                                                }
                                                helperText={
                                                    moduleTouched.metadata?.type &&
                                                    moduleErrors.metadata?.type
                                                }
                                            />

                                            {/* Metadata Location */}
                                            <TextField
                                                fullWidth
                                                label="Metadata Location"
                                                sx={{ mt: 2 }}
                                                size="small"
                                                value={module.metadata.location}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `modules.${index}.metadata.location`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.metadata?.location &&
                                                    Boolean(moduleErrors.metadata?.location)
                                                }
                                                helperText={
                                                    moduleTouched.metadata?.location &&
                                                    moduleErrors.metadata?.location
                                                }
                                            />

                                            {/* Metadata Units */}
                                            <TextField
                                                fullWidth
                                                label="Metadata Units"
                                                sx={{ mt: 2 }}
                                                size="small"
                                                value={module.metadata.units}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `modules.${index}.metadata.units`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.metadata?.units &&
                                                    Boolean(moduleErrors.metadata?.units)
                                                }
                                                helperText={
                                                    moduleTouched.metadata?.units &&
                                                    moduleErrors.metadata?.units
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                );
                            })}

                            {/* Submit */}
                            <Grid size={{ xs: 12 }} display={"flex"} justifyContent="space-between">
                                <Button
                                    disabled={loading}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    Back
                                </Button>
                                <Button disabled={loading} loading={loading} variant="contained" color="primary" type="submit">
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
