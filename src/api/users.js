export const registerAdmin = async (userData) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/registerAdmin`, {
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
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    });
    const data = await response.json();
    return data;
};