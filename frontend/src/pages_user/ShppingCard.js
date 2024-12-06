import React, { useState, useEffect } from "react";
import { Button, Container, Spinner, Alert, Row, Col, Card } from "react-bootstrap";
import Navbar from "../Components_user/Nav";
import Footer from "../Components_user/Footer";
import PayPalButton from "../Components_user/PayPalButton"
import Cookies from "js-cookie";

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [showPayPalButton, setShowPayPalButton] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError("");

      const userCookie = Cookies.get("user");
      if (!userCookie) {
        setError("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userCookie);
      const userId = user.id;

      try {
        const response = await fetch(
          `http://localhost/Test_api/index.php?controller=Panier&action=getPanierByUserId&userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart items.");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setCart(
            data.map((item) => ({
              ...item,
              book_price: parseFloat(item.book_price) || 0,
              quantite: parseInt(item.quantite, 10) || 1,
            }))
          );
        } else {
          throw new Error("Invalid response format.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (cartId) => {
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost/Test_api/index.php?controller=Panier&action=deleteFromPanier&cartId=${cartId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (data.success) {
        setCart((prevCart) => prevCart.filter((item) => item.cart_id !== cartId));
        setMessage("Item removed from the cart successfully.");
      } else {
        setError(data.message || "Failed to remove item from the cart.");
      }
    } catch (error) {
      setError("An error occurred while removing the item from the cart.");
      console.error(error);
    }
  };

  const handleIncrementQuantity = async (cartId, livreId) => {
    setMessage("");
    const userCookie = Cookies.get("user");
    if (!userCookie) {
      setError("Please log in to modify your cart.");
      return;
    }

    const user = JSON.parse(userCookie);
    const userId = user.id;

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("livreId", livreId);

      const response = await fetch(
        "http://localhost/Test_api/index.php?controller=Panier&action=incrementQuantity",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.cart_id === cartId
              ? { ...item, quantite: item.quantite + 1 }
              : item
          )
        );
        setMessage("Quantity incremented successfully.");
      } else {
        setError(data.message || "Failed to increment quantity.");
      }
    } catch (error) {
      setError("An error occurred while incrementing the quantity.");
      console.error(error);
    }
  };

  const handleDecrementQuantity = async (cartId, livreId, currentQuantity) => {
    setMessage("");

    if (!Number.isInteger(currentQuantity) || currentQuantity <= 1) {
      setMessage("Quantity cannot be less than 1.");
      return;
    }

    const userCookie = Cookies.get("user");
    if (!userCookie) {
      setError("Please log in to modify your cart.");
      return;
    }

    const user = JSON.parse(userCookie);
    const userId = user.id;

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("livreId", livreId);

      const response = await fetch(
        "http://localhost/Test_api/index.php?controller=Panier&action=decrementQuantity",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.cart_id === cartId
              ? { ...item, quantite: Math.max(item.quantite - 1, 1) }
              : item
          )
        );
        setMessage("Quantity decremented successfully.");
      } else {
        setError(data.message || "Failed to decrement quantity.");
      }
    } catch (error) {
      setError("An error occurred while decrementing the quantity.");
      console.error("Decrement Error:", error);
    }
  };

  const handlePayNow = async () => {

    if (calculateTotal().toFixed(2) <= 0) {
      setError("The total amount must be greater than 0 to proceed with payment.");
      return;
    }

    setShowPayPalButton(true);
    setTotal(calculateTotal().toFixed(2))
    const userCookie = Cookies.get("user");
    if (!userCookie) {
      setError("Please log in to complete your order.");
      return;
    }
  
    const user = JSON.parse(userCookie);
    const userId = user.id;
    const totalPrice = calculateTotal();
  
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("totalPrice", totalPrice);
  
      const response = await fetch("http://localhost/Test_api/index.php?controller=Order&action=addOrder", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        const deleteResponse = await fetch(
          `http://localhost/Test_api/index.php?controller=Panier&action=deleteFromPanierByUserId&userId=${userId}`,
          {
            method: "GET",
          }
        );
  
        const deleteData = await deleteResponse.json();
        if (deleteData.success) {
          setMessage("Order placed successfully and cart cleared.");
          setCart([]);
        } else {
          setError(deleteData.error || "Failed to clear the cart.");
        }
      } else {
        setError(data.error || "Failed to place the order.");
      }
    } catch (error) {
      setError("An error occurred while placing the order.");
    }
  };
  

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.quantite * item.book_price, 0);

  return (
    <>
      <Navbar />
      <Container className="mt-5 mb-5">
        <h2 className="text-center mb-4 fw-bold">Your Shopping Cart</h2>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p>Loading your cart...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <>
            {message && (
              <Alert
                variant="success"
                className="text-center"
                onClose={() => setMessage("")}
                dismissible
              >
                {message}
              </Alert>
            )}
            <Row xs={1} md={2} lg={3} className="g-4">
              {cart.map((item) => (
                <Col key={item.cart_id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={item.book_image}
                      alt={item.book_name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{item.book_name}</Card.Title>
                      <Card.Text>{item.book_description}</Card.Text>
                      <Card.Text>
                        <strong>Price:</strong> ${item.book_price.toFixed(2)}
                      </Card.Text>
                      <Card.Text>
                        <strong>Quantity:</strong> {item.quantite}
                      </Card.Text>
                      <Card.Text>
                        <strong>Total:</strong> $
                        {(item.quantite * item.book_price).toFixed(2)}
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            handleDecrementQuantity(
                              item.cart_id,
                              item.book_id,
                              item.quantite
                            )
                          }
                        >
                          -
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            handleIncrementQuantity(item.cart_id, item.book_id)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRemoveItem(item.cart_id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="text-end mt-4">
              <h4>Total: ${calculateTotal().toFixed(2) > 0 ? calculateTotal().toFixed(2) : total}</h4>
              {!showPayPalButton ? (
                <Button variant="primary" size="lg" onClick={handlePayNow}>
                  Pay Now
                </Button>
              ) : (
                <PayPalButton
                  total={total}
                  onSuccess={() => {
                    setMessage("Payment successful! Your order is being processed.");
                  }}
                />
              )}
            </div>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};
export default ShoppingCart;
