import React from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
} from "@mui/material";
import { addBufferPercentageData } from "../../store/apiCall/tokenize";
import { useDispatch, useSelector } from "react-redux";

// 🔥 Yup Validation Schema
const schema = Yup.object().shape({
    bufferData: Yup.array().of(
        Yup.object().shape({
            vintage: Yup.string().required(),
            bufferPct: Yup.number().required("Buffer Percentage is required.").min(0.1, "Buffer Percentage cannot be less than 0.1").max(100, "Buffer Percentage cannot be more than 100"),
        })
    )
});

export default function BufferSetting({ projectDetails, handleNext, projectId, handleBack }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = React.useState(false);
    const formik = useFormik({
        initialValues: {
            bufferData: projectDetails?.vintageParameters?.map((m) => ({
                vintage: m.vintage,
                bufferPct: "",
            }))
        },

        validationSchema: schema,

        onSubmit: (values) => {
            let payload = values.bufferData.map((m) => ({
                vintage: m.vintage,
                bufferPct: m.bufferPct
            }));
            dispatch(addBufferPercentageData(projectId, setLoading, payload, () => {
                handleNext(true);
            }))
        }
    });

    const { values, errors, touched, setFieldValue, handleSubmit } = formik;

    // const modulesNeedingSensors = modules.filter(m => m.sensors.length === 0);

    // // If ALL modules already have sensors → skip screen entirely
    if (projectDetails?.vintageParameters?.length > 0 && projectDetails.vintageParameters.every(v => v.bufferPct)) {
        return (<Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Vintage Parameters Already Added
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Vintage</TableCell>
                            <TableCell>Buffer Uncertainty %</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectDetails?.vintageParameters?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {row?.vintage}
                                </TableCell>
                                <TableCell>
                                    {row?.bufferPct}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" mt={2}>
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
            </Box>
        </Paper>);
    } else if (user?.role !== 'admin') {
        return (
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    The admin is currently reviewing and adding the buffer settings for this project. You will be able to proceed once they have completed this step.

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
                            {values?.bufferData?.map((module, index) => {
                                const moduleErrors = errors.bufferData?.[index] || {};
                                const moduleTouched = touched.bufferData?.[index] || {};

                                return (
                                    <Grid size={{ xs: 12 }} key={index}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6">
                                                Vintage #{module.vintage}
                                            </Typography>

                                            {/* Sensor ID */}
                                            <TextField
                                                fullWidth
                                                label="Buffer Percentage (%)"
                                                sx={{ mt: 2 }}
                                                size="small"
                                                type="number"
                                                value={module.bufferPct}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `bufferData.${index}.bufferPct`,
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    moduleTouched.bufferPct &&
                                                    Boolean(moduleErrors.bufferPct)
                                                }
                                                helperText={
                                                    moduleTouched.bufferPct && moduleErrors.bufferPct
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
