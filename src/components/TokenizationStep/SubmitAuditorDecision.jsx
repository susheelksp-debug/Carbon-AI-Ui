import React from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Grid,
    Button,
    Typography,
    Paper,
    Box,
    FormControlLabel,
    Checkbox,
    FormGroup
} from "@mui/material";
import { submitAuditData } from "../../store/apiCall/tokenize";
import { useDispatch, useSelector } from "react-redux";

// 🔥 Yup Validation Schema
const schema = Yup.object().shape({
    report: Yup.array().of(
        Yup.object().shape({
            vintage: Yup.string().required(),
            reportId: Yup.string().required("Report ID is required."),
            leakageId: Yup.string().required("Leakage ID is required."),
            approved: Yup.boolean()
                .oneOf([true], "You must finalize before submitting")
                .required("Finalize is required")

        })
    )
});

export default function SubmitAuditorDecision({ projectDetails, handleNext, projectId, handleBack }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = React.useState(false);
    const formik = useFormik({
        initialValues: {
            report: projectDetails?.audit?.emissionEvidence?.map((m, i) => ({
                vintage: m.vintage,
                reportId: m.reportId || '',
                leakageId: projectDetails?.audit?.leakage?.[i]?.reportId || '',
                approved: false
            }))
        },

        validationSchema: schema,

        onSubmit: (values) => {
            let payload = values.report.map((m) => ({
                vintage: m.vintage,
                reportId: m.reportId,
                leakageId: m.leakageId,
                approved: m.approved
            }));
            dispatch(submitAuditData(projectId, setLoading, payload, () => {
                handleNext(true);
            }))
        }
    });
    const { user } = useSelector((state) => state.auth);

    const { values, errors, touched, setFieldValue, handleSubmit, handleChange } = formik;

    if (projectDetails?.audit?.audits?.length > 0) {
        return (
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">Auditor has Submitted the Audits data.</Typography>

                </Grid>
                {projectDetails?.audit?.audits
                    .map((m, index) => (
                        <Grid key={index} size={{ xs: 12 }}>
                            <Paper sx={{ p: 2, background: "#f7f7f7" }}>
                                <Typography variant="h6">
                                    Vintage #{m.vintage}
                                </Typography>


                                <Box mt={1}>
                                    <Typography><b>Report Pointer:</b> {m.reportPointer}</Typography>
                                    <Typography><b>Report Hash:</b> {m.reportHash}</Typography>
                                    <Typography><b>Approved:</b> {m?.approved ? "Yes" : "No"}</Typography>
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
    } else if (user?.role !== 'verifier') {
        return (
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Audit activities are underway. We will proceed once the auditor’s report is received.
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
                            {values?.report?.map((module, index) => {
                                const moduleErrors = errors.report?.[index] || {};
                                const moduleTouched = touched.report?.[index] || {};

                                return (
                                    <Grid size={{ xs: 12 }} key={index}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6">
                                                Vintage #{module.vintage}
                                            </Typography>

                                            <Typography variant="h6">
                                                Report Id #{module.reportId}
                                            </Typography>

                                            <Typography variant="h6">
                                                Leakage Id #{module.leakageId}
                                            </Typography>





                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name={`report.${index}.approved`}
                                                            checked={module.approved}
                                                            onChange={handleChange}
                                                        />
                                                    }
                                                    label="Approve and Finalize"
                                                />
                                            </FormGroup>

                                            {moduleTouched.approved && moduleErrors.approved && (
                                                <Typography color="error" variant="caption">
                                                    {moduleErrors.approved}
                                                </Typography>
                                            )}


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
