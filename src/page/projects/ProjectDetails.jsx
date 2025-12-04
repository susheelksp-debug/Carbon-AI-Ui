import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Link,
    Stack,
    Button,
    Divider,
    IconButton,
    TableContainer
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FileJson, DatabaseZap } from "lucide-react";
import { useDispatch } from "react-redux";
import { getProjectDetailsById } from "../../store/apiCall/projects";
import LoadingScreen from "../../components/loading/LoadingScreen";
import FullScreenDialog from "../../components/modal/FullPageIframeModal";
import formatDate from "../../utils/date-format";



export default function ProjectDetails() {
    const navigate = useNavigate()
    const { projectId } = useParams();
    const dispatch = useDispatch()
    const [tab, setTab] = React.useState(0);
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false)
    const [url, setUrl] = useState("")
    const [modalTitle, setModalTitle] = useState("")

    React.useEffect(() => {
        dispatch(getProjectDetailsById(projectId, setLoading, setData))
    }, [projectId])

    return (
        <Box>
            <Box pb={0} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate("/app/projects")}><ArrowBack /></IconButton>
                <Typography variant="h6" fontWeight={700}>Project Details — {projectId}</Typography>

            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>

            </Typography>

            {
                loading ? <LoadingScreen sx={{ height: 100 }} /> : <>
                    <Tabs value={tab} aria-label="wrapped label tabs example" onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
                        <Tab label="Overview" />
                        <Tab label="Modules" />
                        <Tab label="Sensors" />
                        <Tab label="Audits" />
                        <Tab label="Vintage Params" />
                        <Tab label="Tokens" />
                    </Tabs>

                    {/* OVERVIEW TAB */}
                    {tab === 0 && (
                        <Paper sx={{ p: 2 }}>
                            <Typography><strong>Project Name:</strong> {data?.projectName}</Typography>
                            <Typography><strong>Owner:</strong> {data?.owner}</Typography>
                            <Typography><strong>Metadata Hash:</strong> {data?.onchain?.metadataHash}</Typography>
                            <Typography><strong>Methodology:</strong> {data?.onchain?.methodologyIdentifier}</Typography>
                            <Typography display={"flex"} alignItems={"center"}><strong>Project Transaction:</strong> <Link
                                onClick={() => {
                                    // setUrl(`https://sepolia.etherscan.io/tx/${data?.projectTxHash}`);
                                    // setModalTitle("Sensor Information")
                                    // setOpenModal(true)
                                    window.open(`https://sepolia.etherscan.io/tx/${data?.projectTxHash}`, "_blank")
                                }}
                                sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}
                            >
                                <OpenInNewIcon size={12} />
                            </Link> </Typography>
                        </Paper>
                    )}

                    {/* MODULES TAB */}
                    {tab === 1 && (
                        <Paper sx={{ p: 2 }}>
                            {data?.modules?.map((m) => (
                                <Accordion key={m.moduleIndex} sx={{ mt: 2 }}>
                                    <AccordionSummary>Module {m.moduleIndex + 1}</AccordionSummary>
                                    <AccordionDetails>
                                        <Typography><strong>CID:</strong> {m.cid}</Typography>
                                        <Typography><strong>Data Hash:</strong> {m.dataHash}</Typography>
                                        <Typography display={"flex"} alignItems={"center"}><strong>Data URI:</strong> <Link
                                            onClick={() => {
                                                setUrl(m.dataUri);
                                                setModalTitle("Sensor Information")
                                                setOpenModal(true)
                                            }}
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}
                                        >
                                            <OpenInNewIcon size={12} />
                                        </Link> </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}

                            {data?.modules?.length === 0 && (
                                <Typography variant="body1">No Data Found.</Typography>
                            )}
                        </Paper>
                    )}

                    {/* SENSORS TAB */}
                    {tab === 2 && (
                        <Paper sx={{ p: 2 }}>
                            {data?.modules[0]?.sensors?.map((s) => (
                                <Accordion key={s.sensorId} sx={{ mt: 2 }}>
                                    <AccordionSummary>{s.sensorId}</AccordionSummary>
                                    <AccordionDetails>
                                        <Typography><strong>Metadata CID:</strong> {s.metadataCid}</Typography>
                                        <Typography><strong>Latest Telemetry CID:</strong> {s.latestTelemetry.cid}</Typography>
                                        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                                            <Link
                                                onClick={() => {
                                                    setUrl(s.metadataUri);
                                                    setModalTitle("Metadata")
                                                    setOpenModal(true)
                                                }}

                                                underline="hover"
                                                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                            >
                                                <FileJson size={16} /> Metadata
                                            </Link>
                                            {s.latestTelemetry && s.latestTelemetry.dataUri && (
                                                <Link
                                                    onClick={() => {
                                                        setUrl(s.latestTelemetry.dataUri);
                                                        setModalTitle("Telemetry")
                                                        setOpenModal(true)
                                                    }}
                                                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                                >
                                                    <DatabaseZap size={16} /> Telemetry
                                                </Link>
                                            )}
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        <Typography variant="subtitle2" sx={{ mt: 1 }}>Calibration</Typography>
                                        <Typography><strong>CID:</strong> {s.calibration.cid}</Typography>
                                        <Link
                                            onClick={() => {
                                                setUrl(s.calibration.certificateUri);
                                                setModalTitle("Certificate")
                                                setOpenModal(true)
                                            }}
                                            underline="hover"
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <FileJson size={16} /> Certificate
                                        </Link>
                                    </AccordionDetails>
                                </Accordion>
                            ))}

                            {data?.modules[0]?.sensors?.length === 0 && (
                                <Typography variant="body1">No Data Found.</Typography>
                            )}
                        </Paper>
                    )}

                    {/* AUDITS TAB */}
                    {tab === 3 && (
                        <Paper sx={{ p: 2 }}>
                            {data?.modules?.[0]?.audits?.map((a, idx) => (
                                <Paper key={idx} sx={{ p: 2, mb: 1 }}>
                                    <Typography><strong>Vintage:</strong> {a.vintage}</Typography>
                                    <Typography><strong>Submitted:</strong> {a.submitted ? "Yes" : "No"}</Typography>
                                    <Typography><strong>Approved:</strong> {a.approved ? "Yes" : "No"}</Typography>
                                    <Typography><strong>Auditor:</strong> {a.auditor}</Typography>
                                </Paper>
                            ))}
                            {data?.modules?.[0]?.audits?.length === 0 && (
                                <Typography variant="body1">No Data Found.</Typography>
                            )}
                        </Paper>
                    )}

                    {/* VINTAGE PARAMS TAB */}
                    {tab === 4 && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Vintage</TableCell>
                                        <TableCell>Nominal ER</TableCell>
                                        <TableCell>Uncertainty (%)</TableCell>
                                        <TableCell>Buffer (%)</TableCell>
                                        <TableCell>Updated At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.vintageParameters?.map((v) => (
                                        <TableRow key={v.vintage}>
                                            <TableCell>{v.vintage}</TableCell>
                                            <TableCell>{v.nominalEr}</TableCell>
                                            <TableCell>{v.totalUncertaintyPct}</TableCell>
                                            <TableCell>{v.bufferPct}</TableCell>
                                            <TableCell>{v?.updatedAt ? formatDate(v.updatedAt, "MM-DD-YYYY HH:mm A") : ""}</TableCell>
                                        </TableRow>
                                    ))}
                                    {data?.vintageParameters?.length === 0 && (
                                        <TableRow>
                                            <TableCell align="center" colSpan={12}>
                                                No data found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* TOKENS TAB */}
                    {tab === 5 && (
                        <Paper sx={{ p: 2 }}>
                            {data?.tokens?.map((t) => (
                                <Paper key={t.tokenId} sx={{ p: 2, mb: 1 }}>
                                    <Typography><strong>Token ID:</strong> {t.tokenId}</Typography>
                                    <Typography><strong>Vintage:</strong> {t.vintage}</Typography>
                                    <Typography><strong>Total Issued:</strong> {t.totalIssued}</Typography>
                                    <Typography><strong>Total Minted:</strong> {t.totalMinted}</Typography>
                                </Paper>
                            ))}
                            {data?.tokens?.length === 0 && (
                                <Typography variant="body1">No Data Found.</Typography>
                            )}
                        </Paper>
                    )}
                </>
            }
            {openModal && <FullScreenDialog
                open={openModal}
                onClose={() => {
                    setOpenModal(false)
                    setUrl("");
                    setModalTitle("")
                }}
                url={url}
                title={modalTitle}
            />}
        </Box>
    );
}
