import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Autocomplete, Grid, TextField, Typography, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getMethodologies } from '../../store/apiCall/projects';
import { linkMethodologyToProject } from '../../store/apiCall/tokenize';



const validationSchema = Yup.object({
    methodologyIdentifier: Yup.string().required('Methodology is required'),
});

export default function MethodologyForm({ projectDetails, modules, projectId, handleNext, handleBack }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = React.useState(false);
    const [methodologies, setMethodologies] = React.useState([]);
    const [methodologyLoading, setMethodologyLoading] = React.useState(false);

    React.useEffect(() => {
        dispatch(getMethodologies(setMethodologyLoading, setMethodologies));
    }, []);

    if (projectDetails?.onchain?.methodologyIdentifier) {
        return (
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">Methodology is linked.</Typography>

                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2, background: "#f7f7f7" }}>



                        <Box mt={1}>
                            <Typography><b>Methodology:</b> {projectDetails?.onchain?.methodologyIdentifier}</Typography>
                            <Typography><b>Metadata Hash:</b> {projectDetails?.onchain?.metadataHash}</Typography>
                            <Typography><b>Metadata Pointer:</b> {projectDetails?.onchain?.metadataPointer}</Typography>
                        </Box>

                    </Paper>
                </Grid>

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
                    The user is yet to link the methodology to the project.
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

        <Formik
            initialValues={{ methodologyIdentifier: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                const payload = {
                    methodologyIdentifier: values.methodologyIdentifier,
                };
                dispatch(linkMethodologyToProject(projectId, setLoading, payload, () => {
                    handleNext(true);
                }));
            }}
        >
            {({ setFieldValue, values, errors, touched }) => (
                <Form>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                name="methodologyIdentifier"
                                size='small'
                                component={Autocomplete}
                                options={methodologies}
                                disableClearable={true}
                                loading={methodologyLoading}
                                getOptionLabel={(option) => option.methodologyIdentifier}
                                onChange={(event, value) =>
                                    setFieldValue('methodologyIdentifier', value?.methodologyIdentifier || '')
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Methodology"
                                        error={touched.methodologyIdentifier && Boolean(errors.methodologyIdentifier)}
                                        helperText={touched.methodologyIdentifier && errors.methodologyIdentifier}
                                    />
                                )}
                            />
                        </Grid>

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

                </Form>
            )}
        </Formik>
    );
}
