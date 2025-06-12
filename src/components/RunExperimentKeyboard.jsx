import React from "react";
import { Box, Button, Stack } from "@mui/material";

const RunExperimentKeyboard = ({ onKeyPress }) => {
  const handleButtonClick = (number) => {
    onKeyPress({ key: number.toString() });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "80px",
        zIndex: 10000,
        padding: 1,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: "8px 0 0 8px",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack spacing={1}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="contained"
            onClick={() => handleButtonClick(num)}
            sx={{
              minWidth: "40px",
              height: "40px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            {num}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default RunExperimentKeyboard;