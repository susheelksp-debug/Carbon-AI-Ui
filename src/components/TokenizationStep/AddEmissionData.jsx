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
import { addEmissionData } from "../../store/apiCall/tokenize";
import { useDispatch, useSelector } from "react-redux";

// 🔥 Yup Validation Schema
const schema = Yup.object().shape({
    emissionData: Yup.array().of(
        Yup.object().shape({
            vintage: Yup.string().required(),
            reportId: Yup.string().required("Report ID is required."),
            metaDataFile: Yup.mixed().required("Metadata JSON file is required."),
            cid: Yup.string().required("CID is required."),
            amount: Yup.number().required("Amount is required."),
        })
    )
});

export default function AddEmissionData({ projectDetails, handleNext, projectId, handleBack }) {
    console.log("Project Details in AddEmissionData:", projectDetails);
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = React.useState(false);
    const formik = useFormik({
        initialValues: {
            emissionData: projectDetails?.vintageParameters?.map((m) => ({
                vintage: m.vintage,
                reportId: "",
                metaDataFile: null,
                cid: "",
                amount: "",
            }))
        },

        validationSchema: schema,

        onSubmit: (values) => {
            let payload = values.emissionData.map((m) => ({
                vintage: m.vintage,
                reportId: m.reportId,
                cid: m.cid,
                amount: m.amount
            }));
            dispatch(addEmissionData(projectId, setLoading, payload, () => {
                handleNext(true);
            }))
        }
    });

    const { values, errors, touched, setFieldValue, handleSubmit } = formik;

    // const modulesNeedingSensors = modules.filter(m => m.sensors.length === 0);

    // // If ALL modules already have sensors → skip screen entirely
    if (projectDetails?.audit?.emissionEvidence?.length > 0) {
        return (
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">All modules Emission Reports are Submitted.</Typography>

                </Grid>
                {projectDetails?.audit?.emissionEvidence

                    .map((m, index) => (
                        <Grid key={index} size={{ xs: 12 }}>
                            <Paper sx={{ p: 2, background: "#f7f7f7" }}>
                                <Typography variant="h6">
                                    Vintage #{m.vintage}
                                </Typography>


                                <Box mt={1}>
                                    <Typography><b>Data Pointer:</b> {m.dataPointer}</Typography>
                                    <Typography><b>Metadata CID:</b> {m.cid}</Typography>
                                    <Typography><b>Data Hash:</b> {m.dataHash}</Typography>
                                    <Typography><b>Amount:</b> {m.amount}</Typography>
                                </Box>

                            </Paper>
                        </Grid>
                    ))}
                <Grid size={{ xs: 12 }} display={"flex"} justifyContent="space-between" mt={2}>
                    <Button
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                </Grid>
            </Grid>
        );
    } else if (user?.role !== 'owner') {
        return (
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    The user is yet to add the emission data to the project.
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
                    name="emissionData"
                    render={() => (
                        <Grid container spacing={2}>
                            {values?.emissionData?.map((module, index) => {
                                const moduleErrors = errors.emissionData?.[index] || {};
                                const moduleTouched = touched.emissionData?.[index] || {};

                                return (
                                    <Grid size={{ xs: 12 }} key={index}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6">
                                                Vintage #{module.vintage}
                                            </Typography>

                                            {/* Sensor ID */}
                                            <TextField
                                                fullWidth
                                                label="Report ID"
                                                sx={{ mt: 2 }}
                                                size="small"
                                                value={module.reportId}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `emissionData.${index}.reportId`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.reportId &&
                                                    Boolean(moduleErrors.reportId)
                                                }
                                                helperText={
                                                    moduleTouched.reportId && moduleErrors.reportId
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
                                                            `emissionData.${index}.metaDataFile`,
                                                            file
                                                        );
                                                        const formData = new FormData();
                                                        formData.append('file', file);
                                                        const cid = await uploadFiletoIPFS(formData);
                                                        if (cid?.data?.cid) {
                                                            setFieldValue(
                                                                `emissionData.${index}.cid`,
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

                                                {module.cid && (
                                                    <Typography variant="caption" color="green">
                                                        CID: {module.cid}
                                                    </Typography>
                                                )}

                                                {moduleTouched.metadataCid &&
                                                    moduleErrors.metadataCid && (
                                                        <Typography color="error" variant="caption">
                                                            {moduleErrors.metadataCid}
                                                        </Typography>
                                                    )}
                                            </Box>

                                            <TextField
                                                fullWidth
                                                label="Amount"
                                                sx={{ mt: 2 }}
                                                size="small"
                                                type="number"
                                                value={module.amount}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `emissionData.${index}.amount`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.amount &&
                                                    Boolean(moduleErrors.amount)
                                                }
                                                helperText={
                                                    moduleTouched.amount && moduleErrors.amount
                                                }
                                            />


                                        </Paper>
                                    </Grid>
                                );
                            })}

                            {/* Submit */}
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
