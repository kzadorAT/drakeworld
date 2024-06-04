import React, { useState, useEffect } from "react";
import { getUserProfile } from "../../api/users";

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                setProfile(response);
            } catch (error) {
                console.error('Error fetching profile: ', error);
                setError('Failed to fetch profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Perfil de usuario</h1>
            <p>Username: {profile.userProfile.username}</p>
            <p>Email: {profile.userProfile.email}</p>
        </div>
    );
};

export default UserProfile;