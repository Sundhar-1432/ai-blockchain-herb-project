"""
Django settings for herbtrust_backend project.
"""

from pathlib import Path

# ========================
# BASE DIR
# ========================
BASE_DIR = Path(__file__).resolve().parent.parent


# ========================
# SECURITY
# ========================
SECRET_KEY = 'django-insecure-4xv!_g9v6$7zcb&-7r=(&wp&0=p8p)kgw1c0+f^d#v)*gsid_p'

DEBUG = True

ALLOWED_HOSTS = []


# ========================
# APPLICATIONS
# ========================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    # Third Party
    'rest_framework',
    # Local Apps
    'authentication',
    'blockchain'
]


# ========================
# MIDDLEWARE
# ========================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]
CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'herbtrust_backend.urls'


# ========================
# TEMPLATES (React Dist)
# ========================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',
            BASE_DIR / '../frontend/dist'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'herbtrust_backend.wsgi.application'


# ========================
# DATABASE
# ========================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'herbxDB',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}


# ========================
# PASSWORD VALIDATION
# ========================
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# ========================
# INTERNATIONALIZATION
# ========================
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True
USE_TZ = True


# ========================
# STATIC FILES (React Assets)
# ========================
STATIC_URL = '/assets/'

STATICFILES_DIRS = [
    BASE_DIR / '../frontend/dist/assets'
]


# ========================
# DEFAULT PRIMARY KEY
# ========================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ========================
# REST FRAMEWORK
# ========================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

AUTH_USER_MODEL = 'authentication.User'

# ========================
# EMAIL CONFIGURATION
# ========================

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_USE_TLS = True
# EMAIL_PORT = 587
# EMAIL_HOST_USER = 'owlcodexdev@gmail.com'
# EMAIL_HOST_PASSWORD = 'gdqapseunvtwyymp'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER ='owlcodexdev@gmail.com'
EMAIL_HOST_PASSWORD ='gdqa pseu nvtw yymp'
