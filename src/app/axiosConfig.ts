import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

interface CustomError {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  status: number;
}

interface ServerError {
  message: string;
  success?: boolean;
  [key: string]: any;
}

const formatValidationError = (message: string): string => {
  // Handle MongoDB validation error messages
  if (message.includes('validation failed')) {
    const fieldMatch = message.match(/Path `(\w+)` is required/);
    if (fieldMatch) {
      const field = fieldMatch[1];
      // Convert camelCase or snake_case to readable format
      const readableField = field
        .replace(/([A-Z])/g, ' $1') // Convert camelCase
        .replace(/_/g, ' ') // Convert snake_case
        .toLowerCase()
        .trim();
      return `Please provide ${readableField.startsWith('image') ? 'an' : 'a'} ${readableField}`;
    }
  }

  // Handle MongoDB Cast errors
  if (message.includes('Cast to ObjectId failed')) {
    const modelMatch = message.match(/for model \"(\w+)\"/);
    if (modelMatch) {
      const model = modelMatch[1]
        .replace(/([A-Z])/g, ' $1') // Convert ProductType to Product Type
        .trim();
      return `Please select a valid ${model.toLowerCase()}`;
    }
    return 'Please select a valid item';
  }
  return message;
};

const formatErrorMessage = (error: AxiosError<ServerError>): CustomError => {
  if (error.response?.data) {
    const message = error.response.data.message;

    // Handle MongoDB Cast errors
    if (message?.includes('Cast to ObjectId failed')) {
      return {
        message: formatValidationError(message),
        type: 'warning',
        status: error.response.status
      };
    }

    // Handle MongoDB validation errors
    if (message?.includes('validation failed')) {
      return {
        message: formatValidationError(message),
        type: 'warning',
        status: error.response.status
      };
    }

    // Handle duplicate key error
    if (message?.includes('E11000 duplicate key error')) {
      const fieldMatch = message.match(/index:\s+(\w+)_1/);
      const valueMatch = message.match(/{\s+(\w+):\s+"([^"]+)"/);

      if (fieldMatch && valueMatch) {
        const field = fieldMatch[1];
        const value = valueMatch[2];
        return {
          message: `The ${field} "${value}" already exists. Please use a different ${field}.`,
          type: 'warning',
          status: error.response.status
        };
      }
    }

    // Handle validation errors
    if (error.response.status === 400) {
      return {
        message: formatValidationError(message) || 'Please check your input and try again.',
        type: 'warning',
        status: 400
      };
    }

    // Handle unauthorized errors
    if (error.response.status === 401) {
      return {
        message: 'Session expired. Please login again.',
        type: 'warning',
        status: 401
      };
    }

    // Handle forbidden errors
    if (error.response.status === 403) {
      return {
        message: 'You do not have permission to perform this action.',
        type: 'error',
        status: 403
      };
    }

    // Handle not found errors
    if (error.response.status === 404) {
      return {
        message: 'The requested resource was not found.',
        type: 'warning',
        status: 404
      };
    }

    // Handle server errors (500)
    if (error.response.status >= 500) {
      return {
        message: message || 'An unexpected error occurred. Please try again later.',
        type: 'error',
        status: error.response.status
      };
    }

    // Default error with server message
    return {
      message: formatValidationError(message) || 'An error occurred',
      type: 'error',
      status: error.response.status
    };
  }

  // Handle network errors
  if (error.request) {
    return {
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'error',
      status: 0
    };
  }

  // Handle all other errors
  return {
    message: 'An unexpected error occurred',
    type: 'error',
    status: 0
  };
};

const api = axios.create({
  baseURL: "/api",
  // baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError<ServerError>) => Promise.reject(formatErrorMessage(error))
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ServerError>) => {
    const formattedError = formatErrorMessage(error);

    // Handle authentication errors
    if (formattedError.status === 401) {
      const currentPath = window.location.pathname;

      // Prevent redirecting if already on the reset password page
      if (!currentPath.includes('/reset-password')) {
        Cookies.remove('token');
        window.location.href = '/login';
      }
    }


    return Promise.reject(formattedError);
  }
);

export default api;