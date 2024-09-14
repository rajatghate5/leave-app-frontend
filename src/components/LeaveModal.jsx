import React, { useState } from "react";
import { partnerData } from "../utils/common";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const LeaveModal = ({
  isOpen,
  onClose,
  formData,
  availableSlots,
  onChange,
  onDateChange,
  onSubmit,
  today,
  loading,
  existingLeaves,
}) => {
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (checkOverlap()) {
      setError("New leave overlaps with an existing leave.");
      return;
    }
    onSubmit();
  };

  const checkOverlap = () => {
    if (!Array.isArray(existingLeaves)) return false;
    const newStart = new Date(formData.startDate);
    const newEnd = new Date(formData.endDate);

    return existingLeaves.some((leave) => {
      const existingStart = new Date(leave.startDate);
      const existingEnd = new Date(leave.endDate);
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            variant="h6"
            component="h2"
            className="uppercase font-bold"
          >
            Add Leave
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2} direction="column">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Walker</InputLabel>
              <Select
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              >
                <MenuItem value="" disabled>
                  Select Walker
                </MenuItem>
                {partnerData.map((item, index) => (
                  <MenuItem key={index} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Please select a walker</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Reason for Leave"
              name="reason"
              value={formData.reason}
              onChange={onChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => {
                onChange(e);
                onDateChange();
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              inputProps={{ min: today }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => {
                onChange(e);
                onDateChange();
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              inputProps={{ min: formData.startDate || today }}
            />
          </Grid>

          {formData.startDate &&
            formData.endDate &&
            formData.startDate === formData.endDate &&
            formData.name && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Slot</InputLabel>
                  <Select
                    name="slot"
                    value={formData.slot}
                    onChange={onChange}
                    required
                  >
                    <MenuItem value="" disabled>
                      Select Slot
                    </MenuItem>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, index) => (
                        <MenuItem
                          key={index}
                          value={`${slot.start} - ${slot.end}`}
                        >
                          {slot.start} - {slot.end}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No Slots Available
                      </MenuItem>
                    )}
                  </Select>
                  <FormHelperText>Please select a time slot</FormHelperText>
                </FormControl>
              </Grid>
            )}
        </Grid>

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LeaveModal;
