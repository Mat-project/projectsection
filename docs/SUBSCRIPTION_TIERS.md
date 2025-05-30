# Subscription Tiers Documentation

## Overview

The application offers multiple subscription tiers, each providing different levels of functionality and service:

| Feature | Free | Basic | Premium | Premium Elite |
|---------|------|-------|---------|--------------|
| Monthly Submission Limit | 1 | 24 | Unlimited | Unlimited |
| Response Time | 24 hours | Immediate | Immediate priority | 6 hours |
| Special Features | Basic analysis | Full analysis | Premium analysis | Premium + Exclusive Reports |

## Tier Details

### Free Tier
- 1 submission per month
- 24-hour response time
- Basic profile analysis
- Limited metrics evaluation

### Basic Tier ($599/month or $479.20/month billed annually)
- 24 submissions per month
- Immediate results
- Enhanced profile analysis
- Additional profile quality metrics

### Premium Tier ($1299/month or $1039.20/month billed annually)
- Unlimited submissions
- Immediate priority results
- Comprehensive analysis with all metrics
- Priority support

### Premium Elite Tier ($899/month or $719.20/month billed annually)
- Unlimited submissions
- Results within 6 hours
- All Premium features
- Exclusive monthly insights report
- Special priority support

## Implementation Details

### Backend Implementation

The subscription tier is stored in the `UserSubscription` model:

```python
class UserSubscription(models.Model):
    TIER_CHOICES = (
        ('free', 'Free'),
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('premium_elite', 'Premium Elite'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='free')
    # ... other fields ...
```

### Frontend Implementation

The tier is used to determine:

1. Maximum number of submissions per month
2. Visual styling of user interface elements
3. Expected response time messaging

### Admin Management

Administrators can assign subscription tiers through the admin panel:
- Navigate to Admin Dashboard > Manage Subscriptions
- Assign or modify user subscription tiers
- Set subscription duration

## Integration Points

The subscription system integrates with:

1. **Submission Process**: Enforces limits based on tier
2. **Response Handling**: Sets priority based on tier
3. **UI Customization**: Shows tier-specific information
