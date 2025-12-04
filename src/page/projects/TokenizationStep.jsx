import React, { useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Box,
    Typography,
    Paper,
    IconButton
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProjectDetailsById } from "../../store/apiCall/projects";
import LoadingScreen from "../../components/loading/LoadingScreen";
import RegisterSensorData from "../../components/TokenizationStep/RegisterSensorData";
import RegisterCalibration from "../../components/TokenizationStep/RegisterCalibration";
import RecordTelementryData from "../../components/TokenizationStep/RecordTelementryData";
import MethodologyForm from "../../components/TokenizationStep/LinkMethodologyToProject";
import VintageForm from "../../components/TokenizationStep/AddNominalUncertainity";
import AddEmissionData from "../../components/TokenizationStep/AddEmissionData";
import AddLickageData from "../../components/TokenizationStep/AddLickageData";
import BufferSetting from "../../components/TokenizationStep/BufferSetting";
import IssuanceFinalScreen from "../../components/TokenizationStep/PreviewIssuance";

const steps = [
    "Register Sensor Devices",
    "Register Calibrations",
    "Record Telemetry",
    "Link Project to Methodology",
    "Add Nominal & Uncertainty",
    "Add Emission Report",
    "Record leakage",
    "Buffer Limit Set",
    "Preview Issuance",
    // "Create Credit",
    // "Buffer Limit Set",
    // "Insurance",
    // "Execute Mint",
];

export default function TokenizationStepper() {
    const navigate = useNavigate()
    const { projectId } = useParams();
    const dispatch = useDispatch()
    const [activeStep, setActiveStep] = useState(0);
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const handleReset = () => setActiveStep(0);

    React.useEffect(() => {
        dispatch(getProjectDetailsById(projectId, setLoading, setData))
    }, [projectId])

    const sensors = data?.modules?.flatMap((m) => m.sensors || []) || [];

    const hasCalibration = (sensor) =>
        sensor?.calibration?.certificateUri &&
        sensor.calibration.certificateUri.trim().length > 0;

    const everySensorHavingCalibration = sensors.every(hasCalibration);

    const hasTelemetry = (sensor) =>
        sensor?.latestTelemetry?.dataUri &&
        sensor.latestTelemetry.dataUri.trim().length > 0;

    const everySensorHavingTelemetry = sensors.every(hasTelemetry);

    React.useEffect(() => {
        if (data) {
            if (data?.modules?.filter(m => m.sensors.length === 0).length > 0) {
                setActiveStep(0);
            } else if (everySensorHavingCalibration === false) {
                setActiveStep(1);
            } else if (everySensorHavingTelemetry === false) {
                setActiveStep(2);
            } else if (!data?.onchain?.methodologyIdentifier) {
                setActiveStep(3);
            } else if (data?.vintageParameters?.length === 0) {
                setActiveStep(4);

            } else if (data?.audit?.emissionEvidence?.length === 0) {
                setActiveStep(5);
            }
            else if (data?.audit?.leakage?.length === 0) {
                setActiveStep(6);
            }
            else if (!data?.vintageParameters?.every(v => v.bufferPct)) {
                setActiveStep(7);
            } else {
                setActiveStep(8);
            }

        }
    }, [data]);

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

            <Box pb={0} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate("/app/projects")}><ArrowBack /></IconButton>
                <Typography variant="h5" fontWeight={700}>Tokenization Process — {projectId}</Typography>

            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Content */}
            {
                loading ? <LoadingScreen sx={{ height: 100 }} /> : <Box sx={{ mt: 4 }}>
                    {activeStep === steps.length ? (
                        <Box textAlign="center">
                            <Typography variant="h6">
                                🎉 All steps completed — Tokenization Finished!
                            </Typography>
                            <Button variant="contained" sx={{ mt: 2 }} onClick={handleReset}>
                                Reset
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            {/* <Typography variant="body1" mb={2}>
                                <strong>Current Step:</strong> {steps[activeStep]}
                            </Typography> */}

                            {/* Replace below with your custom UI per step */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    background: "#fafafa",
                                }}
                            >
                                {activeStep === 0 &&
                                    <RegisterSensorData
                                        modules={data ? data.modules : []}
                                        sensors={data ? data.sensors : []}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext()
                                        }}
                                        projectId={projectId}
                                    />}
                                {activeStep === 1 &&
                                    <RegisterCalibration
                                        modules={data ? data.modules : []}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext()
                                        }}
                                        handleBack={handleBack}
                                        projectId={projectId}
                                    />
                                }
                                {activeStep === 2 &&
                                    <RecordTelementryData
                                        modules={data ? data.modules : []}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext()
                                        }}
                                        handleBack={handleBack}
                                        projectId={projectId}
                                    />
                                }
                                {activeStep === 3 &&
                                    <MethodologyForm
                                        modules={data ? data.modules : []}
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext()
                                        }}
                                        handleBack={handleBack}
                                    />
                                }

                                {activeStep === 4 &&
                                    <VintageForm
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext()
                                        }}
                                        handleBack={handleBack}
                                    />
                                }

                                {activeStep === 5 &&
                                    <AddEmissionData
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext()
                                        }}
                                        handleBack={handleBack}
                                    />
                                }
                                {activeStep === 6 &&
                                    <AddLickageData
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext()
                                        }}
                                        handleBack={handleBack}
                                    />
                                }
                                {activeStep === 7 &&
                                    <BufferSetting
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext()
                                        }}
                                        handleBack={handleBack}
                                    />
                                }
                                {activeStep === 8 &&
                                    <IssuanceFinalScreen
                                        projectId={projectId}
                                        handleNext={handleNext}
                                        handleBack={handleBack}
                                    />
                                }
                                {/* Add more steps as needed */}
                            </Paper>

                            {/* Buttons */}
                            {/* <Box mt={3} display="flex" justifyContent="space-between">
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    Back
                                </Button>

                                <Button variant="contained" onClick={handleNext}>
                                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                                </Button>
                            </Box> */}
                        </Box>
                    )}
                </Box>
            }
        </Paper>
    );
}
