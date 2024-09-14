import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonModal from "./CommonModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const GetLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "edit" or "delete"
  const [currentStatus, setCurrentStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [refresh, setRefresh] = useState(false); // Added for refreshing

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("https://leave-app-backend-tqdr.onrender.com/api/getLeaves");
        setLeaves(response.data);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };
    fetchLeaves();
  }, [refresh]); // Add refresh to the dependency array to trigger a fetch

  const handleDelete = async () => {
    try {
      await axios.delete(`https://leave-app-backend-tqdr.onrender.com/api/removeLeave/${deleteId}`);
      setRefresh(!refresh); // Trigger refresh
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const handleSaveStatus = async ({ status, startDate, endDate }) => {
    try {
      await axios.put(`https://leave-app-backend-tqdr.onrender.com/api/updateLeave/${editId}`, {
        status,
        startDate,
        endDate,
      });
      setRefresh(!refresh); // Trigger refresh
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddLeave = async (newLeave) => {
    try {
      await axios.post("https://leave-app-backend-tqdr.onrender.com/api/addLeave", newLeave);
      setRefresh(!refresh); // Trigger refresh
    } catch (error) {
      console.error("Error adding leave:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
        return "purple";
      case "Denied":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <div className="px-10">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Slot</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow key={leave._id}>
              <TableCell>{leave.userId}</TableCell>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{leave.city}</TableCell>
              <TableCell>{leave.reason}</TableCell>
              <TableCell>{leave.startDate.split("T")[0]}</TableCell>
              <TableCell>{leave.endDate.split("T")[0]}</TableCell>
              <TableCell>{leave.slot}</TableCell>
              <TableCell sx={{ color: getStatusColor(leave.status), fontWeight: 'bold' }}>
                {leave.status}
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label="edit"
                  color="primary"
                  onClick={() => {
                    setEditId(leave._id);
                    setCurrentStatus(leave.status);
                    setStartDate(leave.startDate.split("T")[0]);
                    setEndDate(leave.endDate.split("T")[0]);
                    setModalMode("edit");
                    setIsModalOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  onClick={() => {
                    setDeleteId(leave._id);
                    setModalMode("delete");
                    setIsModalOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CommonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        onSaveStatus={handleSaveStatus}
        onAddLeave={handleAddLeave} // Pass add leave handler
        currentStatus={currentStatus}
        deleteId={deleteId}
        editId={editId}
        mode={modalMode}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default GetLeaves;
