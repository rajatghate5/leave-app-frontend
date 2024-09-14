import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import LeaveModal from "./LeaveModal"; // Import the modal component
import GetLeaves from "./GetLeaves"; // Import GetLeaves component
import { apiUrl, partnerData } from "../utils/common";

const Leave = ({ existingLeaves, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: 0,
    name: "",
    city: "",
    reason: "",
    startDate: "",
    endDate: "",
    slot: "",
  });
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const handleOpen = () => setIsModalOpen(true);

  const handleClose = () => {
    setFormData({
      userId: 0,
      name: "",
      city: "",
      reason: "",
      startDate: "",
      endDate: "",
      slot: "",
    });
    setAvailableSlots([]);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.name) {
      const selectedWalker = partnerData.find(
        (walker) => walker.name === formData.name
      );
      if (selectedWalker) {
        setAvailableSlots(selectedWalker.slots);
        setFormData((prevData) => ({
          ...prevData,
          userId: selectedWalker.id,
          city: selectedWalker.city,
        }));
      } else {
        setAvailableSlots([]);
        setFormData((prevData) => ({
          ...prevData,
          userId: 0,
          city: "",
        }));
      }
    }
  }, [formData.name]);

  const handleDateChange = () => {
    if (formData.startDate && formData.endDate) {
      if (formData.startDate === formData.endDate && formData.name) {
        const selectedWalker = partnerData.find(
          (walker) => walker.name === formData.name
        );
        if (selectedWalker) {
          setAvailableSlots(selectedWalker.slots);
        }
      } else {
        setAvailableSlots([]);
      }
    }
  };

  const handleSubmit = async () => {
    const { userId, name, reason, startDate, endDate, slot, city } = formData;
    if (
      !name ||
      !reason ||
      !startDate ||
      !endDate ||
      (startDate === endDate && !slot)
    ) {
      alert(
        "Please fill out all fields and ensure dates are selected correctly."
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/addLeave`, {
        userId,
        name,
        city,
        reason,
        startDate,
        endDate,
        slot,
      });
      onRefresh(); // Trigger re-render in parent component
      alert("Leave request submitted successfully!");
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request. Please try again.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <div className="w-11/12 py-4 flex justify-end">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpen}
          sx={{ mr: 2 }}
        >
          Add Leave
        </Button>
      </div>
      <LeaveModal
        isOpen={isModalOpen}
        onClose={handleClose}
        formData={formData}
        availableSlots={availableSlots}
        onChange={handleChange}
        onDateChange={handleDateChange}
        onSubmit={handleSubmit}
        today={today}
        loading={loading}
      />
      <div>
        <h2 className="text-2xl text-center font-bold uppercase">Leaves</h2>
        <GetLeaves existingLeaves={existingLeaves} onRefresh={onRefresh} />
      </div>
    </>
  );
};

export default Leave;
