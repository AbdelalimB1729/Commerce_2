import React, { useState, useEffect } from "react";
import MetricsCard from "../Components_admin/MetricsCard";
import Sidebar from "../Components_admin/Sidebar";
import { faBook, faUser } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const booksResponse = await fetch(
        "http://localhost/Test_api/index.php?controller=Livre&action=getAllLivres"
      );
      const booksData = await booksResponse.json();
      setTotalBooks(booksData.length);

      const usersResponse = await fetch(
        "http://localhost/Test_api/index.php?controller=User&action=getAllUsers"
      );
      const usersData = await usersResponse.json();
      setTotalUsers(usersData.length);
    } catch (error) {
      setError("Failed to fetch metrics. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content p-4">
        <h1 className="mb-4">Admin Dashboard</h1>
        {error && <p className="text-danger">{error}</p>}
        <div className="d-flex justify-content-around">
          <MetricsCard title="Total Books" value={totalBooks} icon={faBook} />
          <MetricsCard title="Total Users" value={totalUsers} icon={faUser} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
