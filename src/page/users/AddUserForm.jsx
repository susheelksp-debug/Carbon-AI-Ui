import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Grid,
    TextField,
    Button,
    Autocomplete,
    FormHelperText,
    Typography,
} from "@mui/material";

const ROLE_OPTIONS = [
    { label: "owner", value: "owner" },
    { label: "admin", value: "admin" },
    { label: "verifier", value: "verifier" },
    { label: "insurer", value: "insurer" }
];

export default function AddUserForm({ onSubmit, loading }) {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            role: null,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Enter a valid email")
                .required("Email is required"),
            password: Yup.string()
                .required("Password is required")
                .min(8, "Minimum 8 characters")
                .matches(/[A-Z]/, "Must contain uppercase letter")
                .matches(/[a-z]/, "Must contain lowercase letter")
                .matches(/[0-9]/, "Must contain a number"),
            role: Yup.object({}).nonNullable("Role is required").required("Role is required"),
        }),
        onSubmit: (values) => {
            let payload = {
                email: values.email,
                password: values.password,
                role: values.role.value,
            };
            onSubmit(payload);
        },
    });

    return (

        <Box py={2}>
            <form onSubmit={formik.handleSubmit}>

                <Grid container spacing={3}>

                    {/* Email */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            name="email"
                            label="Email"
                            size="small"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>

                    {/* Password */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            name="password"
                            size="small"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                    </Grid>

                    {/* Role Autocomplete */}
                    <Grid size={{ xs: 12 }}>
                        <Autocomplete
                            options={ROLE_OPTIONS}
                            value={formik.values.role}
                            size="small"
                            getOptionLabel={(opton) => opton.label}
                            disableClearable
                            onChange={(e, value) => formik.setFieldValue("role", value)}
                            onBlur={() => formik.setFieldTouched("role", true)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Role"
                                    error={formik.touched.role && Boolean(formik.errors.role)}
                                />
                            )}
                        />
                        {formik.touched.role && formik.errors.role && (
                            <FormHelperText error>{formik.errors.role}</FormHelperText>
                        )}
                    </Grid>

                    {/* Buttons */}
                    <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>

                        <Button variant="contained" loading={loading} disabled={loading} type="submit">
                            Submit
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Box>
    );
}
