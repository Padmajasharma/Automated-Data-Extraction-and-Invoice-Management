import React from 'react';
import { Card, Form, InputGroup } from 'react-bootstrap';

const Pricing = ({ currency, onCurrencyChange, currencies, itemPrice, setitemPrice }) => {
  return (
    <Card className="mb-3 p-3">
      <h5>Pricing</h5>
      <Form.Group controlId="itemPrice" className="mb-3">
        <Form.Group className="mb-3">
          <Form.Label>Currency:</Form.Label>
          <Form.Select
            onChange={(event) => onCurrencyChange({ currency: event.target.value })}
            value={currency}
            className="btn btn-light my-1"
          >
            {Object.entries(currencies).map(([currencyCode]) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyCode}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Label>Base Pricing</Form.Label>
        <InputGroup>
          <InputGroup.Text>{currency}</InputGroup.Text>
          <Form.Control
            type="number"
            placeholder="120.00"
            value={itemPrice}
            onChange={(e) => setitemPrice(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
    </Card>
  );
};

export default Pricing;
