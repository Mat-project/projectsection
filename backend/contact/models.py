from django.db import models
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class ContactSubmission(models.Model):
    """
    Model for LinkedIn profile submissions and contact form messages
    """
    # Basic fields
    linkedin_url = models.URLField(max_length=1024, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # For contact form messages
    name = models.CharField(max_length=255, blank=True, null=True)
    subject = models.CharField(max_length=255, blank=True, null=True)
    message_type = models.CharField(max_length=50, blank=True, null=True)
    
    # User reference (if authenticated)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    
    # Admin reply and processing status
    admin_reply = models.TextField(blank=True, null=True)
    admin_reply_date = models.DateTimeField(blank=True, null=True)
    is_processed = models.BooleanField(default=False)
    
    # Store form data as JSON
    _form_data = models.TextField(db_column='form_data', blank=True, null=True)
    
    @property
    def form_data(self):
        """Deserialize form data from JSON"""
        if self._form_data:
            try:
                return json.loads(self._form_data)
            except (ValueError, TypeError):
                return {}
        return {}
    
    @form_data.setter
    def form_data(self, value):
        """Serialize form data to JSON"""
        if value is None:
            self._form_data = None
        else:
            self._form_data = json.dumps(value)
    
    def __str__(self):
        if self.subject:
            return f"{self.name} - {self.subject}"
        return f"{self.email} - {self.created_at.strftime('%Y-%m-%d')}"
