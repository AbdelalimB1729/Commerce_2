import React, { useState, useEffect } from "react";
import Sidebar from "../Components_admin/Sidebar";
import { Table, Button, InputGroup, FormControl, Alert, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import "../CSS/AdminDashbord.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({ id: null, ID_user: "", total_prix: "" });

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost/Test_api/index.php?controller=Order&action=getAllOrders");
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (error) {
      setError("An error occurred while fetching orders.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost/Test_api/index.php?controller=User&action=getAllUsers");
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError("Failed to fetch users.");
      }
    } catch (error) {
      setError("An error occurred while fetching users.");
    }
  };

  const handleSaveOrder = async () => {
    const isUpdate = !!formState.id;
    const endpoint = isUpdate
      ? "http://localhost/Test_api/index.php?controller=Order&action=updateOrder"
      : "http://localhost/Test_api/index.php?controller=Order&action=addOrder";

    try {
      const formData = new FormData();
      if (isUpdate) {
        formData.append("id", formState.id);
      }
      formData.append("userId", formState.ID_user);
      formData.append("totalPrice", formState.total_prix);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage(isUpdate ? "Order updated successfully." : "Order added successfully.");
        setShowModal(false);
        setFormState({ id: null, ID_user: "", total_prix: "" });
        fetchOrders();
      } else {
        setError(data.error || `Failed to ${isUpdate ? "update" : "add"} order.`);
      }
    } catch (error) {
      setError(`An error occurred while ${isUpdate ? "updating" : "adding"} the order.`);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/Test_api/index.php?controller=Order&action=deleteOrder&id=${id}`,
        { method: "GET" }
      );

      const data = await response.json();
      if (data.success) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
        setMessage("Order deleted successfully.");
      } else {
        setError(data.error || "Failed to delete order.");
      }
    } catch (error) {
      setError("An error occurred while deleting the order.");
    }
  };

  const handleEditOrder = (order) => {
    setFormState({ id: order.id, ID_user: order.ID_user, total_prix: order.total_prix });
    setShowModal(true);
  };

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.ID_user} ${order.total_prix}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: orders.map((order) => `Order #${order.id}`),
    datasets: [
      {
        label: "Order Totals",
        data: orders.map((order) => parseFloat(order.total_prix)),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content p-4">
        <h1>Manage Orders</h1>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <FormControl
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button className="mb-3" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Order
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const user = users.find((u) => u.id === order.ID_user);
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{user ? user.nom : "Unknown User"}</td>
                  <td>${parseFloat(order.total_prix).toFixed(2)}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button variant="warning" className="me-2" onClick={() => handleEditOrder(order)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteOrder(order.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <h2>Orders Chart</h2>
        <Line data={chartData} />

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{formState.id ? "Update Order" : "Add Order"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>User</Form.Label>
                <Form.Control
                  as="select"
                  value={formState.ID_user}
                  onChange={(e) => setFormState({ ...formState, ID_user: e.target.value })}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter total price"
                  value={formState.total_prix}
                  onChange={(e) => setFormState({ ...formState, total_prix: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSaveOrder}>
                {formState.id ? "Update Order" : "Add Order"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ManageOrders;
