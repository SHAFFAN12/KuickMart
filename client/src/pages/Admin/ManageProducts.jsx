import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, createProduct, updateProduct, deleteProduct } from './redux/actions/productActions';
import Swal from 'sweetalert2';
import axios from 'axios';

const ManageProducts = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList || {});
  const { loading = false, products = [], error = null } = productList;

  const productCreate = useSelector((state) => state.productCreate || {});
  const { success: successCreate } = productCreate;

  const productUpdate = useSelector((state) => state.productUpdate || {});
  const { success: successUpdate } = productUpdate;

  const productDelete = useSelector((state) => state.productDelete || {});
  const { success: successDelete } = productDelete;

  const userInfo = useSelector((state) => state.userInfo || {}); // Make sure to get user info from your state

  const [editProduct, setEditProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    console.log('Fetching product list...');
    dispatch(listProducts());
  }, [dispatch, successCreate, successUpdate, successDelete]);

  const handleCreateProduct = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Product',
      html: `
        <input id="name" class="swal2-input" placeholder="Product Name">
        <input id="price" type="number" class="swal2-input" placeholder="Product Price">
        <input id="description" class="swal2-input" placeholder="Product Description">
        <input id="category" class="swal2-input" placeholder="Product Category">
        <input id="image" type="file" class="swal2-input" placeholder="Product Image">
      `,
      confirmButtonText: 'Create Product',
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const price = Swal.getPopup().querySelector('#price').value;
        const description = Swal.getPopup().querySelector('#description').value;
        const category = Swal.getPopup().querySelector('#category').value;
        const imageFileInput = Swal.getPopup().querySelector('#image').files[0];
        
        if (!name || !price || !description || !category) {
          Swal.showValidationMessage(`Please enter all fields`);
          return;
        }
        return { name, price, description, category, imageFile: imageFileInput };
      },
    });

    if (formValues) {
      const formData = new FormData();
      formData.append('name', formValues.name);
      formData.append('price', formValues.price);
      formData.append('description', formValues.description);
      formData.append('category', formValues.category);
      if (formValues.imageFile) formData.append('image', formValues.imageFile);

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${JSON.parse(localStorage.getItem('adminInfo')).token}`, // Use Bearer token if required
          },
        };
        await axios.post('http://localhost:5000/api/products', formData, config);
        dispatch(createProduct(formData));
        Swal.fire('Product Created!', '', 'success');
      } catch (error) {
        console.error('Error creating product:', error);
        Swal.fire('Error!', 'There was an issue creating the product.', 'error');
      }
    }
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    Swal.fire({
      title: 'Edit Product',
      html: `
        <input id="name" class="swal2-input" value="${product.name}" placeholder="Product Name">
        <input id="price" type="number" class="swal2-input" value="${product.price}" placeholder="Product Price">
        <input id="description" class="swal2-input" value="${product.description}" placeholder="Product Description">
        <input id="category" class="swal2-input" value="${product.category}" placeholder="Product Category">
        <input id="image" type="file" class="swal2-input" placeholder="Product Image">
      `,
      confirmButtonText: 'Update Product',
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const price = Swal.getPopup().querySelector('#price').value;
        const description = Swal.getPopup().querySelector('#description').value;
        const category = Swal.getPopup().querySelector('#category').value;
        const imageFileInput = Swal.getPopup().querySelector('#image').files[0];
        
        if (!name || !price || !description || !category) {
          Swal.showValidationMessage(`Please enter all fields`);
          return;
        }
        return { name, price, description, category, imageFile: imageFileInput };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('name', result.value.name);
        formData.append('price', result.value.price);
        formData.append('description', result.value.description);
        formData.append('category', result.value.category);
        if (result.value.imageFile) formData.append('image', result.value.imageFile);

        // Log FormData contents for debugging
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        try {
          await dispatch(updateProduct(product._id, formData));
          Swal.fire('Product Updated!', '', 'success');
        } catch (error) {
          console.error('Error updating product:', error);
          Swal.fire('Error!', 'There was an issue updating the product.', 'error');
        }
      }
    });
  };

  const handleDelete = (id) => {
    console.log('Deleting product with ID:', id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(id));
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <button
        onClick={handleCreateProduct}
        className="p-2 text-white bg-green-500 rounded mb-6"
      >
        Create Product
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {products.map((product) => (
          <li key={product._id} className="mb-4 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700">Price: ${product.price}</p>
            <p className="text-gray-700">Description: {product.description}</p>
            <p className="text-gray-700">Category: {product.category}</p>
            <p className="text-gray-700">Image: <a href={product.image} target="_blank" rel="noopener noreferrer">View Image</a></p>
            <button
              onClick={() => handleEdit(product)}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product._id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
