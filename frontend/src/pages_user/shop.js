import React, { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Pagination,
} from "react-bootstrap";
import Navbar from "../Components_user/Nav";
import Footer from "../Components_user/Footer";
import Cookies from "js-cookie";

function Shop() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [category, sort, books]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost/Test_api/index.php?controller=Livre&action=getAllLivres"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setBooks(data);
        setFilteredBooks(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let updatedBooks = [...books];
    if (category)
      updatedBooks = updatedBooks.filter((book) => book.typeLivre === category);
    if (sort === "asc") updatedBooks.sort((a, b) => a.prix - b.prix);
    if (sort === "desc") updatedBooks.sort((a, b) => b.prix - a.prix);
    setFilteredBooks(updatedBooks);
  };

  const handleAddToCart = async (book) => {
    const userCookie = Cookies.get("user");
    if (!userCookie) {
      setMessage("Please log in to add items to your cart.");
      return;
    }

    const user = JSON.parse(userCookie);
    const userId = user.id;

    try {
      const checkResponse = await fetch(
        `http://localhost/Test_api/index.php?controller=Panier&action=checkIfProductExists&userId=${userId}&livreId=${book.id}`
      );

      if (!checkResponse.ok) {
        throw new Error("Failed to check if product exists in cart.");
      }

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        const incrementFormData = new FormData();
        incrementFormData.append("userId", userId);
        incrementFormData.append("livreId", book.id);

        const incrementResponse = await fetch(
          "http://localhost/Test_api/index.php?controller=Panier&action=incrementQuantity",
          {
            method: "POST",
            body: incrementFormData,
          }
        );

        const incrementData = await incrementResponse.json();

        if (incrementData.success) {
          setMessage("Book quantity updated successfully in the cart!");
        } else {
          setMessage("Failed to update book quantity in the cart.");
        }
      } else {
        const addFormData = new FormData();
        addFormData.append("userId", userId);
        addFormData.append("livreId", book.id);
        addFormData.append("quantity", 1);

        const addResponse = await fetch(
          "http://localhost/Test_api/index.php?controller=Panier&action=addToPanier",
          {
            method: "POST",
            body: addFormData,
          }
        );

        const addData = await addResponse.json();

        if (addData.success) {
          setMessage("Book added to cart successfully!");
        } else {
          setMessage(addData.error || "Failed to add book to cart.");
        }
      }
    } catch (error) {
      setMessage("An error occurred while adding the book to your cart.");
    }
  };

  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <Container
        style={{ minHeight: "80vh", paddingTop: "20px", marginBottom: "30px" }}
      >
        <h1 className="text-center mb-4">Welcome to the Book Shop</h1>
        {message && (
          <Alert
            variant={message.includes("successfully") ? "success" : "danger"}
            onClose={() => setMessage("")}
            dismissible
          >
            {message}
          </Alert>
        )}
        <Form className="filter-container p-3 rounded shadow-sm bg-light mb-4">
          <Row className="gy-3 align-items-center">
            <Col xs={12} md={6}>
              <Form.Group controlId="categoryFilter">
                <Form.Label className="fw-bold text-muted">Category</Form.Label>
                <Form.Select
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  <option value="roman">Roman</option>
                  <option value="philosophie">Philosophie</option>
                  <option value="science">Science</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="sortFilter">
                <Form.Label className="fw-bold text-muted">
                  Sort by Price
                </Form.Label>
                <Form.Select
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort by price"
                  className="filter-select"
                >
                  <option value="">Sort by Price</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Container style={{ minHeight: "80vh", paddingTop: "20px" }}>
            <h1
              style={{
                textAlign: "center",
                marginBottom: "30px",
                fontSize: "2.5rem",
              }}
            >
              Our Book Collection
            </h1>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {currentBooks.map((book) => (
                <Col key={book.id}>
                  <Card
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      backgroundColor: "#f9f9f9",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s",
                    }}
                    className="h-100"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <Card.Img
                      variant="top"
                      src={book.sourceImg || "../DB/Images_Livres/default.jpg"}
                      alt={book.nom}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        borderBottom: "2px solid #ddd",
                      }}
                    />
                    <Card.Body>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <h5
                            style={{ fontWeight: "bold", marginBottom: "5px" }}
                          >
                            {book.nom}
                          </h5>
                          <Badge
                            bg="info"
                            style={{
                              fontSize: "0.85rem",
                              marginBottom: "10px",
                            }}
                          >
                            {book.typeLivre}
                          </Badge>
                        </div>
                        <Card.Text
                          style={{ fontSize: "0.9rem", color: "#555" }}
                        >
                          {book.description}
                        </Card.Text>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: "bold",
                              color: "#333",
                            }}
                          >
                            {book.prix} €
                          </span>
                          <Button
                            variant="primary"
                            onClick={() => handleAddToCart(book)}
                            style={{
                              padding: "8px 20px",
                              borderRadius: "25px",
                            }}
                          >
                            <i
                              className="bi bi-cart-plus"
                              style={{ marginRight: "5px" }}
                            ></i>
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Pagination.Item>
                  )
                )}
              </Pagination>
            </div>
          </Container>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Shop;
