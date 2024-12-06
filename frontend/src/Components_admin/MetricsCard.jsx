import React from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../CSS/MetricsCard.css";

const MetricsCard = ({ title, value, icon }) => {
  return (
    <Card className="metrics-card text-center shadow-sm animate__animated animate__fadeIn">
      <Card.Body>
        <FontAwesomeIcon icon={icon} size="2x" className="mb-3" />
        <h5>{title}</h5>
        <h3>{value}</h3>
      </Card.Body>
    </Card>
  );
};

export default MetricsCard;
