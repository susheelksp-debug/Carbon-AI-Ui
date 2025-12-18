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



export default function ProjectDetails({ data, handleNext }) {
    const { projectId } = useParams();
    const dispatch = useDispatch()


    const [openModal, setOpenModal] = React.useState(false)
    const [url, setUrl] = useState("")
    const [modalTitle, setModalTitle] = useState("")



    return (
        <Box>
            <Box pb={0} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Project Details</Typography>

            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>

            </Typography>




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
            <Box textAlign={"end"}>
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleNext}>
                    Next
                </Button>
            </Box>



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
