import React, { useState, useEffect } from 'react';
import { adminService } from '../api';
import './UserSubscriptionManager.css';

const UserSubscriptionManager = () => {
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('free');
  const [validForDays, setValidForDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);
  
  // Load existing subscriptions when component mounts
  useEffect(() => {
    fetchSubscribers();
  }, []);
  
  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const result = await adminService.getSubscribedUsers();
      if (result.success) {
        setSubscribers(result.data || []);
        setDatabaseError(false);
      } else {
        console.error('Failed to fetch subscribers:', result.error);
        // Check for the database setup error
        if (result.error && result.error.includes('relation "users_usersubscription" does not exist')) {
          setDatabaseError(true);
        }
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      // Check for the database setup error
      if (err.message && err.message.includes('relation "users_usersubscription" does not exist')) {
        setDatabaseError(true);
      }
    } finally {
      setLoadingSubscribers(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    // Check if database is ready
    if (databaseError) {
      setError('Database setup required. Please run migrations first.');
      setLoading(false);
      return;
    }
    
    try {
      const result = await adminService.assignUserSubscription({
        email, 
        tier, 
        valid_for_days: validForDays || undefined
      });
      
      if (result.success) {
        setMessage(`Successfully assigned ${tier} plan to ${email}`);
        setEmail('');
        setTier('free');
        setValidForDays('');
        
        // Refresh subscriber list
        fetchSubscribers();
      } else {
        // Check for database setup error
        if (result.error && result.error.includes('relation "users_usersubscription" does not exist')) {
          setDatabaseError(true);
          setError('Database setup required. Please run migrations first.');
        } else {
          setError(result.error || 'Failed to update subscription');
        }
      }
    } catch (err) {
      // Check for database setup error
      if (err.message && err.message.includes('relation "users_usersubscription" does not exist')) {
        setDatabaseError(true);
        setError('Database setup required. Please run migrations first.');
      } else {
        setError(`Error: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Render database setup required message
  if (databaseError) {
    return (
      <div className="subscription-manager-container">
        <h2>Database Setup Required</h2>
        <div className="error-message">
          <p>The subscription database tables have not been set up yet. Please complete the following steps:</p>
          <ol>
            <li>Create the migration file as shown in the instructions</li>
            <li>Apply the migration with <code>python manage.py migrate</code></li>
            <li>Restart the server</li>
          </ol>
          <p>This is a one-time setup process. Once completed, subscription management will be available.</p>
          <button 
            onClick={fetchSubscribers} 
            className="refresh-button"
            disabled={loading}
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="subscription-manager-container">
      <h2>Manage User Subscriptions</h2>
      <p className="info-text">
        Assign premium access to specific users without payment processing.
      </p>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="subscription-form">
        <div className="form-group">
          <label htmlFor="email">User Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tier">Subscription Tier:</label>
          <select 
            id="tier" 
            value={tier} 
            onChange={(e) => setTier(e.target.value)}
            required
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="valid-days">Valid For (days):</label>
          <input
            type="number"
            id="valid-days"
            value={validForDays}
            onChange={(e) => setValidForDays(e.target.value)}
            placeholder="Leave empty for unlimited"
            min="1"
          />
          <small>Leave empty for unlimited access</small>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Assign Subscription'}
        </button>
      </form>
      
      <div className="subscribers-list">
        <h3>Current Subscribers</h3>
        {loadingSubscribers ? (
          <p>Loading subscribers...</p>
        ) : subscribers.length > 0 ? (
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>Valid Until</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(user => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>
                    <span className={`plan-badge ${user.tier}`}>
                      {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                    </span>
                  </td>
                  <td>{user.end_date || 'Unlimited'}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEmail(user.email);
                        setTier(user.tier);
                        setValidForDays('');
                      }}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No subscribers found.</p>
        )}
      </div>
    </div>
  );
};

export default UserSubscriptionManager;
