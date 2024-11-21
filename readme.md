# Automated Data Extraction and Invoice Management  

This project streamlines product management and invoice creation by integrating advanced features like Redux store management, currency conversion, automatic product population, and seamless invoice-product integration.  

## **Features**  

### **1. Product Tab**  
- **Redux Integration:** Efficiently manages the product list.  
- **Search and Filter:** Products can be filtered by name or description.  
- **Currency Conversion:** Supports currency conversion from the base to the target currency.  

### **2. Product Form**  
- Allows uploading up to **3 images** per product.  
- All fields are mandatory to ensure data consistency.  
- Automatically checks for existing products by name or ID.  

### **3. Automatic Product Population**  
- Pre-fills the form if a product already exists, allowing for easy updates.  
- Ensures changes to products are reflected globally.  

### **4. Invoice and Product Integration**  
- Links invoices with product details for seamless updates.  
- Automatically updates invoice details when a product is modified.  
- Stores product references using **item IDs** for efficient querying.  

### **5. Currency State Management**  
- **Local State:** Used during product or invoice creation.  
- **Global State:** Used for broader currency conversions to avoid conflicts.  

---

## **Development Tools**  

- **Continue VS Code Extension:** For efficient coding and debugging.  
- **Ollama Web UI:** For documentation search and development assistance.  
- **ClaudeAI & ChatGPT:** Assisted in converting designs to UI and logic refinement.  

---

## **Learning Curve & Development Process**  

- **Bootstrap:** First-time integration with the framework.  
- **Image-to-Code Conversion:** Process streamlined to 30–50 minutes per component.  
- **Redux Integration:** Store management and edge-case handling took ~2 hours.  
- **Documentation & Video Editing:** Completed within 2 hours.  
- **Total Development Time:** 8–12 hours, focusing on logic optimization and edge-case handling.  

---

## **Component Tree**  

<div align="center">
  <img src="public/tree.png" alt="Component Tree" />
</div>

---

## **Folder Structure**  

```bash
|-- swipe-assignment-frontend
    |-- public
        |-- favicon.ico
        |-- index.html
        |-- manifest.json
        |-- robots.txt
    |-- .gitignore
    |-- package-lock.json
    |-- package.json
    |-- src
        |-- utils
            |-- generateRandomId.js
        |-- components
            |-- InvoiceModal.jsx
            |-- EditableField.jsx
            |-- product
                |-- ProductForm.jsx
                |-- MediaUpload.jsx
                |-- ProductItem.jsx
                |-- CategoryTags.jsx
                |-- GeneralInfo.jsx
                |-- Pricing.jsx
            |-- Sidebar.jsx
            |-- InvoiceForm.jsx
            |-- InvoiceItem.jsx
        |-- pages
            |-- Invoice.jsx
            |-- InvoiceList.jsx
            |-- ProductList.jsx
        |-- redux
            |-- currenciesSlice.js
            |-- invoicesSlice.js
            |-- hooks.js
            |-- index.js
            |-- productsSlice.js
        |-- App.js
        |-- App.css
        |-- index.js
        |-- index.css
        |-- reportWebVitals.js
|-- test.py
|-- package-lock.json
|-- package.json
```

---

## **Extension: Orian (Ollama WebUI)**  

Orian is a Chrome extension offering quick access to your local Language Model (LLM).  
### **Key Features**:  
- Open-source chat integration.  
- AI-powered email reply suggestions.  
- Enhanced browsing experience through advanced AI capabilities.  


---

Feel free to use this structure or suggest edits if you’d like further customization!
