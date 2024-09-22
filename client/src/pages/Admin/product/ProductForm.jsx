import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../adminaxios';
import Swal from 'sweetalert2';
import { FaUpload, FaPlus, FaYoutube } from 'react-icons/fa';
import { MdColorLens, MdClear, MdClose } from 'react-icons/md';
import { ChromePicker } from 'react-color';

const ProductForm = ({ productId, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState('#ffffff');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorPickerRef]);

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
          setStock(product.stock);
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

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = () => {
    setVideo(null);
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
    if (!name || !price || !description || !category || !stock) {
      Swal.fire('Error', 'Please fill out all fields', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('stock', stock);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg space-y-6 sm:space-y-8"
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-1 right-4 text-red-500 hover:text-red-600 transition-colors"
        >
          <MdClose className="text-2xl" />
        </button>
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {productId ? 'Edit Product' : 'Add Product'}
        </h1>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className='grid grid-cols-2 gap-4'>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
              <div className="relative z-10" ref={colorPickerRef}>
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

        <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
          {/* YouTube Video URL Input */}
          <label className="flex items-center cursor-pointer space-x-3">
            <FaYoutube className="text-red-500 text-2xl" />
            <input
              type="text"
              placeholder="YouTube Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </label>

          {/* File Upload for Image and Video */}
          <div className="flex flex-col space-y-4">
            <label className="cursor-pointer">
              <input type="file" multiple onChange={handleImageChange} hidden />
              <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg">
                <FaUpload className="text-gray-500 text-2xl mx-auto" />
                <p className="text-gray-500">Click to upload images</p>
              </div>
            </label>

            {/* Preview Images with Remove Option */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-24 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full text-xs hover:bg-red-600 transition-colors"
                  >
                    <MdClear />
                  </button>
                </div>
              ))}
            </div>

            {/* Video Upload */}
            <label className="cursor-pointer">
              <input type="file" onChange={handleVideoChange} hidden />
              <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg">
                <FaUpload className="text-gray-500 text-2xl mx-auto" />
                <p className="text-gray-500">Click to upload a video</p>
              </div>
            </label>

            {/* Video Preview with Remove Option */}
            {video && (
              <div className="relative w-full">
                <video
                  src={URL.createObjectURL(video)}
                  className="w-full rounded-lg shadow-md"
                  controls
                />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full text-xs hover:bg-red-600 transition-colors"
                >
                  <MdClear />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white w-full py-3 rounded-md hover:bg-blue-600 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
