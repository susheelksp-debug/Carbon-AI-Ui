import React, { useState, useRef } from "react";
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
import AssignAuditor from "../../components/TokenizationStep/AssignAuditor";
import SubmitAuditorDecision from "../../components/TokenizationStep/SubmitAuditorDecision";
import CheckIcon from "@mui/icons-material/Check";
import CreateCredits from "../../components/TokenizationStep/CreateCredits";
import ExecuteMint from "../../components/TokenizationStep/ExecuteMint";

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
    "Assign Auditor",
    "Submit Audit Report",
    "Create Credit",
    "Execute Mint"
];

export default function TokenizationStepper() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const stepContainerRef = useRef(null);
    const stepRefs = useRef([]); // array of refs for steps

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const handleReset = () => setActiveStep(0);

    React.useEffect(() => {
        dispatch(getProjectDetailsById(projectId, setLoading, setData));
    }, [projectId]);

    const sensors = data?.modules?.flatMap((m) => m.sensors || []) || [];

    const hasCalibration = (sensor) =>
        sensor?.calibration?.certificateUri &&
        sensor.calibration.certificateUri.trim().length > 0;

    const everySensorHavingCalibration = sensors.length > 0 && sensors.every(hasCalibration);

    const hasTelemetry = (sensor) =>
        sensor?.latestTelemetry?.dataUri && sensor.latestTelemetry.dataUri.trim().length > 0;

    const everySensorHavingTelemetry = sensors.length > 0 && sensors.every(hasTelemetry);

    const getCompletedSteps = () => {
        if (!data) return [];

        const completed = [];

        if (data.modules?.every((m) => m.sensors.length > 0)) completed.push(0);
        if (everySensorHavingCalibration) completed.push(1);
        if (everySensorHavingTelemetry) completed.push(2);
        if (data.onchain?.methodologyIdentifier) completed.push(3);
        if (data.vintageParameters?.length > 0) completed.push(4);
        if (data.audit?.emissionEvidence?.length > 0) completed.push(5);
        if (data.audit?.leakage?.length > 0) completed.push(6);
        if (data?.vintageParameters?.length > 0 && data?.vintageParameters?.every((v) => v.bufferPct > 0))
            completed.push(7);
        if (data.methodologySelections?.length > 0) completed.push(8);
        if (data?.audit?.auditors?.length > 0) completed.push(9);
        if (data?.audit?.audits?.length > 0) completed.push(10);

        return completed;
    };

    const completedSteps = getCompletedSteps();

    React.useEffect(() => {
        if (data) {
            if (data?.modules?.filter((m) => m.sensors.length === 0).length > 0) {
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
            } else if (data?.audit?.leakage?.length === 0) {
                setActiveStep(6);
            } else if (!data?.vintageParameters?.every((v) => v.bufferPct)) {
                setActiveStep(7);
            } else if (!data?.methodologySelections?.length > 0) {
                setActiveStep(8);
            } else if (!data?.audit?.auditors?.length > 0) {
                setActiveStep(9);
            } else if (!data?.audit?.audits?.length > 0) {
                setActiveStep(10);
            } else if (!data?.tokens?.length > 0) {
                setActiveStep(11)
            } else {
                setActiveStep(12)
            }
        }
    }, [data]);

    // === SCROLL INTO VIEW EFFECT ===
    React.useEffect(() => {
        // When activeStep changes, center that step in the container if possible.
        const container = stepContainerRef.current;
        const el = stepRefs.current[activeStep];

        if (!container || !el) return;

        // compute scroll position to center the element
        const elLeft = el.offsetLeft;
        const elWidth = el.offsetWidth;
        const containerWidth = container.clientWidth;
        const scrollTo = elLeft - containerWidth / 2 + elWidth / 2;

        // clamp scrollTo to container bounds
        const maxScroll = container.scrollWidth - containerWidth;
        const safeScroll = Math.max(0, Math.min(scrollTo, maxScroll));

        container.scrollTo({ left: safeScroll, behavior: "smooth" });
    }, [activeStep, data]); // depend on data too because stepRefs are created after data loads

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box pb={0} sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                    {data?.projectName}
                </Typography>
            </Box>

            {/* Stepper */}
            <Box
                ref={stepContainerRef}
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    background: "#D7EFEA",
                    p: 3,
                    borderRadius: 3,
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    // optional: nicer snapping behavior on supported browsers
                    scrollSnapType: "x mandatory"
                }}
            >
                {steps.map((label, index) => {
                    const isCompleted = completedSteps.includes(index);
                    const isActive = index === activeStep;

                    return (
                        <Box
                            key={index}
                            ref={(el) => {
                                stepRefs.current[index] = el;
                            }}
                            onClick={() => isCompleted && setActiveStep(index)}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                mx: 1,
                                cursor: isCompleted ? "pointer" : "default",
                                scrollSnapAlign: "center",
                                flex: "0 0 auto"
                            }}
                        >
                            {/* Circle with number / check */}
                            <Box
                                sx={(theme) => ({
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: isActive ? theme.palette.primary.main : isCompleted ? theme.palette.primary.light : "#fff",
                                    border: "2px solid",
                                    borderColor: isActive ? theme.palette.primary.main : isCompleted ? "primary.main" : "#aaa",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: isActive ? "#fff" : "primary.dark",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    // m:1
                                })}
                            >
                                {isCompleted ? (
                                    <>
                                        {index + 1} <CheckIcon fontSize="small" sx={{ ml: 0.5 }} />
                                    </>
                                ) : (
                                    index + 1
                                )}
                            </Box>

                            {/* Label Box */}
                            <Box
                                sx={(theme) => ({
                                    mt: 1,
                                    px: 1.5,
                                    py: 0.7,
                                    background: isActive ? theme.palette.primary.main : theme.palette.primary.light,
                                    color: isActive ? "#fff" : "black",
                                    borderRadius: 2,
                                    minWidth: 150,
                                    height: 50,
                                    textAlign: "center",
                                    boxShadow: isActive ? 3 : 1,
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    border: "1px solid #ccc",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                })}
                            >
                                {label}
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Step Content */}
            {loading ? (
                <LoadingScreen sx={{ height: 100 }} />
            ) : (
                <Box sx={{ mt: 4 }}>
                    {activeStep === steps.length ? (
                        <Box textAlign="center">
                            <Typography variant="h6">🎉 All steps completed — Tokenization Finished!</Typography>
                            <Button variant="contained" sx={{ mt: 2 }} onClick={handleReset}>
                                Reset
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="body1" mb={2}>
                                <strong>Current Step:</strong> {steps[activeStep]}
                            </Typography>

                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, background: "#fafafa" }}>
                                {activeStep === 0 && (
                                    <RegisterSensorData
                                        modules={data ? data.modules : []}
                                        sensors={data ? data.sensors : []}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        projectId={projectId}
                                    />
                                )}
                                {activeStep === 1 && (
                                    <RegisterCalibration
                                        modules={data ? data.modules : []}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                        projectId={projectId}
                                    />
                                )}
                                {activeStep === 2 && (
                                    <RecordTelementryData
                                        modules={data ? data.modules : []}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                        projectId={projectId}
                                    />
                                )}
                                {activeStep === 3 && (
                                    <MethodologyForm
                                        modules={data ? data.modules : []}
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                    />
                                )}

                                {activeStep === 4 && (
                                    <VintageForm
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                    />
                                )}

                                {activeStep === 5 && (
                                    <AddEmissionData
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                    />
                                )}
                                {activeStep === 6 && (
                                    <AddLickageData
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                    />
                                )}
                                {activeStep === 7 && (
                                    <BufferSetting
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                    />
                                )}
                                {activeStep === 8 && (
                                    <IssuanceFinalScreen
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                    />
                                )}
                                {activeStep === 9 && (
                                    <AssignAuditor
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                    />
                                )}
                                {activeStep === 10 && (
                                    <SubmitAuditorDecision
                                        projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                    />
                                )}

                                {
                                    activeStep === 11 && (
                                        <CreateCredits
                                            projectDetails={data}
                                            projectId={projectId}
                                            handleNext={(formSubmit = false) => {
                                                if (formSubmit === true) {
                                                    dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                                }
                                                handleNext();
                                            }}
                                            handleBack={handleBack}
                                            handleCallBack={() => dispatch(getProjectDetailsById(projectId, setLoading, setData, false))}
                                        />
                                    )
                                }

                                {
                                    activeStep === 12 && <ExecuteMint projectDetails={data}
                                        projectId={projectId}
                                        handleNext={(formSubmit = false) => {
                                            if (formSubmit === true) {
                                                dispatch(getProjectDetailsById(projectId, setLoading, setData, false));
                                            }
                                            handleNext();
                                        }}
                                        handleBack={handleBack}
                                        handleCallBack={() => dispatch(getProjectDetailsById(projectId, setLoading, setData, false))}
                                    />
                                }
                            </Paper>
                        </Box>
                    )}
                </Box>
            )}
        </Paper>
    );
}
