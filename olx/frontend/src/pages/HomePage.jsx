import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api';
import '../App.css';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState'; // 1. Import EmptyState

function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageTitle, setPageTitle] = useState('All Products');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchParams);
        const searchQuery = params.get('search');

        if (searchQuery) {
          setPageTitle(`Results for "${searchQuery}"`);
        } else {
          setPageTitle('All Products');
        }

        const response = await API.get('/products', { params });
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="search-container">
        <select name="category" onChange={handleFilterChange} defaultValue={searchParams.get('category') || ''} className="filter-select">
          <option value="">All Categories</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Electronics">Electronics</option>
          <option value="Smartphones">Smartphones</option>
          <option value="Laptops">Laptops</option>
          <option value="Books">Books</option>
          <option value="Gaming">Gaming</option>
          <option value="Other">Other</option>
        </select>
        <select name="condition" onChange={handleFilterChange} defaultValue={searchParams.get('condition') || ''} className="filter-select">
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Used - Like New">Used - Like New</option>
          <option value="Used - Good">Used - Good</option>
          <option value="Used - Fair">Used - Fair</option>
        </select>
      </div>
      
      <h1 style={{ textAlign: 'center' }}>{pageTitle}</h1>
      <div className="product-grid">
        {listings.length > 0 ? (
          listings.map(listing => (
            <Link to={`/ads/${listing._id}`} key={listing._id} className="product-card-link">
              <div className="product-card">
                <img src={listing.image} alt={listing.name} />
                <h3>{listing.name}</h3>
                <p className="product-price">₹{listing.price}</p>
                <p className="product-location">{listing.location}</p>
              </div>
            </Link>
          ))
        ) : (
          // 2. Use the EmptyState component here
          <EmptyState 
            title="No Products Found"
            message="There are currently no products matching your search or filters."
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;