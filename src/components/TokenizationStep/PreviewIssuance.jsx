import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
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
    Button
} from "@mui/material";
import LoadingScreen from "../loading/LoadingScreen";
import { getIssuanceDataByProjectId } from "../../store/apiCall/tokenize";

export default function IssuanceFinalScreen({ projectId, handleNext, handleBack }) {
    const dispatch = useDispatch();
    const [issuanceData, setIssuanceData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        dispatch(getIssuanceDataByProjectId(projectId, setLoading, setIssuanceData));
    }, []);

    if (loading) return <LoadingScreen sx={{ height: 100 }} />;

    const config = issuanceData.methodologyConfig || {};

    return (
        <div>
            {/* SUMMARY CARDS */}
            <Card sx={{ width: '100%' }}>
                <CardHeader title="Project Issuance Summary" />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardHeader title="Project ID" />
                                <CardContent>{issuanceData.projectId}</CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardHeader title="Methodology" />
                                <CardContent>{issuanceData.methodologyIdentifier}</CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardHeader title="Quality Tier" />
                                <CardContent>{config.qualityTier}</CardContent>
                            </Card>
                        </Grid>

                        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ width: '100%' }}>
                                <CardHeader title="Available Previews" />
                                <CardContent>{issuanceData.previews.length}</CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* CONFIG CARDS */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
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
            </Grid>

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
                                {issuanceData.previews.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.vintage}</TableCell>
                                        <TableCell>{row.netCredits}</TableCell>
                                        <TableCell>{row.issuedAmount}</TableCell>
                                        <TableCell>{row.bufferAmount}</TableCell>
                                        <TableCell>{row.parameters.bufferPct}%</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.withinLimit ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>

                <CardActions>
                    <Button onClick={handleBack}>Back</Button>
                    <Button variant="contained" onClick={handleNext}>Next</Button>
                </CardActions>
            </Card>
        </div>
    );
}
