import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

const CommonModal = ({
  isOpen,
  onClose,
  onConfirm,
  onSaveStatus,
  currentStatus,
  mode,
  startDate,
  endDate,
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [startDateValue, setStartDateValue] = useState(startDate);
  const [endDateValue, setEndDateValue] = useState(endDate);

  useEffect(() => {
    setStatus(currentStatus);
    setStartDateValue(startDate);
    setEndDateValue(endDate);
  }, [currentStatus, startDate, endDate]);

  const handleConfirm = () => {
    if (mode === "delete") {
      onConfirm();
    } else if (mode === "edit") {
      onSaveStatus({
        status,
        startDate: startDateValue,
        endDate: endDateValue,
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h5" className="pb-6 uppercase">
          {mode === "edit" ? "Edit Leave" : "Confirm Deletion"}
        </Typography>
        {mode === "edit" ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={startDateValue}
                onChange={(e) => setStartDateValue(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={endDateValue}
                onChange={(e) => setEndDateValue(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{ min: startDateValue }}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Denied">Denied</MenuItem>
              </Select>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1">
            Are you sure you want to delete this leave?
          </Typography>
        )}
        <Box mt={4} display="flex" gap={2}>
          <Button
            onClick={handleConfirm}
            color="primary"
            variant="outlined"
            fullWidth
          >
            {mode === "edit" ? "Update" : "Yes"}
          </Button>
          <Button
            onClick={onClose}
            color="secondary"
            variant="outlined"
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CommonModal;

