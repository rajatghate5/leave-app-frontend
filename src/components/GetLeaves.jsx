// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CommonModal from "./CommonModal";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   IconButton,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const GetLeaves = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState(""); // "edit" or "delete"
//   const [currentStatus, setCurrentStatus] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [refresh, setRefresh] = useState(false); // Added for refreshing

//   const apiUrl = process.env.REACT_APP_API_URL;
//   console.log(apiUrl);

//   useEffect(() => {
//     const fetchLeaves = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}/getLeaves`);
//         setLeaves(response.data);
//       } catch (error) {
//         console.error("Error fetching leaves:", error);
//       }
//     };
//     fetchLeaves();
//   }, [refresh, apiUrl]); // Add refresh to the dependency array to trigger a fetch

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${apiUrl}/removeLeave/${deleteId}`);
//       setRefresh(!refresh); // Trigger refresh
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error deleting leave:", error);
//     }
//   };

//   const handleSaveStatus = async ({ status, startDate, endDate }) => {
//     try {
//       await axios.put(`${apiUrl}/updateLeave/${editId}`, {
//         status,
//         startDate,
//         endDate,
//       });
//       setRefresh(!refresh); // Trigger refresh
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   const handleAddLeave = async (newLeave) => {
//     try {
//       await axios.post(`${apiUrl}}/addLeave`, newLeave);
//       setRefresh(!refresh); // Trigger refresh
//     } catch (error) {
//       console.error("Error adding leave:", error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved":
//         return "green";
//       case "Pending":
//         return "purple";
//       case "Denied":
//         return "red";
//       default:
//         return "black";
//     }
//   };

//   return (
//     <div className="px-10" style={{ overflowY: "scroll" }}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Apply Date</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Slots</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {leaves.map((leave) => (
//             <TableRow key={leave._id}>
//               <TableCell>{leave.userId}</TableCell>
//               <TableCell>{leave.name}</TableCell>
//               <TableCell>{leave.city}</TableCell>
//               <TableCell>{leave.reason}</TableCell>
//               <TableCell>{leave.createdAt.split("T")[0]}</TableCell>
//               <TableCell>{leave.startDate.split("T")[0]}</TableCell>
//               <TableCell>{leave.endDate.split("T")[0]}</TableCell>
//               <TableCell>{leave.slot}</TableCell>

//               <TableCell
//                 sx={{ color: getStatusColor(leave.status), fontWeight: "bold" }}
//               >
//                 {leave.status}
//               </TableCell>
//               <TableCell>
//                 <IconButton
//                   aria-label="edit"
//                   color="primary"
//                   onClick={() => {
//                     setEditId(leave._id);
//                     setCurrentStatus(leave.status);
//                     setStartDate(leave.startDate.split("T")[0]);
//                     setEndDate(leave.endDate.split("T")[0]);
//                     setModalMode("edit");
//                     setIsModalOpen(true);
//                   }}
//                 >
//                   <EditIcon />
//                 </IconButton>
//                 <IconButton
//                   aria-label="delete"
//                   color="secondary"
//                   onClick={() => {
//                     setDeleteId(leave._id);
//                     setModalMode("delete");
//                     setIsModalOpen(true);
//                   }}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <CommonModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={handleDelete}
//         onSaveStatus={handleSaveStatus}
//         onAddLeave={handleAddLeave} // Pass add leave handler
//         currentStatus={currentStatus}
//         deleteId={deleteId}
//         editId={editId}
//         mode={modalMode}
//         startDate={startDate}
//         endDate={endDate}
//       />
//     </div>
//   );
// };

// export default GetLeaves;

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
import { table, apiUrl } from "../utils/common";

const GetLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "edit" or "delete"
  const [currentStatus, setCurrentStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [refresh, setRefresh] = useState(false); // For refreshing the data

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getLeaves`);
        setLeaves(response.data);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };
    fetchLeaves();
  }, [refresh]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/removeLeave/${deleteId}`);
      setRefresh(!refresh); // Trigger refresh
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
      setRefresh(!refresh); // Trigger refresh
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddLeave = async (newLeave) => {
    try {
      await axios.post(`${apiUrl}/addLeave`, newLeave);
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
          {leaves.map((leave) => (
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
        onAddLeave={handleAddLeave}
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
