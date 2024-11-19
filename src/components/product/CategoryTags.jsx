import React from 'react';
import { Card, Form } from 'react-bootstrap';

const CategoryTags = ({ category, setCategory, tags, setTags }) => {
  return (
    <Card className="mb-3 p-3">
      <h5>Category</h5>
      <Form.Group controlId="category" className="mb-3">
        <Form.Label>Product Category</Form.Label>
        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Apparel">Apparel</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="tags" className="mb-3">
        <Form.Label>Product Tags</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </Form.Group>
    </Card>
  );
};

export default CategoryTags;
