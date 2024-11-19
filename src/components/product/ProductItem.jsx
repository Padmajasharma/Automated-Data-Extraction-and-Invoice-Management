import React from 'react';
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { deleteProduct } from '../../redux/productsSlice';
import { useDispatch } from 'react-redux';
import { BiTrash, BiSolidPencil } from "react-icons/bi";

const ProductItem = ({ image, name, description, price, productID, id }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle product edit navigation
    const handleProductEdit = () => {
        navigate(`product/edit/${id}`); // Navigate to the edit page for the product
    };

    // Handle product deletion
    const handleDeleteProduct = () => {
        dispatch(deleteProduct(id)); // Dispatch action to delete product from the store
    };

    const MAX_DESCRIPTION_LENGTH = 50; // Define maximum length for product description

    // Truncate the product description if it exceeds the maximum length
    const truncateDescription = (desc = '') =>
        desc.length > MAX_DESCRIPTION_LENGTH 
            ? desc.substring(0, MAX_DESCRIPTION_LENGTH) + '...' // Add ellipsis if truncated
            : desc;

    return (
        <Card className="my-3 hover-card"> {/* Card component for each product */}
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={2}>
                        {/* Product image */}
                        <Image 
                            src={image} 
                            rounded 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                        />
                    </Col>
                    <Col xs={4}>
                        <div className="d-flex flex-column justify-content-center align-items-start">
                            <h5>{name}</h5> {/* Product name */}
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                                {truncateDescription(description)} {/* Truncated product description */}
                            </p>
                        </div>
                    </Col>
                    <Col xs={2}>
                        <h6>{parseFloat(price).toFixed(2)}</h6> {/* Product price formatted to two decimal places */}
                    </Col>
                    <Col xs={3} className="">
                        <div className="text-center d-flex align-items-center justify-content-center gap-2" style={{ minWidth: "50px" }}>
                            {/* Delete button */}
                            <BiTrash
                                onClick={handleDeleteProduct}
                                style={{ height: "33px", width: "33px", padding: "7.5px" }}
                                className="text-white mt-1 btn btn-danger"
                            />
                            {/* Edit button */}
                            <Button variant="outline-primary" onClick={handleProductEdit}>
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    <BiSolidPencil />
                                </div>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default ProductItem;
