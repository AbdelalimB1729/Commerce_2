import React from "react";
import Sidebar from "../Components_admin/Sidebar";
import { Card, Row, Col, Table } from "react-bootstrap";
import "../CSS/AdminDashbord.css";

const Settings = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content p-4">
        <h1>Settings</h1>

        <Row className="mb-4">
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header>
                <h5>Admin Information</h5>
              </Card.Header>
              <Card.Body>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Security Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Abdelalim Bini</td>
                      <td>admin@admin.com</td>
                      <td>High</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Bahae Eddine Tayab</td>
                      <td>admin@admin.com</td>
                      <td>High</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header>
                <h5>Site Information</h5>
              </Card.Header>
              <Card.Body>
                <p>
                  <strong>Site Name:</strong> BookNest
                </p>
                <p>
                  <strong>Address:</strong> 3030 Rue Hochelaga, Montréal, QC H1W 1G2, Canada
                </p>
                <p>
                  <strong>Description:</strong> Your gateway to thousands of books.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Settings;
