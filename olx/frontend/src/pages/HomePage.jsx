import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api';
import '../App.css';

function HomePage() {
  const [listings, setListings] = useState([]);
  const [searchParams] = useSearchParams();
  const [pageTitle, setPageTitle] = useState('All Ads');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const searchQuery = searchParams.get('search');
        let url = '/products'; // Default URL to get all products

        if (searchQuery) {
          // If there is a search query, add it to the URL
          url = `/products?search=${searchQuery}`;
          setPageTitle(`Results for "${searchQuery}"`);
        } else {
          setPageTitle('All Products');
        }

        const response = await API.get(url);
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };

    fetchListings();
  }, [searchParams]); // This effect re-runs every time the URL search query changes

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{pageTitle}</h1>
      <div className="product-grid">
        {listings.length > 0 ? (
          listings.map(listing => (
            <Link to={`/ads/${listing._id}`} key={listing._id} className="product-card-link">
              <div className="product-card">
                <img src={listing.image} alt={listing.name} />
                <h3>{listing.name}</h3>
                 <p><strong>Brand:</strong> {listing.brand || 'N/A'}</p>
                <p className="product-price">₹{listing.price}</p>
                <p className="product-location">{listing.location}</p>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;