import './Login.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../Utils/validate";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { unifiedAuthService } from '../api/unifiedAuthService';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendStatus, setResendStatus] = useState({ sent: false, loading: false });
    const [isUnverifiedEmail, setIsUnverifiedEmail] = useState(false);
    const [corsError, setCorsError] = useState(false);
    const loginAttemptRef = useRef(null);
    const navigate = useNavigate();
    
    const [formErrors, setFormErrors] = useState([]);

    useEffect(() => {
        return () => {
            if (loginAttemptRef.current) {
                clearTimeout(loginAttemptRef.current);
            }
        };
    }, []);

    const validateForm = () => {
        const errors = [];
        
        if (!email.trim()) {
            errors.push("Email is required");
        } else if (!validateEmail(email)) {
            errors.push("Please provide valid Email address");
        }

        if (!password) {
            errors.push("Password is required");
        }
        
        setFormErrors(errors);
        return errors.length === 0;
    };

    useEffect(() => {
        const redirectReason = localStorage.getItem('auth_redirect_reason');
        if (redirectReason) {
            if (redirectReason === 'login_required') {
                setError('Authentication required. Please log in to continue.');
            }
            localStorage.removeItem('auth_redirect_reason');
        }
        
        const expiredToken = localStorage.getItem('expired_token');
        if (expiredToken === 'true') {
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('expired_token');
            unifiedAuthService.logout();
        }
        
        if (unifiedAuthService.isAuthenticated()) {
            navigate('/inputMain');
        }
    }, [navigate]);

    function handleEmailChange(event) {
        setEmail(event.target.value);
        setIsUnverifiedEmail(false);
        setResendStatus({ sent: false, loading: false });
        setError("");
        setFormErrors([]);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
        setError("");
        setFormErrors([]);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await unifiedAuthService.login(email, password);
            
            if (response.success) {
                navigate('/inputMain');
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    async function handleResendVerification() {
        if (!email || !validateEmail(email)) {
            setError("Please enter a valid email address to resend verification.");
            return;
        }
        
        setResendStatus({ sent: false, loading: true });
        
        try {
            await unifiedAuthService.resendVerification(email);
            setResendStatus({ sent: true, loading: false });
            setError("");
        } catch (err) {
            console.error("Failed to resend verification:", err);
            setResendStatus({ sent: false, loading: false });
            setError("Failed to resend verification email. Please try again.");
        }
    }
    
    function toggleVisibility() {
        setVisible((prev) => !prev);
    }

    return (<>
        <div className="container2">
            <div className="inside2">
                <div className="inside2.1">
                    <h2 className="login">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-email">
                            <input 
                                type="email" 
                                placeholder="Email"
                                onChange={handleEmailChange}
                                value={email}
                            />
                        </div>
                        <div className="input-password">
                            <input 
                                type={visible ? "text" : "password"}
                                placeholder="Password"
                                onChange={handlePasswordChange}
                                value={password}
                            />
                            {
                                visible ? <AiOutlineEye className="eye-icon" onClick={toggleVisibility}/> :
                                <AiOutlineEyeInvisible className="eye-icon" onClick={toggleVisibility}/>
                            }
                        </div>
                        
                        <Link to="/forgot-password">Forgot Password?</Link>
                        
                        {(formErrors.length > 0 || error) && (
                            <p className="error-message">
                                {formErrors.length > 0 ? formErrors[0] : error}
                            </p>
                        )}

                        {corsError && (
                            <div className="cors-error">
                                <p>CORS error detected. The server might be unavailable or not configured to accept requests from this domain.</p>
                            </div>
                        )}
                        
                        {isUnverifiedEmail && (
                            <div className="verification-actions">
                                {resendStatus.sent ? (
                                    <div className="success-message">
                                        Verification email has been sent! Please check your inbox.
                                    </div>
                                ) : (
                                    <button 
                                        type="button"
                                        className="resend-verification-btn"
                                        onClick={handleResendVerification}
                                        disabled={resendStatus.loading}
                                    >
                                        {resendStatus.loading ? "Sending..." : "Resend Verification Email"}
                                    </button>
                                )}
                            </div>
                        )}
                        
                        <div className="control">
                            <button className="login-btn" type="submit" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                        
                        <div className="or-divider">
                            <span>OR</span>
                        </div>
                        
                        <GoogleLoginButton onSuccess={() => navigate("/inputMain")} actionType="login" />
                        
                        <p>Don't have an account? <span><Link to="/signup">Signup</Link></span></p>
                    </form>
                </div>
            </div>
        </div>
    </>);
}

export default Login;