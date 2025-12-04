import React from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Box,
    TextField,
    Button,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Stack,
    TableContainer,
} from "@mui/material";
import { Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addnominaltoProject } from "../../store/apiCall/tokenize";

const validationSchema = Yup.object({
    unit: Yup.string().required("Unit is required"),
    vintages: Yup.array()
        .of(
            Yup.object({
                vintage: Yup.number().required("Vintage required"),
                baselineEmissions: Yup.number().required("Baseline Emission Required."),
                projectEmissions: Yup.number().required("Project Emission ERequired."),
                leakage: Yup.number().required("Leakage Emission Required."),
                totalUncertaintyPct: Yup.number().required("Total Uncertainty Required."),
            })
        )
        .min(1, "At least one vintage row is required"),
});

export default function VintageForm({ projectDetails, modules, projectId, handleNext, handleBack }) {
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);


    if (projectDetails?.vintageParameters?.length > 0) {
        return (<Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Vintage Parameters Already Added
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Vintage</TableCell>
                            <TableCell>Baseline Emission</TableCell>
                            <TableCell>Project Emission</TableCell>
                            <TableCell>Leakage Emission</TableCell>
                            <TableCell>Total Uncertainty %</TableCell>
                            <TableCell>Unit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectDetails?.vintageParameters?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {row?.vintage}
                                </TableCell>
                                <TableCell>
                                    {row?.baselineEmissions}
                                </TableCell>
                                <TableCell>
                                    {row?.projectEmissions}
                                </TableCell>
                                <TableCell>
                                    {row?.leakage}
                                </TableCell>
                                <TableCell>
                                    {row?.totalUncertaintyPct}
                                </TableCell>
                                <TableCell>
                                    {row?.unit}
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
            initialValues={{
                unit: "",
                vintages: [
                    {
                        vintage: "",
                        baselineEmissions: "",
                        projectEmissions: "",
                        leakage: "",
                        totalUncertaintyPct: "",
                    },
                ],
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                dispatch(addnominaltoProject(projectId, setLoading, values, () => {
                    handleNext(true);
                }));

            }}
        >
            {({ values, errors, touched, handleChange }) => (
                <Form>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Add Unit
                        </Typography>
                        <TextField
                            fullWidth
                            name="unit"
                            label="Unit"
                            value={values.unit}
                            onChange={handleChange}
                            error={touched.unit && Boolean(errors.unit)}
                            helperText={touched.unit && errors.unit}
                            size="small"
                        />
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Add Vintages</Typography>
                            <FieldArray name="vintages">
                                {({ push, remove }) => (
                                    <Button
                                        variant="contained"
                                        startIcon={<Plus />}
                                        onClick={() =>
                                            push({
                                                vintage: "",
                                                baselineEmissions: "",
                                                projectEmissions: "",
                                                leakage: "",
                                                totalUncertaintyPct: "",
                                            })
                                        }
                                    >
                                        Add Row
                                    </Button>
                                )}
                            </FieldArray>
                        </Stack>

                        <FieldArray name="vintages">
                            {({ push, remove }) => (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Vintage</TableCell>
                                                <TableCell>Baseline Emission</TableCell>
                                                <TableCell>Project Emission</TableCell>
                                                <TableCell>Leakage Emission</TableCell>
                                                <TableCell>Total Uncertainty %</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {values.vintages.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <TextField
                                                            name={`vintages[${index}].vintage`}
                                                            value={row.vintage}
                                                            onChange={handleChange}
                                                            type="number"
                                                            error={
                                                                touched.vintages?.[index]?.vintage &&
                                                                Boolean(errors.vintages?.[index]?.vintage)
                                                            }
                                                            helperText={
                                                                touched.vintages?.[index]?.vintage &&
                                                                errors.vintages?.[index]?.vintage
                                                            }
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            value={row.baselineEmissions}
                                                            onChange={handleChange}
                                                            type="number"
                                                            error={
                                                                touched.vintages?.[index]?.baselineEmissions &&
                                                                Boolean(errors.vintages?.[index]?.baselineEmissions)
                                                            }
                                                            helperText={
                                                                touched.vintages?.[index]?.baselineEmissions &&
                                                                errors.vintages?.[index]?.baselineEmissions
                                                            }
                                                            name={`vintages[${index}].baselineEmissions`}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            name={`vintages[${index}].projectEmissions`}
                                                            value={row.projectEmissions}
                                                            onChange={handleChange}
                                                            type="number"
                                                            error={
                                                                touched.vintages?.[index]?.projectEmissions &&
                                                                Boolean(errors.vintages?.[index]?.projectEmissions)
                                                            }
                                                            helperText={
                                                                touched.vintages?.[index]?.projectEmissions &&
                                                                errors.vintages?.[index]?.projectEmissions
                                                            }
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            name={`vintages[${index}].leakage`}
                                                            value={row.leakage}
                                                            onChange={handleChange}
                                                            type="number"
                                                            error={
                                                                touched.vintages?.[index]?.leakage &&
                                                                Boolean(errors.vintages?.[index]?.leakage)
                                                            }
                                                            helperText={
                                                                touched.vintages?.[index]?.leakage &&
                                                                errors.vintages?.[index]?.leakage
                                                            }
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            name={`vintages[${index}].totalUncertaintyPct`}
                                                            value={row.totalUncertaintyPct}
                                                            onChange={handleChange}
                                                            type="number"
                                                            error={
                                                                touched.vintages?.[index]?.totalUncertaintyPct &&
                                                                Boolean(errors.vintages?.[index]?.totalUncertaintyPct)
                                                            }
                                                            helperText={
                                                                touched.vintages?.[index]?.totalUncertaintyPct &&
                                                                errors.vintages?.[index]?.totalUncertaintyPct
                                                            }
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {values.vintages.length > 1 && <IconButton color="error" onClick={() => remove(index)}>
                                                            <Trash />
                                                        </IconButton>}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </FieldArray>
                    </Paper>

                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button
                            onClick={handleBack}
                            variant="outlined"
                            disabled={loading}
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
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
