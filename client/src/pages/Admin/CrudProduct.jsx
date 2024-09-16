// CrudProduct.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from './redux/actions/productActions';
import Swal from 'sweetalert2';

const CrudProduct = ({ editingProduct, setEditingProduct }) => {
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: ''
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (editingProduct) {
            setForm({
                name: editingProduct.name,
                price: editingProduct.price,
                description: editingProduct.description,
                category: editingProduct.category,
                image: editingProduct.image
            });
        } else {
            setForm({
                name: '',
                price: '',
                description: '',
                category: '',
                image: ''
            });
        }
    }, [editingProduct]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await dispatch(updateProduct(editingProduct._id, form));
                Swal.fire('Updated!', 'Product updated successfully', 'success');
            } else {
                await dispatch(createProduct(form));
                Swal.fire('Created!', 'Product created successfully', 'success');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error!', 'Something went wrong', 'error');
        }
        setForm({ name: '', price: '', description: '', category: '', image: '' });
        setEditingProduct(null);
    };
    
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleInputChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleInputChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {editingProduct ? 'Update' : 'Create'} Product
                </button>
            </form>
        </div>
    );
};

export default CrudProduct;
