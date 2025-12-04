import React, { useEffect, useState } from "react";
import {
    Typography,
    Card,
    CardContent,
    Box,
    Divider,
    Grid,
    Button,
    Tooltip,
    IconButton
} from "@mui/material";
import { Leaf, Plus, Eye, Pencil, Key, Hash, Zap } from "lucide-react";
import { useDispatch } from "react-redux";
import { creatProject, getAllProject } from "../../store/apiCall/projects";
import formatDate from "../../utils/date-format";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/loading/LoadingScreen";
import BasicDialog from "../../components/modal/BasicDialog";
import CreateProject from "./CreateProject";
import Page from "../../components/helmet/Page";




export function ProjectCard({ project, viewProjectDetails, tokenizeProject }) {
    return (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                    <Leaf size={22} />
                    <Typography variant="h6" fontWeight={700}>
                        {project.projectName}
                    </Typography>
                </Box>





                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                    Owner: <Tooltip arrow title={project.owner}>{project.owner.slice(0, 17)}...</Tooltip>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Created At: {project?.createdAt ? formatDate(project.createdAt, "MM-DD-YYYY HH:mm A") : ""}
                </Typography>
                <Box textAlign={"end"}>

                    <Tooltip arrow title="Complete Project Tokenization Details">
                        <IconButton color="primary" onClick={() => { tokenizeProject(project.projectId) }}>
                            <Zap />

                        </IconButton>

                    </Tooltip>
                    {/* <span>Tokenize</span> */}
                    <Tooltip arrow title="View Project Details">
                        <IconButton color="primary" onClick={() => { viewProjectDetails(project.projectId) }}>
                            <Eye />
                        </IconButton>
                    </Tooltip>
                    {/* <Tooltip arrow title="Edit Project Details">
                        <IconButton color="secondary">
                            <Pencil />
                        </IconButton>
                    </Tooltip> */}


                </Box>



            </CardContent>
        </Card>
    );
}

// ------------------------------
// App (root)
// ------------------------------
export default function Projects() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([])
    const [openModal, setOpenModal] = React.useState(false);
    const [projectLoading, setProjectLoading] = React.useState(false);


    useEffect(() => {
        dispatch(getAllProject(setLoading, setProjects))
    }, [])

    const viewProjectDetails = (projectId) => {
        navigate(`/app/project-details/${projectId}`);
    }

    const tokenizeProject = (projectId) => {
        navigate(`/app/tokenize/${projectId}`);
    }

    const handleUpload = (values) => {
        dispatch(creatProject(setProjectLoading, values, () => {
            setOpenModal(false);
            dispatch(getAllProject(setLoading, setProjects))
        }))
    }

    return (
        <Page title={"Projects"}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Box display={'flex'} mb={1} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'} gap={2} >
                        <Typography variant="h4" fontWeight={800} >
                            Projects
                        </Typography>
                        <Button
                            onClick={() => {
                                setOpenModal(true);
                            }}
                            size="medium"
                            variant="contained"
                            startIcon={<Plus />}
                        >
                            Add Project
                        </Button>
                    </Box>
                </Grid>
                {loading ? <LoadingScreen sx={{ height: 100 }} /> : projects.length > 0 ? projects.map((p) => (
                    <Grid size={{ xs: 12, md: 4 }}>
                        <ProjectCard key={p.projectId} project={p} tokenizeProject={tokenizeProject} viewProjectDetails={viewProjectDetails} />
                    </Grid>
                )) : <Grid size={{ xs: 12 }}>
                    <Typography>No Data Found.</Typography>
                </Grid>}

                <BasicDialog
                    title={"Add Project"}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    content={<CreateProject loading={projectLoading} handleSubmit={handleUpload} />}
                    closeIcon={true}
                    maxWidth={"md"}
                />
            </Grid>
        </Page>
    );
}
