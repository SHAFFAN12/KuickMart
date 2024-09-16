import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../adminaxios';
import Swal from 'sweetalert2';
import { FaUpload, FaPlus, FaYoutube } from 'react-icons/fa';
import { MdColorLens, MdClear } from 'react-icons/md';
import { ChromePicker } from 'react-color';

const ProductForm = ({ productId, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(''); // New state for stock

  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState('#ffffff');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch categories', 'error');
      }
    };

    fetchCategories();

    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await axiosInstance.get(`/products/${productId}`);
          const product = response.data;
          setName(product.name);
          setPrice(product.price);
          setDescription(product.description);
          setCategory(product.category._id);
          setColors(product.colors);
          setStock(product.stock); // Populate stock if editing

          setVideoUrl(product.video_url);
        } catch (error) {
          Swal.fire('Error', 'Failed to fetch product details', 'error');
        }
      };

      fetchProduct();
    }
  }, [productId]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleAddColor = () => {
    if (newColor) {
      setColors([...colors, newColor]);
      setNewColor('#ffffff');
      setShowColorPicker(false);
    }
  };

  const handleRemoveColor = (color) => {
    setColors(colors.filter((c) => c !== color));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


 // Basic form validation
 if (!name || !price || !description || !category || !stock) {
  Swal.fire('Error', 'Please fill out all fields', 'error');
  return;
}


    setLoading(true); // Start loading



    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('stock', stock); // Add stock to form data

    formData.append('category', category);
    formData.append('colors', JSON.stringify(colors));

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    if (video) {
      formData.append('video', video);
    }

    if (videoUrl) {
      formData.append('video_url', videoUrl);
    }

    try {
      if (productId) {
        await axiosInstance.put(`/products/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Success', 'Product updated successfully', 'success');
      } else {
        await axiosInstance.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Success', 'Product added successfully', 'success');
      }
      onClose();
    } catch (error) {
      Swal.fire('Error', 'Failed to save product', 'error');
    }finally {
      setLoading(false); // End loading
    }

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg space-y-6 sm:space-y-8"
    >
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {productId ? 'Edit Product' : 'Add Product'}
      </h1>
      <div className="space-y-4 sm:space-y-6">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
{/* New Stock Field */}
<input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="border p-3 flex-1 rounded-md shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <MdColorLens className="inline-block mr-2" /> Select Color
            </button>
            {showColorPicker && (
              <div className="relative z-10">
                <ChromePicker
                  color={newColor}
                  onChangeComplete={(color) => setNewColor(color.hex)}
                />
              </div>
            )}
            <button
              type="button"
              onClick={handleAddColor}
              className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaPlus />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color, index) => (
              <div key={index} className="relative">
                <div
                  className="w-10 h-10 rounded-full shadow-md"
                  style={{ backgroundColor: color }}
                ></div>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full text-xs hover:bg-red-600 transition-colors"
                >
                  <MdClear />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center cursor-pointer space-x-2">
            <FaYoutube className="text-red-500 text-xl" />
            <input
              type="text"
              placeholder="YouTube Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center cursor-pointer space-x-2">
            <FaUpload className="text-blue-500 text-xl" />
            <span className="text-gray-600">Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  className="w-24 h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          )}

          <label className="flex items-center cursor-pointer space-x-2">
            <FaUpload className="text-blue-500 text-xl" />
            <span className="text-gray-600">Upload Video</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
          </label>
          {video && (
            <video
              controls
              className="w-full h-48 object-cover rounded-md border"
            >
              <source src={URL.createObjectURL(video)} type={video.type} />
            </video>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-colors"
          disabled={loading} // Disable the button when loading
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
        {/* <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button> */}
      </div>
    </form>
  );
};

export default ProductForm;
