import React, { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Button,
    Box,
    TextField,
    Autocomplete,
    FormControlLabel,
    Checkbox,
    FormGroup

} from "@mui/material";
import LoadingScreen from "../loading/LoadingScreen";
import { getMethodologies } from '../../store/apiCall/projects';
import { linkMethodologyToProject, getIssuanceDataByProjectId, confirmCarbonIssuance } from '../../store/apiCall/tokenize';
import { set } from "react-hook-form";
import formatDate from "../../utils/date-format";

export default function IssuanceFinalScreen({ projectDetails, projectId, handleNext, handleBack }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [issuanceData, setIssuanceData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [methodologies, setMethodologies] = React.useState([]);
    const [methodologyLoading, setMethodologyLoading] = React.useState(false);
    const [selectedMethodology, setSelectedMethodology] = React.useState(projectDetails?.onchain?.methodologyIdentifier || "");
    const [finalized, setFinalized] = React.useState(false);
    const [confirming, setConfirming] = React.useState(false);

    useEffect(() => {
        dispatch(getIssuanceDataByProjectId(projectId, setLoading, setIssuanceData));
        dispatch(getMethodologies(setMethodologyLoading, setMethodologies));
    }, []);

    useEffect(() => {
        if (projectDetails?.onchain?.methodologyIdentifier) {
            setSelectedMethodology(projectDetails?.onchain?.methodologyIdentifier);
            setFinalized(projectDetails?.methodologySelections?.length > 0);
        }
    }, [projectDetails]);

    if (loading) return <LoadingScreen sx={{ height: 100 }} />;

    const config = issuanceData?.methodologyConfig || {};

    const handleNextClick = () => {
        if (projectDetails?.methodologySelections?.length > 0) {
            handleNext();
            console.log("methodology already selected");
        } else {
            console.log("methodology not selected");
            const payload = {
                methodologyIdentifier: selectedMethodology,
                projectId: projectId,
                "confirm": true
            };
            dispatch(confirmCarbonIssuance(setConfirming, payload, () => {
                handleNext(true);
            }));
        }
    }

    if (!projectDetails?.methodologySelections?.length > 0 && user?.role !== 'owner') {
            return (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        The user is yet to Confirm the methodology for Issuance.
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
        <div>
            {/* SUMMARY CARDS */}
            {!projectDetails?.methodologySelections?.length > 0 && <Autocomplete
                name="methodologyIdentifier"
                size='small'

                component={Autocomplete}
                value={selectedMethodology}
                options={methodologies.map((methodology) => methodology.methodologyIdentifier)}
                disableClearable={true}
                loading={methodologyLoading}
                disabled={confirming}
                onChange={(event, value) => {
                    setSelectedMethodology(value || '')
                    const payload = {
                        methodologyIdentifier: value
                    };
                    dispatch(linkMethodologyToProject(projectId, setLoading, payload, () => {
                        dispatch(getIssuanceDataByProjectId(projectId, setLoading, setIssuanceData));
                    }));
                }}
                renderInput={(params) => (
                    <TextField

                        {...params}
                        label="Select Different Methodology"
                        sx={{ mb: 2, minWidth: 300 }}
                        fullWidth={false}
                    />
                )}
            />}
            <Card sx={{ width: '100%' }}>
                <CardHeader title="Project Issuance Summary" />
                <CardContent>
                    <Grid container spacing={3}>

                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardHeader title="Project ID" />
                                <CardContent>{issuanceData?.projectId}</CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardHeader title="Methodology" />
                                <CardContent>{issuanceData?.methodologyIdentifier}</CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardHeader title="Quality Tier" />
                                <CardContent>{config?.qualityTier}</CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardHeader title="Available Previews" />
                                <CardContent>{issuanceData?.previews?.length}</CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* CONFIG CARDS */}
            {/* <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ width: '100%' }}>
                        <CardHeader title="Uses Discount" />
                        <CardContent>{String(config.usesDiscount)}</CardContent>
                    </Card>
                </Grid>

                <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ width: '100%' }}>
                        <CardHeader title="Uses Leakage" />
                        <CardContent>{String(config.usesLeakage)}</CardContent>
                    </Card>
                </Grid>

                <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ width: '100%' }}>
                        <CardHeader title="Uses Project Emissions" />
                        <CardContent>{String(config.usesProjectEmissions)}</CardContent>
                    </Card>
                </Grid>

                <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ width: '100%' }}>
                        <CardHeader title="Total Uncertainty %" />
                        <CardContent>{config.totalUncertaintyPct || 0}</CardContent>
                    </Card>
                </Grid>
            </Grid> */}

            {/* PREVIEW TABLE */}
            <Card sx={{ mt: 3 }}>
                <CardHeader title="Issuance Preview by Vintage" />
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Vintage</TableCell>
                                    <TableCell>Net Credits</TableCell>
                                    <TableCell>Issued Amount</TableCell>
                                    <TableCell>Buffer Amount</TableCell>
                                    <TableCell>Buffer %</TableCell>
                                    <TableCell>Unit</TableCell>
                                    <TableCell>Within Limit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {issuanceData?.previews.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row?.vintage}</TableCell>
                                        <TableCell>{row?.netCredits}</TableCell>
                                        <TableCell>{row?.issuedAmount}</TableCell>
                                        <TableCell>{row?.bufferAmount}</TableCell>
                                        <TableCell>{row?.parameters.bufferPct}%</TableCell>
                                        <TableCell>{row?.unit}</TableCell>
                                        <TableCell>{row?.withinLimit ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>


            </Card>
            <Card sx={{ mt: 3, p: 2 }}>
                {!projectDetails?.methodologySelections?.length > 0 ? <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={finalized}
                                onChange={(e) => setFinalized(e.target.checked)}
                            />
                        }
                        label={`Proceed to Issuance with ${selectedMethodology} Methodology`}
                    />
                </FormGroup> : <>
                    <Typography><b>Methodology Confirmed At:</b> {projectDetails?.methodologySelections?.[0]?.confirmedAt ? formatDate(projectDetails?.methodologySelections?.[0]?.confirmedAt, "MM-DD-YYYY HH:mm A") : ""}</Typography>
                </>}
            </Card>
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                    onClick={handleBack}
                    variant="outlined"
                    disabled={confirming}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleNextClick()
                    }}
                    disabled={!finalized || confirming}
                    loading={confirming}
                >
                    Next
                </Button>
            </Box>
        </div>
    );
}
