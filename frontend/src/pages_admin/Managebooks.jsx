import React, { useState, useEffect } from "react";
import Sidebar from "../Components_admin/Sidebar";
import { Table, Button, Modal, Form, InputGroup, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import "../CSS/AdminDashbord.css";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({ id: null, nom: "", description: "", typeLivre: "", prix: "", sourceImg: "" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost/Test_api/index.php?controller=Livre&action=getAllLivres");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des livres :", error);
    }
  };

  const handleSaveBook = async () => {
    try {
      const formData = new FormData();
      formData.append("id", formState.id || "");
      formData.append("nom", formState.nom);
      formData.append("description", formState.description);
      formData.append("sourceImg", formState.sourceImg || "default.jpg");
      formData.append("typeLivre", formState.typeLivre);
      formData.append("prix", formState.prix);

      const action = editing ? "updateLivre" : "addLivre";
      const response = await fetch(
        `http://localhost/Test_api/index.php?controller=Livre&action=${action}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchBooks();
        setShowModal(false);
        setEditing(false);
        setFormState({ id: null, nom: "", description: "", typeLivre: "", prix: "", sourceImg: "" });
      } else {
        console.error("Erreur lors de l'enregistrement du livre :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du livre :", error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/Test_api/index.php?controller=Livre&action=deleteLivre&id=${id}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (data.success) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      } else {
        console.error("Erreur lors de la suppression du livre :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du livre :", error);
    }
  };

  const handleEditBook = (book) => {
    setEditing(true);
    setFormState({
      id: book.id,
      nom: book.nom,
      description: book.description,
      typeLivre: book.typeLivre,
      prix: book.prix,
      sourceImg: book.sourceImg,
    });
    setShowModal(true);
  };

  const filteredBooks = books.filter((book) =>
    `${book.nom} ${book.description} ${book.typeLivre}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: books.map((book) => book.nom),
    datasets: [
      {
        label: "Books by Price",
        data: books.map((book) => parseFloat(book.prix)),
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
        <h1>Manage Books</h1>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <FormControl
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button className="mb-3" onClick={() => setShowModal(true)}>
          Add New Book
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.nom}</td>
                <td>{book.description}</td>
                <td>{book.typeLivre}</td>
                <td>${parseFloat(book.prix).toFixed(2)}</td>
                <td>
                  <img
                    src={book.sourceImg} 
                    alt={book.nom}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEditBook(book)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteBook(book.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h2>Books Chart</h2>
        <Line data={chartData} />

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Edit Book" : "Add New Book"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter book title"
                  value={formState.nom}
                  onChange={(e) => setFormState({ ...formState, nom: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter book description"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter book category"
                  value={formState.typeLivre}
                  onChange={(e) => setFormState({ ...formState, typeLivre: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter book price"
                  value={formState.prix}
                  onChange={(e) => setFormState({ ...formState, prix: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  value={formState.sourceImg}
                  onChange={(e) => setFormState({ ...formState, sourceImg: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSaveBook}>
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ManageBooks;
