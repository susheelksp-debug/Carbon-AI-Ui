import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { createCredits, getIssuanceDataByProjectId, confirmCarbonIssuance } from '../../store/apiCall/tokenize';
import { set } from "react-hook-form";
import formatDate from "../../utils/date-format";

export default function CreateCredits({ projectDetails, projectId, handleNext, handleBack, handleCallBack }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(true);
    const [selectedVintage, setSelectedVintage] = useState(null)









    const handleCreateCredits = async (vintage) => {
        setSelectedVintage(vintage)
        dispatch(createCredits(setSelectedVintage, {
            projectId,
            vintage
        }, () => {
            handleCallBack()
        }))
    }

    const isCreatedCredit = (vintage) => {
        const findObject = projectDetails?.tokens?.find(item => item.vintage === vintage);
        if (findObject) {
            return true
        } else {
            return false
        }
    }

    if (!projectDetails?.tokens?.length > 0 && user?.role !== 'owner') {
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



            <Card sx={{ mt: 3 }}>
                <CardHeader title="Create credits by Vintage" />
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Vintage</TableCell>
                                    {/* <TableCell>Net Credits</TableCell>
                                    <TableCell>Issued Amount</TableCell>
                                    <TableCell>Buffer Amount</TableCell>
                                    <TableCell>Buffer %</TableCell> */}
                                    {/* <TableCell>Unit</TableCell>
                                    <TableCell>Within Limit</TableCell> */}
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projectDetails?.vintageParameters?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row?.vintage}</TableCell>
                                        {/* <TableCell>{row?.netCredits}</TableCell>
                                        <TableCell>{row?.issuedAmount}</TableCell>
                                        <TableCell>{row?.bufferAmount}</TableCell>
                                        {/* <TableCell>{row?.parameters.bufferPct}%</TableCell>
                                        <TableCell>{row?.unit}</TableCell> */}
                                        {/* <TableCell>{row?.withinLimit ? "Yes" : "No"}</TableCell>  */}
                                        <TableCell>
                                            <Box>
                                                {
                                                    isCreatedCredit(row.vintage)
                                                        ?
                                                        <Typography>credits are created.</Typography>
                                                        :
                                                        user.role === "owner"
                                                            ?
                                                            <Button
                                                                loading={row.vintage === selectedVintage}
                                                                disabled={selectedVintage !== null}
                                                                sx={{ width: "150px" }}
                                                                size="medium"
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => {
                                                                    handleCreateCredits(row.vintage)
                                                                }}
                                                            >
                                                                Create Credits
                                                            </Button> :
                                                            <Typography>Not yet Created.</Typography>
                                                }
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>


            </Card>

            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                    onClick={handleBack}
                    variant="outlined"
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleNext(false)
                    }}
                    disabled={projectDetails?.tokens?.length === 0}
                // loading={confirming}
                >
                    Next
                </Button>
            </Box>
        </div>
    );
}
