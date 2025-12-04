import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Box, CircularProgress } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ title, open, onClose, url }) {
    const [loading, setLoading] = React.useState(true);

    const handleIframeLoad = () => {
        setLoading(false);
    };

    return (
        <React.Fragment>

            <Dialog
                fullScreen
                open={open}
                slots={{
                    transition: Transition,
                }}
            >
                <AppBar sx={(theme) => {
                    return { position: 'relative', background: theme.palette.primary.main }
                }}>
                    <Toolbar>

                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {title}
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {loading && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            bgcolor: "rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 999,
                        }}
                    >
                        <CircularProgress size={60} thickness={4} />
                    </Box>
                )}
                <Box
                    component="iframe"
                    src={url}
                    onLoad={handleIframeLoad}
                    sx={{
                        width: "100vw",
                        height: "100vh",
                        border: "none",
                    }}
                />
            </Dialog>
        </React.Fragment>
    );
}
