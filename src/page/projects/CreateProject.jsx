import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import DropzoneField from '../../components/upload-files/UploadFiles';
import {
    Grid,
    Stack,
    Button,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    Paper,
    Box
} from '@mui/material';
import { uploadFiletoIPFS } from '../../store/apiCall/projects';

function CreateProject({ loading = false, handleSubmit, uploadModuleFile }) {
    const [moduleCids, setModuleCids] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false)

    const handleModuleUpload = async (files) => {
        let Files = [...files]
        setUploadLoading(true)
        const uploaded = [];

        for (const file of Files) {
            const formData = new FormData();
            formData.append('file', file);

            const cid = await uploadFiletoIPFS(formData);

            if (cid?.data?.cid) {
                uploaded.push({ "cid": cid.data.cid });
            }
        }

        setModuleCids(uploaded);
        setUploadLoading(false)
    };

    return (
        <Box my={2}>
            <Formik
                initialValues={{
                    projectName: '',
                    multiModule: false,
                    metadataCid: "",
                    modulesFiles: [],
                }}

                validationSchema={Yup.object().shape({
                    projectName: Yup.string().required('Project name is required'),
                    multiModule: Yup.boolean(),

                    modulesFiles: Yup.array().when('multiModule', {
                        is: true,
                        then: (schema) =>
                            schema
                                .min(2, 'Minimum two module JSON files required')
                                .required('Required'),
                        otherwise: (schema) =>
                            schema
                                .min(1, 'Upload at least one JSON file')
                                .max(1, "Maximum 1 file is allowed")
                                .required('Required'),
                    }),
                })}

                onSubmit={(values) => {
                    if (values.multiModule) {
                        if (moduleCids.length < 2) {
                            alert('Please upload module files and collect their CIDs before submitting.');
                            return;
                        }
                    } else {
                        if (moduleCids.length < 1) {
                            alert('Please upload at least one file and collect its CID before submitting.');
                            return;
                        }
                    }

                    const payload = {
                        multiModule: values.multiModule,
                        projectName: values.projectName,
                        modules: moduleCids,
                        metadataCid: values.metadataCid
                    };

                    handleSubmit(payload);
                }}
            >
                {({ values, touched, errors, handleChange }) => (
                    <Form>
                        <Grid container spacing={2}>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    name="projectName"
                                    label="Project Name"
                                    size="small"
                                    value={values.projectName}
                                    onChange={handleChange}
                                    error={touched.projectName && Boolean(errors.projectName)}
                                    helperText={touched.projectName && errors.projectName}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="multiModule"
                                            checked={values.multiModule}
                                            onChange={handleChange}
                                        />
                                    }
                                    label="This project has multiple modules"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2">Upload Module JSON Files</Typography>
                                <DropzoneField moduleCids={moduleCids} setModuleCids={setModuleCids} name="modulesFiles" accept={true} />

                                <Button
                                    sx={{ mt: 1 }}
                                    variant="outlined"
                                    disabled={
                                        (values.multiModule && values.modulesFiles.length < 2) ||
                                        (!values.multiModule && values.modulesFiles.length < 1)
                                    }
                                    loading={uploadLoading}
                                    onClick={() => handleModuleUpload(values.modulesFiles)}
                                >
                                    Upload Module Files → Collect CIDs
                                </Button>

                                {moduleCids.length > 0 && (
                                    <Paper sx={{ p: 2, mt: 1 }}>
                                        <Typography variant="subtitle2">Module CIDs:</Typography>
                                        {moduleCids.map((m, index) => (
                                            <Typography key={index} variant="caption" display="block">
                                                {index + 1}. {m.cid}
                                            </Typography>
                                        ))}
                                    </Paper>
                                )}
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button type="submit" variant="contained" color="secondary" loading={loading} disabled={loading}>
                                        Submit
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default CreateProject;