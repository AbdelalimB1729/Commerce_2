import React, { useState, useEffect } from "react";
import Sidebar from "../Components_admin/Sidebar";
import { Table, Button, Modal, Form, InputGroup, FormControl, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js"; 
import "../CSS/AdminDashbord.css";

Chart.register(CategoryScale);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({ id: null, nom: "", email: "", role: "user" });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost/Test_api/index.php?controller=User&action=getAllUsers");
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError("Failed to fetch users. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching users.");
    }
  };

  const handleAddUser = async () => {
    if (!formState.nom || !formState.email) {
      setError("Name and Email are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nom", formState.nom);
      formData.append("email", formState.email);
      formData.append("role", formState.role);
      formData.append("password", "default123");

      const response = await fetch("http://localhost/Test_api/index.php?controller=User&action=addUser", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage("User added successfully.");
        fetchUsers();
        handleCloseModal();
      } else {
        setError(data.error || "Failed to add user.");
      }
    } catch (error) {
      setError("An error occurred while adding the user.");
    }
  };

  const handleEditUser = async () => {
    if (!formState.nom || !formState.email) {
      setError("Name and Email are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", formState.id);
      formData.append("nom", formState.nom);
      formData.append("email", formState.email);
      formData.append("role", formState.role);

      const response = await fetch("http://localhost/Test_api/index.php?controller=User&action=updateUser", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage("User updated successfully.");
        fetchUsers();
        handleCloseModal();
      } else {
        setError(data.error || "Failed to update user.");
      }
    } catch (error) {
      setError("An error occurred while updating the user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/Test_api/index.php?controller=User&action=deleteUser&id=${id}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage("User deleted successfully.");
        fetchUsers();
      } else {
        setError(data.error || "Failed to delete user.");
      }
    } catch (error) {
      setError("An error occurred while deleting the user.");
    }
  };

  const handleOpenEditModal = (user) => {
    setFormState({ id: user.id, nom: user.nom, email: user.email, role: user.role });
    setEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setFormState({ id: null, nom: "", email: "", role: "user" });
    setEditMode(false);
    setShowModal(false);
    setError("");
    setMessage("");
  };

  const filteredUsers = users.filter((user) =>
    `${user.nom} ${user.email} ${user.role}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: ["Admin", "User"],
    datasets: [
      {
        label: "Users by Role",
        data: [
          users.filter((user) => user.role === "admin").length,
          users.filter((user) => user.role === "user").length,
        ],
        backgroundColor: ["#007bff", "#28a745"],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content p-4">
        <h1>Manage Users</h1>
        {message && <Alert variant="success" onClose={() => setMessage("")} dismissible>{message}</Alert>}
        {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <FormControl
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button className="mb-3" onClick={() => setShowModal(true)}>
          Add New User
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleOpenEditModal(user)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h2>User Roles Distribution</h2>
        <Bar data={chartData} />

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? "Edit User" : "Add New User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user name"
                  value={formState.nom}
                  onChange={(e) => setFormState({ ...formState, nom: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.role}
                  onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={editMode ? handleEditUser : handleAddUser}>
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUsers;
