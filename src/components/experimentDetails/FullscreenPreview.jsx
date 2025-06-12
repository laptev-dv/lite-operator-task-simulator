import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
  } from "@mui/material";
  import {
    Close as CloseIcon,
  } from "@mui/icons-material";
  import StimulusPreview from "../shared/StimulusPreview";

const FullscreenPreview = ({ open, onClose, parameters }) => {
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            color: "common.white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
  
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            width: "100%",
            height: "100%",
            p: 0,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: "100%",
              height: "100%",  
            }}
          >
            <StimulusPreview parameters={parameters}/>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  export default FullscreenPreview;