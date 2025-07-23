import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';

function CreateAdPage() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const isEditMode = Boolean(listingId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Other',
    condition: 'Used - Good',
    price: '',
    location: '',
    brand: '',
    dateOfPurchase: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [pageTitle, setPageTitle] = useState('Post a New Ad');

  useEffect(() => {
    if (isEditMode) {
      setPageTitle('Update Your Product');
      API.get(`/products/${listingId}`)
        .then(response => {
          const listing = response.data;
          const formattedDate = listing.dateOfPurchase ? new Date(listing.dateOfPurchase).toISOString().split('T')[0] : '';
          setFormData({
            name: listing.name,
            description: listing.description,
            category: listing.category,
            condition: listing.condition,
            price: listing.price,
            location: listing.location,
            brand: listing.brand,
            dateOfPurchase: formattedDate,
          });
        })
        .catch(err => setError("Could not fetch listing data."));
    }
  }, [listingId, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditMode) {
        await API.put(`/products/${listingId}`, formData);
        navigate('/my-ads');
      } else {
        if (!image) {
          setError('Please select an image for a new Product.');
          return;
        }
        const dataToSubmit = new FormData();
        for (const key in formData) {
          if (formData[key]) {
            dataToSubmit.append(key, formData[key]);
          }
        }
        dataToSubmit.append('image', image);
        await API.post('/products', dataToSubmit);
        navigate('/ads');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>{pageTitle}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" type="text" placeholder="Item Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="brand" type="text" placeholder="Brand" value={formData.brand} onChange={handleChange} />
        <input name="location" type="text" placeholder="Location" value={formData.location} onChange={handleChange} required />
        
        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="Other">Other</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Electronics">Electronics</option>
          <option value="Smartphones">Smartphones</option>
          <option value="Laptops">Laptops</option>
          <option value="Books">Books</option>
          <option value="Gaming">Gaming</option>
        </select>

        <label>Condition</label>
        <select name="condition" value={formData.condition} onChange={handleChange} required>
          <option value="New">New</option>
          <option value="Used - Like New">Used - Like New</option>
          <option value="Used - Good">Used - Good</option>
          <option value="Used - Fair">Used - Fair</option>
        </select>
        
        <label>Date of Purchase (Optional)</label>
        <input name="dateOfPurchase" type="date" value={formData.dateOfPurchase} onChange={handleChange} />
        
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        
        {!isEditMode && (
          <>
            <label htmlFor="image">Item Image</label>
            <input type="file" id="image" name="image" onChange={(e) => setImage(e.target.files[0])} required />
          </>
        )}
        
        <button type="submit">{isEditMode ? 'Update Product' : 'Post Product'}</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreateAdPage;