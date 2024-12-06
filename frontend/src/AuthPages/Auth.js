import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import Cookies from "js-cookie";
import Navbar from "../Components_user/Nav";
import Footer from "../Components_user/Footer";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "" });
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (formData.email === "admin@admin.com" && formData.password === "admin") {
        setMessage("Admin login successful!");
        Cookies.set("admin", "true", { expires: 1 });
        navigate("/admin/dashboard");
        return;
      }

      const response = await fetch("http://localhost/Test_api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
        setMessage("Login successful!");
        navigate("/shop");
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("User registered successfully! Redirecting to login...");
          setTimeout(() => {
            setIsLogin(true); 
          }, 2000);
        } else {
          setMessage("Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setMessage("An error occurred during registration.");
      });
  };

  return (
    <>
      <Navbar />
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col md={6} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">
                {isLogin ? "Login" : "Register"}
              </h2>
              {message && (
                <Alert
                  variant={message.includes("success") ? "success" : "danger"}
                >
                  {message}
                </Alert>
              )}
              {isLogin && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              )}
              {!isLogin && (
                <Form
                  method="POST"
                  action="http://localhost/Test_api/index.php?controller=User&action=addUser"
                  onSubmit={handleRegistrationSuccess}
                >
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="nom"
                      placeholder="Enter your name"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      required
                    />
                  </Form.Group>
                  <Form.Control type="hidden" name="role" value="user" />
                  <Button type="submit" className="w-100" variant="primary">
                    Register
                  </Button>
                </Form>
              )}
              <div className="text-center mt-3">
                <Button variant="link" onClick={toggleAuthMode}>
                  {isLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    <Footer />
    </>
  );
};

export default AuthPage;
