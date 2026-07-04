const API_BASE_URL = 'http://localhost:8080/api';

// Retrieve token from Local Storage
export const getToken = () => localStorage.getItem('careerpilot_token');

// Save user data & token
export const setSession = (token, username, email, userId) => {
  localStorage.setItem('careerpilot_token', token);
  localStorage.setItem('careerpilot_user', JSON.stringify({ username, email, userId }));
};

// Terminate sessions
export const clearSession = () => {
  localStorage.removeItem('careerpilot_token');
  localStorage.removeItem('careerpilot_user');
};

// Retrieve User details
export const getCurrentUser = () => {
  const user = localStorage.getItem('careerpilot_user');
  return user ? JSON.parse(user) : null;
};

// generic request wrapper injecting headers
async function request(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle default Content-Type (exclude it if FormData is passed)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  register: (username, email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    return request('/resumes/upload', {
      method: 'POST',
      body: formData, // Browser sets multipart boundary automatically
    });
  },

  getHistory: () => {
    return request('/resumes/history', {
      method: 'GET',
    });
  },

  getAnalysisDetails: (id) => {
    return request(`/resumes/${id}`, {
      method: 'GET',
    });
  },
};
