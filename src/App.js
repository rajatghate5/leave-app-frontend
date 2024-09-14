// import "./App.css";
// import Leave from "./components/Leave";

// function App() {
//   return (
//     <div className="App">
//       <Leave />
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Leave from "./components/Leave";
import { apiUrl } from "./utils/common";

const App = () => {
  const [existingLeaves, setExistingLeaves] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getLeaves`);
        setExistingLeaves(response.data);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    fetchLeaves();
  }, [refreshKey]);

  return (
    <div className="App">
      <Leave
        existingLeaves={existingLeaves}
        onRefresh={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
    </div>
  );
};

export default App;
