import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axiosInstance from '../../adminaxios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/categories', { name: categoryName });
            setCategoryName('');
            fetchCategories();
            Swal.fire('Success', 'Category created successfully', 'success');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error creating category', 'error');
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (!editingCategory) return;

        try {
            await axiosInstance.put(`/categories/${editingCategory._id}`, { name: categoryName });
            setCategoryName('');
            setEditingCategory(null);
            fetchCategories();
            Swal.fire('Success', 'Category updated successfully', 'success');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error updating category', 'error');
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axiosInstance.delete(`/categories/${id}`);
            fetchCategories();
            Swal.fire('Success', 'Category deleted successfully', 'success');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error deleting category', 'error');
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Categories</h1>

            <form
                onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="mb-6 flex items-center space-x-4"
            >
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Category Name"
                    className="border border-gray-300 p-2 rounded-lg w-full"
                    required
                />
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 ${
                        editingCategory ? 'bg-green-500 hover:bg-green-600' : ''
                    }`}
                >
                    {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
            </form>

            <ul className="space-y-2">
                {categories.map((category) => (
                    <li
                        key={category._id}
                        className="flex items-center justify-between border border-gray-300 p-3 rounded-lg bg-white shadow-sm"
                    >
                        <span className="text-gray-800">{category.name}</span>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setCategoryName(category.name);
                                    setEditingCategory(category);
                                }}
                                className="text-blue-500 hover:text-blue-700 transition duration-300"
                            >
                                <FaEdit className="text-lg" />
                            </button>
                            <button
                                onClick={() =>
                                    Swal.fire({
                                        title: 'Are you sure?',
                                        text: 'You won’t be able to revert this!',
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, delete it!',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handleDeleteCategory(category._id);
                                        }
                                    })
                                }
                                className="text-red-500 hover:text-red-700 transition duration-300"
                            >
                                <FaTrash className="text-lg" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
