import React from 'react';
import { Form,Card } from 'react-bootstrap';
import { BiTrash } from "react-icons/bi";
import { BsUpload } from 'react-icons/bs';

const MediaUpload = ({ images, handleImageUpload, handleRemoveImage, handleDragOver, handleDragLeave, handleDrop }) => {
  return (
    <Card className="mb-3 p-3">
      <h5>Product Media</h5>
      <Form.Group controlId="productImages" className="mb-3">
        <Form.Label>Product Image</Form.Label>
        <div
          className="image-upload-container p-4 text-center border border-dashed rounded mb-3"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ background: "#e2e6f5" }}
        >
          <div className="d-flex flex-column align-items-center">
          <BsUpload style={{ fontSize: '24px', color: '#243ee3' }} />
            <Form.Label className="d-block text-muted mt-2" style={{ cursor: 'pointer' }}>
              Click to upload or drag and drop
            </Form.Label>
          </div>
          <Form.Control type="file" multiple onChange={handleImageUpload} className="d-none" />
        </div>
        <div className="mt-3 d-flex flex-wrap">
          {images.slice(0, 3).map((image, index) => (
            <div key={index} className="me-2 mb-2 position-relative image-container">
              <img
                src={image}
                alt="Product"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <BiTrash
                onClick={() => handleRemoveImage(index)}
                style={{ height: "25px", width: "25px", padding: "4.5px" }}
                className="position-absolute top-0 end-0 icon-btn text-white mt-1 btn btn-danger"
              />
            </div>
          ))}
        </div>
      </Form.Group>
    </Card>
  );
};

export default MediaUpload;
