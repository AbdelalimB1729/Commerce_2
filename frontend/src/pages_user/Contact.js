import React, { useState } from "react";
import Navbar from '../Components_user/Nav';
import Footer from '../Components_user/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Alert, Row, Col, Card } from "react-bootstrap";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
    <Navbar/>
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4 display-4">Contact Us</h1>
          <p className="text-center lead mb-5">
            We’d love to hear from you! Please fill out the form below to get in touch.
          </p>
          {submitted && (
            <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
              Your message has been sent successfully!
            </Alert>
          )}
          <Card className="shadow-lg p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
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

              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-2">
                Send Message
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <section className="mt-5">
        <h2 className="text-center display-6">Our Location</h2>
        <div className="d-flex justify-content-center mt-4">
          <iframe
            title="Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89423.72296213379!2d-73.70737560273437!3d45.54044060000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91b92de11a6b1%3A0xf00059d2f2ea0094!2sInstitut%20Teccart!5e0!3m2!1sfr!2sca!4v1731533765446!5m2!1sfr!2sca"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </Container>
    <Footer/>
    </>
  );
}
export default Contact;
