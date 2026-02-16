"""
Email utility functions for sending verification emails and notifications.
"""

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse


def send_verification_email(user, request=None):
    """
    Send email verification link to the user after signup.
    
    Args:
        user: User object
        request: HTTP request object (optional, for building full URL)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Generate token and UID for email verification
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Build verification URL
        if request:
            verification_url = request.build_absolute_uri(
                reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
            )
        else:
            # Fallback URL (you may need to adjust this based on your frontend URL)
            verification_url = f"http://localhost:5173/verify-email/{uid}/{token}/"
        
        # Email subject and context
        subject = 'Verify Your Email - HerbTrust'
        context = {
            'user': user,
            'verification_url': verification_url,
            'first_name': user.first_name or 'User',
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/verification_email.html', context)
        plain_message = strip_tags(html_message)
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return True
    
    except Exception as e:
        print(f"Error sending verification email to {user.email}: {str(e)}")
        return False


def send_password_reset_email(user, request=None):
    """
    Send password reset email to the user.
    
    Args:
        user: User object
        request: HTTP request object (optional)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Generate token and UID for password reset
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Build reset URL
        if request:
            reset_url = request.build_absolute_uri(
                reverse('reset-password', kwargs={'uidb64': uid, 'token': token})
            )
        else:
            reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"
        
        # Email subject and context
        subject = 'Password Reset Request - HerbTrust'
        context = {
            'user': user,
            'reset_url': reset_url,
            'first_name': user.first_name or 'User',
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/password_reset_email.html', context)
        plain_message = strip_tags(html_message)
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return True
    
    except Exception as e:
        print(f"Error sending password reset email to {user.email}: {str(e)}")
        return False


def send_welcome_email(user):
    """
    Send welcome email after successful email verification.
    
    Args:
        user: User object
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = 'Welcome to HerbTrust!'
        context = {
            'user': user,
            'first_name': user.first_name or 'User',
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/welcome_email.html', context)
        plain_message = strip_tags(html_message)
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return True
    
    except Exception as e:
        print(f"Error sending welcome email to {user.email}: {str(e)}")
        return False


def send_custom_email(recipient_email, subject, html_content, plain_text_content=None):
    """
    Send a custom email with provided content.
    
    Args:
        recipient_email: Recipient's email address
        subject: Email subject
        html_content: HTML content of the email
        plain_text_content: Plain text content (optional, will be stripped from HTML if not provided)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        if plain_text_content is None:
            plain_text_content = strip_tags(html_content)
        
        send_mail(
            subject=subject,
            message=plain_text_content,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[recipient_email],
            html_message=html_content,
            fail_silently=False,
        )
        
        return True
    
    except Exception as e:
        print(f"Error sending custom email to {recipient_email}: {str(e)}")
        return False
