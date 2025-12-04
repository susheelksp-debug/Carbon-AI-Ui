import React from 'react';
import BasicDialog from './BasicDialog';
import { Typography, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

function SessionExpireModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tokenExpireModal } = useSelector((state) => state.auth);
    const handleLogout = () => {
        dispatch({ type: 'RESET_APP' });
        navigate('/login');
        // handleClose();
    };
    return (
        <BasicDialog
            open={tokenExpireModal}
            content={<Box p={2}>
                <Typography sx={{ color: "#000000" }} variant="subtitle2">
                    Session timeout. Please log in again.
                </Typography>
                <Box mt={2} sx={{ display: "flex", justifyContent: "right" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            handleLogout();
                        }}
                    >
                        Relogin
                    </Button>
                </Box>
            </Box>}
        />
    )
}

export default SessionExpireModal