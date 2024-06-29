const showAlert = (message, type) => {
  const alertContainer = document.getElementById('alertContainer');
  const alertElement = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
  `;
  alertContainer.innerHTML = alertElement;
};

// Function to delete a product
const deleteProduct = async (productId) => {
  try {
      const accessToken = localStorage.getItem('accessToken'); // Retrieve access token

      const response = await fetch(`/product/`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ id: productId })
      });
      if (response.ok) {
          // Refresh the products table after deletion
          showAlert("Product deleted.", "success");
          fetchProducts();
      } else if (response.status === 401 || response.status === 403) {
          // Show unauthorized alert
          showAlert("You don't have permission to delete this product.", "danger");
      } else {
          console.error('Failed to delete product');
      }
  } catch (error) {
      console.error('Error deleting product:', error);
  }
};

const openUpdateModal = (productId, productName, productDescription, productCategory, productPrice) => {
  const accessToken = localStorage.getItem('accessToken');
  const decodedToken = decodeToken(accessToken); // Use the decodeToken function
  if (!accessToken || !decodedToken) {
      showAlert("You don't have permission to update products.", "danger");
      return;
  }
  document.getElementById('updateProductId').value = productId;
  document.getElementById('updateProductName').value = productName;
  document.getElementById('updateProductDescription').value = productDescription;
  document.getElementById('updateProductCategory').value = productCategory;
  document.getElementById('updateProductPrice').value = productPrice;

  const updateModal = new bootstrap.Modal(document.getElementById('updateProductModal'));
  updateModal.show();
};

const handleUpdateProductSubmit = async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  const form = document.getElementById('updateProductForm');
  const productId = form.querySelector('#updateProductId').value; // Get product ID from the form

  const formData = new FormData(form);
  formData.append('id', productId); // Append product ID to the form data

  try {
      const accessToken = localStorage.getItem('accessToken'); // Retrieve access token

      const response = await fetch(`/product/`, {
          method: 'PATCH',
          headers: {
              'Authorization': `Bearer ${accessToken}` // Include access token in headers
          },
          body: formData
      });

      if (response.ok) {
          // Close the modal after successful update
          const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateProductModal'));
          updateModal.hide();
          
          // Redirect to the main page after update
          window.location.href = '/data-entry'; // Ensure only this URL is used
          showAlert("Product updated.", "success");
      } else if (response.status === 401 || response.status === 403) {
          // Show unauthorized alert
          showAlert("You don't have permission to update this product.", "danger");
      } else {
          console.error('Failed to update product');
      }
  } catch (error) {
      console.error('Error updating product:', error);
  }
};

// Attach the event listener to the update form
document.addEventListener('DOMContentLoaded', function() {
  const updateProductForm = document.getElementById('updateProductForm');
  updateProductForm.addEventListener('submit', handleUpdateProductSubmit);
});

const handleCreateProductSubmit = async (product) => {
  product.preventDefault(); // Prevent the default form submission behavior
  const form = document.getElementById('createProductForm');
  const formData = new FormData(form);

  try {
      const accessToken = localStorage.getItem('accessToken'); // Retrieve access token

      const response = await fetch('/product', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${accessToken}`
          },
          body: formData
      });

      if (response.ok) {
          // Close the modal after successful creation
          const createModal = bootstrap.Modal.getInstance(document.getElementById('createProductModal'));
          createModal.hide();
          showAlert("Product created.", "success");
          
          // Redirect to the main page after creation
          window.location.href = '/data-entry'; // Ensure only this URL is used
      } else if (response.status === 401 || response.status === 403) {
          // Show unauthorized alert
          showAlert("You don't have permission to create a product.", "danger");
      } else {
          console.error('Failed to create product');
      }
  } catch (error) {
      console.error('Error creating product:', error);
  }
};

// Attach the event listener to the create form
document.addEventListener('DOMContentLoaded', function() {
  const createProductForm = document.getElementById('createProductForm');
  createProductForm.addEventListener('submit', handleCreateProductSubmit);
});

// Function to fetch products data from backend
const fetchProducts = async () => {
  try {
      const accessToken = localStorage.getItem('accessToken'); // Retrieve access token

      const response = await fetch('/product', {
          headers: {
              'Authorization': `Bearer ${accessToken}` // Include access token in headers
          }
      });

      if (response.ok) {
          const products = await response.json();
          const productsBody = document.getElementById('productsBody');
          productsBody.innerHTML = ''; // Clear existing data
          products.forEach(product => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td><img src="data:${product.productImg.contentType};base64,${product.productImg.data}" alt="Product Image" style="max-width: 150px;"></td>
                  <td>${product.productName}</td>
                  <td>${product.productDescription}</td>
                  <td>${product.productCategory}</td>
                  <td>$${product.productPrice}</td>
                  <td>
                      <i class="fa-solid fa-trash btn btn-danger fa-1x" style="cursor: pointer;" onclick="deleteProduct('${product._id}')"></i>
                      <i class="fa-solid fa-pen-to-square btn btn-primary" style="cursor: pointer;" onclick="openUpdateModal('${product._id}', '${product.productName}', '${product.productDescription}', '${product.productCategory}', '${product.productPrice}')"></i>
                  </td>
              `;
              productsBody.appendChild(row);
          });
      } else {
          if (response.status === 400) {
              // Clear products table since no products are available
              document.getElementById('productsBody').innerHTML = '';
          } else {
              console.error('Failed to fetch products:', response.statusText);
          }
      }
  } catch (error) {
      console.error('Error fetching products:', error);
  }
};

// Initial fetch of products
fetchProducts();

// Function to decode a JWT token
const decodeToken = (token) => {
  try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
  } catch (error) {
      console.error('Error decoding token:', error);
      return null;
  }
};

function logoutAndRedirect() {
  // Clear the access token from local storage
  localStorage.removeItem('accessToken');
  
  // Redirect to the /auth page
  window.location.href = '/auth';
};
