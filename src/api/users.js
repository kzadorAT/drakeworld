const API_URL = import.meta.env.VITE_BASE_URL;

export const registerAdmin = async (userData) => {
    const response = await fetch(`${API_URL}/users/registerAdmin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
};

export const loginUser = async (loginData) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    });
    const data = await response.json();
    return data;
};

export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
};

export async function getUserProfile(){
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data;
};