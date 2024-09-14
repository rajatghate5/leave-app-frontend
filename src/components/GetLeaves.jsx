import React, { useState } from "react";
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
import { table, apiUrl } from "../utils/common";

const GetLeaves = ({ existingLeaves, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "edit" or "delete"
  const [currentStatus, setCurrentStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/removeLeave/${deleteId}`);
      onRefresh(); // Trigger refresh
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const handleSaveStatus = async ({ status, startDate, endDate }) => {
    try {
      await axios.put(`${apiUrl}/updateLeave/${editId}`, {
        status,
        startDate,
        endDate,
      });
      onRefresh(); // Trigger refresh
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
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
    <div className="px-10" style={{ overflowY: "scroll" }}>
      <Table>
        <TableHead>
          <TableRow>
            {table.map((item, index) => (
              <TableCell sx={{ fontWeight: "bold" }} key={index}>
                {item}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {existingLeaves.map((leave) => (
            <TableRow key={leave._id}>
              <TableCell>{leave.userId}</TableCell>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{leave.city}</TableCell>
              <TableCell>{leave.reason}</TableCell>
              <TableCell>{leave.createdAt.split("T")[0]}</TableCell>
              <TableCell>{leave.startDate.split("T")[0]}</TableCell>
              <TableCell>{leave.endDate.split("T")[0]}</TableCell>
              <TableCell>{leave.slot}</TableCell>
              <TableCell
                sx={{ color: getStatusColor(leave.status), fontWeight: "bold" }}
              >
                {leave.status}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalMode("edit");
                    setEditId(leave._id);
                    setCurrentStatus(leave.status);
                    setStartDate(leave.startDate);
                    setEndDate(leave.endDate);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalMode("delete");
                    setDeleteId(leave._id);
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
        onConfirm={modalMode === "delete" ? handleDelete : undefined}
        onSaveStatus={modalMode === "edit" ? handleSaveStatus : undefined}
        currentStatus={currentStatus}
        mode={modalMode}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default GetLeaves;
