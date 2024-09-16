import React from 'react';
import { useDispatch } from 'react-redux';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { deleteProduct } from './redux/actions/productActions';
import Swal from 'sweetalert2';

const ListProducts = ({ products = [], onEdit }) => {
    const dispatch = useDispatch();

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteProduct(id));
                Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            }
        });
    };

    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <li key={product._id} className="bg-white shadow-md rounded p-4 flex justify-between items-center">
                    <div>
                        <p className="font-bold">{product.name}</p>
                        <p className="text-gray-700">${product.price}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(product)}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <FiEdit />
                        </button>
                        <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ListProducts;
