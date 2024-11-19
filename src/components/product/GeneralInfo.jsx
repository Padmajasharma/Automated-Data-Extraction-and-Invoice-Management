import React from 'react';
import { Row, Col, Form,Card } from 'react-bootstrap';

const GeneralInfo = ({ itemName, setitemName, itemId, setitemId, itemDescription, setitemDescription }) => {
  return (
    <Card className="mb-3 p-3">
      <h5>General Information</h5>
      <Form.Group controlId="itemName" className="mb-3">
        <Row>
          <Col>
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={itemName}
              onChange={(e) => setitemName(e.target.value)}
              required
            />
          </Col>
          <Col>
            <Form.Label>Product ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product ID"
              value={itemId}
              onChange={(e) => setitemId(e.target.value)}
              required
            />
          </Col>
        </Row>
      </Form.Group>

      <Form.Group controlId="itemDescription" className="mb-3">
        <Form.Label>Product Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="Enter product description"
          value={itemDescription}
          onChange={(e) => setitemDescription(e.target.value)}
          style={{ resize: 'none' }} // Non-resizable
          required
        />
      </Form.Group>
    </Card>
  );
};

export default GeneralInfo;
