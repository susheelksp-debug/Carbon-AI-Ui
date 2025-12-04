import React from "react";
import { useFormik, FormikProvider } from "formik";
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
import { useDispatch } from "react-redux";
import { enqueue } from "../../store/slices/snakbar";

// ✅ Yup validation
const schema = Yup.object().shape({
    methodologyIdentifier: Yup.string().required("Methodology Identifier is required."),
    metaDataFile: Yup.mixed().required("Metadata JSON file is required."),
    metadataCid: Yup.string().required("Metadata CID is required.")
});

export default function AddMethodology({ projectId, handleNext, submitMethodology }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            methodologyIdentifier: "",
            metaDataFile: null,
            metadataCid: ""
        },

        validationSchema: schema,

        onSubmit: async (values) => {
            setLoading(true);

            const payload = {
                methodologyIdentifier: values.methodologyIdentifier,
                metadataCid: values.metadataCid
            };

            try {
                await submitMethodology(projectId, payload);
                dispatch(enqueue({ message: "Methodology added successfully!", variant: "success" }));
                handleNext();
            } catch (err) {
                dispatch(enqueue({ message: "Failed to add methodology.", variant: "error" }));
            }

            setLoading(false);
        }
    });

    const { values, errors, touched, setFieldValue, handleSubmit } = formik;

    return (
        <FormikProvider value={formik}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">Add Methodology</Typography>
                    </Grid>

                    {/* Methodology Identifier */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Methodology Identifier (e.g., VM0049)"
                            sx={{ mt: 2 }}
                            size="small"
                            value={values.methodologyIdentifier}
                            onChange={(e) =>
                                setFieldValue("methodologyIdentifier", e.target.value)
                            }
                            error={
                                touched.methodologyIdentifier &&
                                Boolean(errors.methodologyIdentifier)
                            }
                            helperText={
                                touched.methodologyIdentifier && errors.methodologyIdentifier
                            }
                        />
                    </Grid>

                    {/* Upload Metadata JSON */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body2">Upload Metadata JSON</Typography>

                        <TextField
                            type="file"
                            fullWidth
                            size="small"
                            accept="application/json"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setFieldValue("metaDataFile", file);

                                const formData = new FormData();
                                formData.append("file", file);

                                const cid = await uploadFiletoIPFS(formData);

                                if (cid?.data?.cid) {
                                    setFieldValue("metadataCid", cid.data.cid);
                                }
                            }}
                        />

                        {errors.metaDataFile && touched.metaDataFile && (
                            <Typography variant="caption" color="error">
                                {errors.metaDataFile}
                            </Typography>
                        )}

                        {values.metadataCid && (
                            <Typography variant="caption" color="green">
                                CID: {values.metadataCid}
                            </Typography>
                        )}
                    </Grid>

                    {/* Submit Button */}
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                        >
                            Next
                        </Button>
                    </Box>
                </Grid>
            </form>
        </FormikProvider>
    );
}
