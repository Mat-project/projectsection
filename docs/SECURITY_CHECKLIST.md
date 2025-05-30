# Security Checklist for Client Delivery

## Critical Actions Before Delivery

- [ ] Remove hardcoded admin email (`mathan21092006@gmail.com`) from all code
- [ ] Remove hardcoded API URLs and move to environment variables
- [ ] Update Google OAuth credentials with client-specific values
- [ ] Review and sanitize all debugging `console.log` statements
- [ ] Ensure proper CORS configuration for production domains
- [ ] Create client-specific `.env.example` files without sensitive values
- [ ] Generate new secret keys for production
- [ ] Set up database backup and restore procedures
- [ ] Document environment variable requirements
- [ ] Implement rate limiting for authentication endpoints

## Security Configuration

- [ ] Ensure all JWT tokens have appropriate expiration times
- [ ] Configure proper SSL certificates
- [ ] Set up proper database connection pooling
- [ ] Test authentication flows including password reset
- [ ] Remove any test accounts or data
- [ ] Document administration procedures

## Environment Variables to Update

- `ADMIN_EMAIL` - Client administrator email
- `ADMIN_PASSWORD` - Client administrator password
- `DATABASE_URL` - Client-specific database connection string
- `EMAIL_HOST_USER` - Client email service user
- `EMAIL_HOST_PASSWORD` - Client email service password
- `GOOGLE_OAUTH_CLIENT_ID` - Client-specific Google OAuth credentials
- `SECRET_KEY` - New Django secret key
- `FRONTEND_URL` - Client-specific frontend URL
