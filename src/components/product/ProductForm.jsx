import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../../redux/productsSlice";
import { BiArrowBack } from "react-icons/bi";
import { BsPlusLg } from 'react-icons/bs';
import { BsPencilSquare } from 'react-icons/bs'

import { Link, useParams, useNavigate } from "react-router-dom";
import { useProductListData, useCurrencyData } from "../../redux/hooks";
import GeneralInfo from './GeneralInfo';
import MediaUpload from './MediaUpload';
import Pricing from './Pricing';
import CategoryTags from './CategoryTags';
import { v4 as uuidv4 } from 'uuid';

const ProductForm = () => {
  const [itemName, setitemName] = useState('');
  const [itemDescription, setitemDescription] = useState('');
  const [itemPrice, setitemPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [itemId, setitemId] = useState('');
  const [itemQuantity, setitemQuantity] = useState(1);
  const [currency, setCurrency] = useState('INR');
  const [isEditing, setIsEditing] = useState(false);
  let { id } = useParams();
  const [currentitemId, setCurrentitemId] = useState(id);
  const { currencies } = useCurrencyData();
  const { getOneProduct, productList } = useProductListData();
  const dispatch = useDispatch();
  const navigate = useNavigate();



  // Handle currency change when a new option is selected
  const onCurrencyChange = (selectedOption) => {
    setCurrency(selectedOption.currency);
  };

  // Handle removing an image by index
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // Handle drag-over event (adds blur effect)
  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  // Handle when drag leaves the container (removes blur effect)
  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove('drag-over');
  };

  // Handle drop event (removes blur effect and uploads files)
  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    const files = Array.from(event.dataTransfer.files);
    handleImageUpload({ target: { files } });
  };

  // Handle image upload either from input or drag-and-drop
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    if (images.length + files.length <= 3) {
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setImages(prevImages => [...prevImages, ...imageUrls]);
    } else {
      alert("You can't upload more than 3 images");
    }
  };

  // Handle adding or updating a product using form data
  const addOrUpdateProduct = () => {
    if (!itemName || !itemDescription || !itemPrice) {
      alert("Please fill in all required fields.");
      return;
    }

    // Use default image if no images are uploaded
    const productImages = images.length === 0 ? ["https://picsum.photos/200"] : images;

    const productData = {
      itemName,
      itemDescription,
      itemPrice,
      category,
      tags,
      itemQuantity,
      images: productImages,
      currency,
    };
    console.log(productData);

    // If editing mode is active, update the product
    if (isEditing && currentitemId) {
      console.log("Updating product with ID:", currentitemId);
      console.log(productData);

      try {
        dispatch(updateProduct({ id: currentitemId, updatedProduct: productData }));
        alert("Product updated successfully");
        navigate("/products", { replace: true });
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please try again.");
      }

      return;
    }

    // Check if a product with the same name already exists
    const existingProduct = productList.find(
      (product) => product.itemName.toLowerCase().trim() === itemName.toLowerCase().trim()
    );
    console.log(existingProduct);

    if (existingProduct) {
      const userConfirmed = window.confirm(
        "This product already exists. Do you want to edit the existing product details?"
      );

      if (userConfirmed) {
        // Populate the form with the existing product data for editing
        setitemName(existingProduct.itemName);
        setitemDescription(existingProduct.itemDescription);
        setitemPrice(existingProduct.itemPrice);
        setCategory(existingProduct.category);
        setTags(existingProduct.tags);
        setitemQuantity(existingProduct.itemQuantity);
        setImages(existingProduct.images);
        setCurrency(existingProduct.currency);
        setCurrentitemId(existingProduct.id);
        setIsEditing(true);
      } else {
        console.log("Edit action canceled.");
      }

      return;
    }

    // Add a new product with a unique ID
    const newProductData = { ...productData, id: uuidv4() };

    try {
      dispatch(addProduct(newProductData));
      alert("Product added successfully");
      navigate("/products", { replace: true });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  // Fetch product details for editing based on the URL parameter (id)
  useEffect(() => {
    if (id) {
      const product = getOneProduct(id);
      console.log(product);
      setIsEditing(true);

      if (product) {
        setitemName(product.itemName);
        setitemDescription(product.itemDescription);
        setitemPrice(product.itemPrice);
        setCategory(product?.category);
        setTags(product.tags);
        setCurrency(product.currency);
        setitemId(product.itemId);
        setitemQuantity(product.itemQuantity);
        setImages(product.images);
        setCurrency(product.currency);
      }
      return;
    }
  }, [id]);

  return (
    <Form className="container mt-4">
      <div className="d-flex align-items-center mb-5">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/products">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>

      <Row>
        <Col md={9}>
          <GeneralInfo
            itemName={itemName}
            setitemName={setitemName}
            itemId={itemId}
            setitemId={setitemId}
            itemDescription={itemDescription}
            setitemDescription={setitemDescription}
          />
          <MediaUpload
            images={images}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
          />
        </Col>
        <Col md={3}>
          <div className="mb-3 d-grid gap-2">
            <Button
              variant="primary"
              className="d-flex align-items-center justify-content-center"
              onClick={addOrUpdateProduct}
            >

              {isEditing ? (
                <>
                  <BsPencilSquare className="me-2" />
                  Update Product
                </>
              ) : (
                <>
                  <BsPlusLg className="me-2" />
                  Add Product
                </>
              )}
            </Button>
          </div>
          <Pricing
            currency={currency}
            onCurrencyChange={onCurrencyChange}
            currencies={currencies}
            itemPrice={itemPrice}
            setitemPrice={setitemPrice}
          />
          <CategoryTags
            category={category}
            setCategory={setCategory}
            tags={tags}
            setTags={setTags}
          />
        </Col>
      </Row>


    </Form>
  );
};

export default ProductForm;
