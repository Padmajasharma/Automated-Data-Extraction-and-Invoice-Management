import React, { useEffect, useState, useMemo } from 'react';
import ProductItem from '../components/product/ProductItem';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { useProductListData } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { useCurrencyData } from '../redux/hooks';
import _ from 'lodash'; // For debouncing user input
import { BsPlusLg } from 'react-icons/bs';
const ProductList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const { currencies, selectedCurrency } = useCurrencyData(); // Currency data from Redux store
  const { productList } = useProductListData(); // Product data from Redux store

  // Debounced search handler to optimize input handling
  const handleSearch = _.debounce((event) => {
    setSearchQuery(event.target.value);
  }, 0);

  // Handle currency conversion based on selected currency
  const handleConvert = (targetCurrency) => {
    const baseRate = currencies[targetCurrency];
    const targetRate = currencies[selectedCurrency];

    if (baseRate && targetRate) {
      const conversionRate = targetRate / baseRate; // Calculate conversion rate
      return conversionRate;
    }

    return 1; // Return 1 if either currency rate is not found, to avoid NaN prices
  };

  // Trigger currency conversion whenever selectedCurrency changes
  useEffect(() => {
    handleConvert(selectedCurrency);
  }, [selectedCurrency]);

  // Filtered products based on search query
  const filteredProducts = useMemo(() => {
    if (!productList) return [];

    return productList.filter(product => {
      const keywords = [product.itemName, product.itemDescription];
      return keywords.some(keyword =>
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [productList, searchQuery]);

  return (
    <div>
      <div className="mb-3 d-flex justify-content-end align-items-center gap-2">
        {/* Search Bar */}
        <Form.Control
          type="text"
          placeholder="Search for a product..."
          style={{ width: '200px' }}
          className="border border-1 rounded"
          onChange={handleSearch}
        />

        {/* Add Product Button */}
        <Button variant="primary" onClick={() => navigate('/addproduct')}>
        <BsPlusLg className="me-2" />
          Add Product
        </Button>
      </div>

      {/* Table Header */}
      <Card className="my-3">
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={2}><h6>Image</h6></Col>
            <Col xs={4}><h6>Details</h6></Col>
            <Col xs={2}>
              <h6>Price</h6>
              <span>({selectedCurrency})</span>
            </Col>
            <Col xs={3} className="text-center"><h6>Actions</h6></Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Render Filtered Products */}
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => {
          const convertedPrice = (product.itemPrice * handleConvert(product.currency)).toFixed(2); // Convert and format price

          return (
            <ProductItem
              key={product.id}
              name={product.itemName}
              price={convertedPrice} // Ensure price is formatted correctly
              description={product.itemDescription}
              image={product.images[0] || 'default-image.png'} // Provide fallback for image
              productID={product.productID}
              id={product.id}
              itemId={product.itemId}
            />
          );
        })
      ) : (
        <p>No products found matching your search.</p>
      )}
    </div>
  );
};

export default ProductList;
