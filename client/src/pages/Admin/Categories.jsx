import React, { useState, useEffect, useRef } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axiosInstance from '../../adminaxios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        fetchCategories();
        
        // Event listener for clicks outside the form
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target) && editingCategory) {
                setEditingCategory(null); // Clear editing state
                setCategoryName(''); // Clear input
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingCategory]);

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
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform duration-300">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Categories</h1>

            <form
                ref={formRef}
                onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="mb-6 flex items-center space-x-2 border-b pb-4"
            >
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Category Name"
                    className="border border-gray-300 p-2 rounded-lg w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    required
                />
                <button
                    type="submit"
                    className={`p-2 rounded-lg text-white w-1/3 hover:shadow-lg transition duration-300 ${
                        editingCategory ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {editingCategory ? 'Update' : 'Add'} Category
                </button>
            </form>

            <ul className="space-y-2">
                {categories.map((category) => (
                    <li
                        key={category._id}
                        className="flex items-center justify-between border border-gray-300 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300 shadow-sm"
                    >
                        <span className="text-gray-800">{category.name}</span>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setCategoryName(category.name);
                                    setEditingCategory(category);
                                }}
                                className="bg-blue-100 text-blue-600 hover:bg-blue-200 transition duration-300 p-2 rounded"
                                title="Edit Category"
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
                                className="bg-red-100 text-red-600 hover:bg-red-200 transition duration-300 p-2 rounded"
                                title="Delete Category"
                            >
                                <FiTrash2 className="text-lg" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
