import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { unifiedAuthService } from '../api/unifiedAuthService'; // Changed from authService
import './VerifyEmail.css';

function VerifyEmail() {
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyEmailToken = async () => {
            if (!token) return;

            setIsLoading(true);
            
            try {
                // Use unified auth service
                const response = await unifiedAuthService.verifyEmail(token);
                setIsVerified(true);
                setMessage('Your email has been successfully verified! You can now log in.');
            } catch (error) {
                console.error('Email verification failed:', error);
                setError('Email verification failed. The link may have expired or is invalid.');
            } finally {
                setIsLoading(false);
            }
        };
        
        verifyEmailToken();
    }, [token]);

    return (
        <div className="verify-email-container">
            <div className="verify-email-card">
                <h1>Email Verification</h1>
                
                {isLoading && (
                    <div className="verifying">
                        <p>Verifying your email...</p>
                        <div className="loading-spinner"></div>
                    </div>
                )}
                
                {isVerified && (
                    <div className="success-message">
                        <p>{message}</p>
                        <p>Redirecting to login page...</p>
                        <Link to="/login" className="login-link">Go to Login</Link>
                    </div>
                )}
                
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <Link to="/login" className="login-link">Go to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
