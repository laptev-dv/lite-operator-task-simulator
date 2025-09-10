import { useDeferredValue, useState } from "react";
import {
  Chip,
  Popover,
} from "@mui/material";
import { ChromePicker } from "react-color";

function ColorPickerButton({ color, onChange, disabled=false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (color) => {
    onChange(color.hex);
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-picker-popover" : undefined;

  return (
    <>
      <Chip
        clickable={!disabled}
        sx={{
          borderRadius: 20,
          width: 40,
          height: 40,
          backgroundColor: color,
          border: "1px solid #ccc",
        }}
        onClick={(event)=>{
          if(!disabled) { handleClick(event) }
        }
      }
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ChromePicker color={color} onChange={handleChange} />
      </Popover>
    </>
  );
}

export default ColorPickerButton;