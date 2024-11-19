import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useProductListData } from "../redux/hooks";
import { updateInvoice } from '../redux/invoicesSlice'
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import { useCurrencyData } from '../redux/hooks'
import { setCurrencies } from "../redux/currenciesSlice"

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  // const [currencies, setCurrencies] = useState({})
  const dispatch = useDispatch();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const { currencies, selectedCurrency } = useCurrencyData()
  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };

  const handleConvert = (targetCurrency) => {
    const baseRate = currencies[targetCurrency];
    const targetRate = currencies[selectedCurrency];

    if (baseRate && targetRate) {
      const conversionRate = targetRate / baseRate;
      return conversionRate;
    }

    return 1; // Return 1 if either currency rate is not found, to avoid NaN prices
  };

  useEffect(() => {
    handleConvert(selectedCurrency); // Ensure conversion happens when selectedCurrency changes
  }, [selectedCurrency]);


  return (
    <Row>
      <Col className="mx-auto" xs={12}>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                </Link>

                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>

                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "50px",
                    }}
                  />
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total <span className="fw-light">({selectedCurrency})</span></th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => {
                    const conversionRate = handleConvert(invoice.currency).toFixed(2); // Declare outside the JSX

                    return (
                      <InvoiceRow
                        key={invoice.id}
                        invoice={invoice}
                        conversionRate={conversionRate} // Pass the conversion rate if needed
                        navigate={navigate}
                        selectedCurrency={selectedCurrency}
                      />
                    );
                  })}

                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({ invoice, navigate,conversionRate,selectedCurrency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const dispatch = useDispatch();
  const { getOneProduct, productList } = useProductListData();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const loadProducts = async () => {
      let subTotalValue = 0;
      const products = await Promise.all(
        invoice.itemIds.map(async id => {
          try {
            const product = await getOneProduct(id);
            // console.log(product)
            if (!product) {
              console.error(`Product with id ${id} returned null`);
              return null; // Handle the null case here
            }
            subTotalValue += parseFloat(product.itemPrice) * parseInt(product.itemQuantity);
            return product;
          } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error);
            return null; // Gracefully handle any error
          }
        })
      );


      const validProducts = products.filter(p => p !== null); // Filter out null products
      setItems(validProducts);

      if (validProducts.length > 0) {
        // Calculate tax, discount, and total if there are valid products
        const taxValue = parseFloat(subTotalValue * (invoice.taxRate / 100)).toFixed(2);
        const discountValue = parseFloat(subTotalValue * (invoice.discountRate / 100)).toFixed(2);
        const totalValue = (
          subTotalValue - parseFloat(discountValue) + parseFloat(taxValue)
        ).toFixed(2);

        setSubTotal(subTotalValue.toFixed(2));
        setTotal(totalValue);

        const updatedInvoice = {
          ...invoice,
          subTotal: subTotalValue.toFixed(2),
          total: totalValue
        };

        dispatch(updateInvoice({ id: invoice.id, updatedInvoice }));
      }
    };

    loadProducts();
  }, [invoice.itemIds]); // Dependencies




  return (
    <tr>
      <td>{invoice.invoiceNumber}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">

        {invoice.total* conversionRate}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total ,
          subTotal: invoice.subTotal ,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount ,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount ,
        }}
        items={items}
        itemIds={invoice.itemIds}
        currency={selectedCurrency}
        subTotal={invoice.subTotal }
        taxAmount={invoice.taxAmount }
        discountAmount={invoice.discountAmount }
        total={invoice.total}
        conversionRate={conversionRate}
      />
    </tr>
  );
};

export default InvoiceList;
