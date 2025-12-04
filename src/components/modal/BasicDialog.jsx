// @mui
import PropTypes from 'prop-types';
import { Box, Button, Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Card } from '@mui/material';
// import { LoadingButton } from "@mui/lab";
import { IconButton } from '@mui/material';
import { X } from 'lucide-react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function BasicDialog({
  title,
  subTitle,
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
  maxWidth,
  titleColor,
  closeButtonColor = 'error',
  toolbar,
  ...other
}) {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullWidth
      // fullScreen={fullScreen}
      maxWidth={maxWidth ? maxWidth : 'sm'}
      open={open}
      {...other}
      sx={{
        borderRadius: '8px',
        '& .MuiPaper-root.MuiDialog-paper': {
          // background: '#D9D9D9',
        },
      }}
    >
      <Card
        sx={{
          // mt: 0.6,
          overflow: 'auto',
          p: 0
        }}
      >
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            position: 'sticky ! important',
            top: 0,
            zIndex: 1000,
            background: '#fff',
            ...(toolbar && {
              background: '#E9F4F1',
              boxShadow: '0px 1px 4px 0px #00000040',
            }),
          }}
          pl={2}
          pt={1}
          pr={1}
          pb={0.5}
        >
          {title && (
            <Box>
              <DialogTitle sx={{ p: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: titleColor ? titleColor : '#000',
                    textTransform: 'capitalize',
                  }}
                >
                  {title}
                </Typography>
              </DialogTitle>
              {subTitle && (
                <Typography
                  fontSize="12px"
                  variant="body2"
                  color="text.secondary"
                  component="span"
                >
                  {subTitle}
                </Typography>
              )}
            </Box>
          )}

          {closeIcon && (
            <IconButton onClick={onClose}>
              <X size={16} />
            </IconButton>
          )}
        </Stack>

        {content && (
          <DialogContent
            sx={{ px: '16px !important', py: '4px !important', height: 'auto' }}
          >
            {content}
          </DialogContent>
        )}

        {action}

        {containsBtn && (
          <DialogActions>
            <Stack flexDirection="row" alignItems="center">
              <Button
                variant="outlined"
                color={closeButtonColor}
                disabled={loading}
                onClick={handleSelectNo ? handleSelectNo : onClose}
              >
                {close ? close : 'No'}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                disabled={loading}
                onClick={onConfirm}
                sx={{ ml: 2 }}
              >
                {submit ? submit : 'Yes'}
              </Button>
            </Stack>
          </DialogActions>
        )}
      </Card>
    </Dialog>
  );
}

BasicDialog.propTypes = {
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};
