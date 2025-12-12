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
import { createCredits, mintTokens } from '../../store/apiCall/tokenize';

export default function ExecuteMint({ projectDetails, projectId, handleNext, handleBack, handleCallBack }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    // const [loading, setLoading] = React.useState(true);
    const [selectedVintage, setSelectedVintage] = useState(null)









    const handleMintTokens = async (vintage, tokenId) => {
        setSelectedVintage(vintage)
        dispatch(mintTokens(setSelectedVintage, {
            projectId,
            tokenId,
            vintage
        }, () => {
            handleCallBack()
        }))
    }

    const isCreatedCredit = (vintage) => {
        const findObject = projectDetails?.tokens?.find(item => item.vintage === vintage);
        if (Number(findObject?.totalMinted || 0) > 0) {
            return true
        } else {
            return false
        }
    }

    const isMinted = projectDetails?.tokens?.find(item => Number(item?.totalMinted || 0) > 0);

    if (!isMinted && user?.role !== 'owner') {
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
                <CardHeader title="Execute Mint by Vintage" />
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Vintage</TableCell>
                                    <TableCell>Total Minted</TableCell>
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
                                {projectDetails?.tokens?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row?.vintage}</TableCell>
                                        <TableCell>{row?.totalMinted}</TableCell>
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
                                                        <Typography>Minted.</Typography>
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
                                                                    handleMintTokens(row.vintage, row.tokenId)
                                                                }}
                                                            >
                                                                Execute Mint
                                                            </Button> :
                                                            <Typography>Not yet Minted.</Typography>
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
                {/* <Button
                    variant="contained"
                    onClick={() => {
                        handleNext(false)
                    }}
                    disabled={projectDetails?.tokens?.length === 0}
                // loading={confirming}
                >
                    Next
                </Button> */}
            </Box>
        </div>
    );
}
