// @mui
import PropTypes from "prop-types";
import { Box, Button, Stack, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Card } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// ----------------------------------------------------------------------

export default function AlertDialog({
    title,
    subTitle,
    titleColor,
    content,
    action,
    open,
    onClose,
    containsBtn,
    onConfirm,
    handleSelectNo,
    closeIcon,
    loading,
    close,
    submit,
    containerStyle,
    noBtn,
    yesBtn,
    maxWidth,
    titleSize,
    ...other
}) {
    return (
        <Dialog fullWidth maxWidth={maxWidth ? maxWidth : 'xs'} open={open} {...other} sx={{ borderRadius: '8px' }}>
            <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                px={2}
                pt={2}
            >
                {title && (
                    <Box >
                        <DialogTitle sx={{ p: 0 }} >
                            <Typography gutterBottom variant={"subtitle1"} color={titleColor}>{title}</Typography>
                        </DialogTitle>
                        {subTitle && (
                            <Typography sx={{ textAlign: 'justify' }} lineHeight={"20px"} fontSize={titleSize ? "13px" : "auto"} variant={titleSize ? "body1" : "body2"} color="text.secondary">
                                {subTitle.split('\n').map((line, index) => (
                                    <>
                                        {line}
                                        <br />
                                    </>
                                ))}
                            </Typography>
                        )}
                    </Box>
                )}

                {closeIcon && (
                    <IconButton
                        size="small"
                        onClick={onClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Stack>

            {content && (
                <DialogContent
                    sx={{ padding: "16px !important", height: "auto", ...containerStyle }}
                >
                    {content}
                </DialogContent>
            )}

            {action}

            {containsBtn && (
                <DialogActions>
                    <Stack flexDirection="row" alignItems="center" justifyContent="center" mb={0.5} mr={0.6}>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            disabled={loading}
                            onClick={handleSelectNo ? handleSelectNo : onClose}
                        >
                            {close ? close : noBtn ? noBtn : "No"}
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={onConfirm}
                            sx={{ ml: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : yesBtn ? yesBtn : 'Yes'}
                        </Button>
                    </Stack>
                </DialogActions>
            )}
        </Dialog>
    );
}

AlertDialog.propTypes = {
    action: PropTypes.node,
    content: PropTypes.node,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    title: PropTypes.string,
};
