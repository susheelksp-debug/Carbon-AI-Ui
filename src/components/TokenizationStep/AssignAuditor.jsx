import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Autocomplete, Grid, TextField, Typography, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getMethodologies } from '../../store/apiCall/projects';
import { assignAuditor, linkMethodologyToProject } from '../../store/apiCall/tokenize';
import { fetchUsers } from '../../store/slices/user';



const validationSchema = Yup.object({
    auditor: Yup.object({}).nonNullable("Auditor is required").required('Auditor is required'),
});

export default function AssignAuditor({ projectDetails, modules, projectId, handleNext, handleBack }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [userLoading, setUserLoading] = React.useState(false);

    React.useEffect(() => {
        dispatch(fetchUsers(setUserLoading, setUsers));
    }, []);

    if (projectDetails?.audit?.auditors?.length > 0) {
        return (
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">Auditor is already assigned.</Typography>

                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2, background: "#f7f7f7" }}>



                        <Box mt={1}>
                            <Typography><b>Auditor:</b> {projectDetails?.audit?.auditors[0]?.displayAuditor}</Typography>

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
    } else if (user?.role !== 'admin') {
        return (
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    An auditor is yet to be assigned to this project by the admin.
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
            initialValues={{ auditor: null }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                const payload = {
                    auditor: values.auditor.walletAddress,
                };
                dispatch(assignAuditor(projectId, setLoading, payload, () => {
                    handleNext(true);
                }));
            }}
        >
            {({ setFieldValue, values, errors, touched }) => (
                <Form>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                name="auditor"
                                size='small'
                                component={Autocomplete}
                                options={users?.filter(u => u.role === 'verifier') || []}
                                disableClearable={true}
                                loading={userLoading}
                                getOptionLabel={(option) => option.email}
                                onChange={(event, value) =>
                                    setFieldValue('auditor', value || '')
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Auditor"
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
