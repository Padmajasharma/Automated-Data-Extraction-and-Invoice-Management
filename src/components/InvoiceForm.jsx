import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { BiArrowBack } from "react-icons/bi";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch } from "react-redux";
import { addInvoice, updateInvoice } from "../redux/invoicesSlice";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData } from "../redux/hooks";
import { useProductListData } from "../redux/hooks"
import { addProduct, deleteProduct, updateProduct } from "../redux/productsSlice"
import { useCurrencyData } from '../redux/hooks'




const InvoiceForm = () => {
  const dispatch = useDispatch();
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCopy = location.pathname.includes("create");
  const isEdit = location.pathname.includes("edit");
  const { getOneProduct } = useProductListData();
  const { currencies, selectedCurrency } = useCurrencyData();
  const [currency, setCurrency] = useState('INR');

  const [isOpen, setIsOpen] = useState(false);
  const [copyId, setCopyId] = useState("");
  const { getOneInvoice, listSize, invoiceList } = useInvoiceListData();
  const { productList } = useProductListData();

  const [formData, setFormData] = useState(
    isEdit
      ? getOneInvoice(id)
      : isCopy && id
        ? {
          ...getOneInvoice(id),
          id: generateRandomId(),
          invoiceNumber: listSize + 1,
        }
        : {
          id: generateRandomId(),
          currentDate: new Date().toLocaleDateString(),
          invoiceNumber: listSize + 1,
          dateOfIssue: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          notes: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "",
          taxAmount: "0.00",
          discountRate: "",
          discountAmount: "0.00",
          currency: selectedCurrency,
          items: [
            {
              id: generateRandomId(),
              itemName: "",
              itemDescription: "",
              itemPrice: 1.00,
              itemQuantity: 1,
              category: "",
              images: ["https://picsum.photos/200"],
              tags: "",
              currency: "INR"
            },
          ],
          itemIds: [],
        }
  );
  

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await Promise.all(
          formData.itemIds.map(id => getOneProduct(id)) // Fetch products concurrently
        );

        // Map product IDs for updating itemIds
        const itemIds = products.map(product => product.id);

        // Update formData with new products and itemIds
        setFormData(prevFormData => {
          setCurrency(prevFormData.currency)
          return (({
            ...prevFormData,
            items: products, // Directly set the fetched products
            itemIds, // Update itemIds based on fetched products

          }))
        });
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    // Only call loadProducts if there are itemIds to fetch and a valid id
    if (formData.itemIds.length > 0 && id) {
      loadProducts();
    }
  }, [formData.item, selectedCurrency]); // Ensure that useEffect runs only when itemIds, id, or currency changes



  const handleRowDel = (itemToDelete) => {
    const updatedItems = formData.items.filter(
      (item) => item.id !== itemToDelete.id
    );
    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();
  };

  const handleAddEvent = () => {
    const id = generateRandomId();
    const newItem = {
      id: id,
      itemName: "",
      itemDescription: "",
      itemPrice: 1.00,
      itemQuantity: 1,
      category: "",
      images: ["https://picsum.photos/200"],
      tags: "",
      currency: currency
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
    handleCalculateTotal();
  };

  const handleCalculateTotal = () => {
    setFormData((prevFormData) => {
      let subTotal = 0;

      prevFormData.items.forEach((item) => {
        subTotal +=
          parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
      });

      const taxAmount = parseFloat(
        subTotal * (prevFormData.taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData.discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };
    });
  };

  const onItemizedItemEdit = (evt, itemId) => {
    const { name, value } = evt.target;
    console.log("triggred", evt.target)

    setFormData(prevFormData => {
      const updatedItems = prevFormData.items.map((oldItem) => {
        if (oldItem.id === itemId) {
          return { ...oldItem, [name]: value };
        }
        return oldItem;
      });

      // Ensure `itemIds` are updated correctly, especially if itemId was previously not in the list
      const updatedItemIds = [...prevFormData.itemIds];
      if (!updatedItemIds.includes(itemId)) {
        updatedItemIds.push(itemId); // Add the updated itemId
      }

      return {
        ...prevFormData,
        items: updatedItems,
        itemIds: updatedItemIds, // Ensure itemIds are consistently updated
      };
    });

    handleCalculateTotal(); // Recalculate total after edit
  };


  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    handleCalculateTotal();
  };

  const onCurrencyChange = (selectedOption) => {
    setFormData({ ...formData, currency: selectedOption.currency });
    setCurrency(selectedOption.currency)

  };

  const openModal = (event) => {

    event.preventDefault();

    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddInvoice = async () => {
    try {
      const form = await uploadData();  // Ensure all data is uploaded before proceeding
      console.log(form)
      if (isEdit) {
        await dispatch(updateInvoice({ id, updatedInvoice: form }));
        alert("Invoice updated successfully 🥳");
      } else if (isCopy) {
        await dispatch(addInvoice({ id: generateRandomId(), ...form }));
        alert("Invoice copied successfully 🥳");
      } else {
        await dispatch(addInvoice(form));
        alert("Invoice added successfully 🥳");
      }

      navigate("/products");
    } catch (error) {
      console.error("Failed to add or update invoice:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCopyInvoice = () => {
    const recievedInvoice = getOneInvoice(copyId);
    if (recievedInvoice) {
      setFormData({
        ...recievedInvoice,
        id: formData.id,
        invoiceNumber: formData.invoiceNumber,
      });
    } else {
      alert("Invoice does not exists!!!!!");
    }
  };
  const itemIds = [];

  const uploadData = async () => {
    if (!formData || !productList) {
      console.error("Form data or product list is not available");
      return;
    }

    const updatedItems = []; // Temporary array for updated items
    let updatedItemIds = [...formData.itemIds]; // Temporary array for updating itemIds

    // Loop through form items
    for (const item of formData.items) {
      if (!item.itemName || !item.itemPrice) {
        console.error("Invalid item data", item);
        continue;
      }

      const matchedProduct = productList.find(product =>
        product.itemName.toLowerCase().trim() === item.itemName.toLowerCase().trim()
      );

      if (matchedProduct) {
        const updatedProduct = {
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          itemPrice: item.itemPrice,
          itemQuantity: item.itemQuantity,
          images: item.images || [],
          tags: "",
          category: "",
          id: matchedProduct.id, // Use the matched product's ID
          currency: currency

        };

        const userConfirmed = window.confirm(
          `${matchedProduct.itemName} already exists. Do you want to update the existing product?`
        );

        if (userConfirmed) {
          await dispatch(updateProduct({ id: matchedProduct.id, updatedProduct: updatedProduct }));

          // Replace the old item ID with the matched product's ID
          updatedItemIds = updatedItemIds.filter(id => id !== item.id);
          updatedItemIds.push(matchedProduct.id);

          // Add the matched product to the updated items array
          updatedItems.push(updatedProduct);
        } else {
          updatedItems.push(item); // If not updating, keep the old item
        }
      } else {
        // If no match, add a new product
        const newProduct = {
          id: item.id, // Use item's own ID
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          itemPrice: item.itemPrice,
          itemQuantity: item.itemQuantity,
          images: item.images || ["https://picsum.photos/200"],
          tags: "",
          category: "",
          currency: currency
        };

        await dispatch(addProduct(newProduct));

        // Add the new product's ID to itemIds
        updatedItemIds.push(item.id);

        // Add the new product to the updated items array
        updatedItems.push(newProduct);
      }
    }
    const uniqueUpdatedItemIds = [...new Set(updatedItemIds)]

    // Wait for the formData to update with the new items and itemIds before proceeding
    const updatedFormData = await new Promise((resolve) => {
      setFormData(prevFormData => {
        const updatedFormData = {
          ...prevFormData,
          items: updatedItems, // Updated items array
          itemIds: uniqueUpdatedItemIds, // Updated itemIds array
        };
        resolve(updatedFormData); // Resolve the promise with updated formData
        return updatedFormData;
      });
    });

    return updatedFormData
    // Now, updatedFormData has the most recent state
    console.log("Updated Item IDs:", updatedItemIds);
    console.log("Updated Items:", updatedItems);
    console.log("After updating the form", updatedFormData);

    // Proceed with the rest of the logic using updatedFormData
  };





  return (
    <Form onSubmit={openModal}>
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>

      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{formData.currentDate}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control
                    type="date"
                    value={formData.dateOfIssue}
                    name="dateOfIssue"
                    onChange={(e) => editField(e.target.name, e.target.value)}
                    style={{ maxWidth: "150px" }}
                    required
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control
                  type="number"
                  value={formData.invoiceNumber}
                  name="invoiceNumber"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  min="1"
                  style={{ maxWidth: "70px" }}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice to?"
                  rows={3}
                  value={formData.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData.billToEmail}
                  type="email"
                  name="billToEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice from?"
                  rows={3}
                  value={formData.billFrom}
                  type="text"
                  name="billFrom"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData.billFromEmail}
                  type="email"
                  name="billFromEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData.billFromAddress}
                  type="text"
                  name="billFromAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
            </Row>
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={formData.currency}
              items={formData.items}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {formData.subTotal}&nbsp;
                    {formData.currency}

                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">
                      ({formData.discountRate || 0}%)&nbsp;
                    </span>

                    {formData.discountAmount || 0}&nbsp;
                    {formData.currency}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({formData.taxRate || 0}%)</span>&nbsp;

                    {formData.taxAmount || 0}&nbsp;
                    {formData.currency}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{ fontSize: "1.125rem" }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {formData.total || 0}&nbsp;{formData.currency}
                  </span>


                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={formData.notes}
              onChange={(e) => editField(e.target.name, e.target.value)}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              variant="dark"
              onClick={handleAddInvoice}
              className="d-block w-100 mb-2"
            >
              {isEdit ? "Update Invoice" : "Add Invoice"}
            </Button>
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                isOpen,
                id: formData.id,
                currency: formData.currency,
                currentDate: formData.currentDate,
                invoiceNumber: formData.invoiceNumber,
                dateOfIssue: formData.dateOfIssue,
                billTo: formData.billTo,
                billToEmail: formData.billToEmail,
                billToAddress: formData.billToAddress,
                billFrom: formData.billFrom,
                billFromEmail: formData.billFromEmail,
                billFromAddress: formData.billFromAddress,
                notes: formData.notes,
                total: formData.total,
                subTotal: formData.subTotal,
                taxRate: formData.taxRate,
                taxAmount: formData.taxAmount,
                discountRate: formData.discountRate,
                discountAmount: formData.discountAmount,
              }}
              items={formData.items}
              itemIds={formData.itemIds}
              currency={formData.currency}
              subTotal={formData.subTotal}
              taxAmount={formData.taxAmount}
              discountAmount={formData.discountAmount}
              total={formData.total}
              conversionRate={1}
            />
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) =>
                  onCurrencyChange({ currency: event.target.value })
                }
                className="btn btn-light my-1"
                aria-label="Change Currency"
                value={currency}
              >
                {Object.entries(currencies).map(([currencyCode, rate]) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode} (Rate: {rate.toFixed(4)})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={formData.discountRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Control
              placeholder="Enter Invoice ID"
              name="copyId"
              value={copyId}
              onChange={(e) => setCopyId(e.target.value)}
              type="text"
              className="my-2 bg-white border"
            />
            <Button
              variant="primary"
              onClick={handleCopyInvoice}
              className="d-block"
            >
              Copy Old Invoice
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;
