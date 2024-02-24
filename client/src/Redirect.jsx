import React, { useEffect } from 'react';

const Redirect = () => {
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            window.location.href = '/home';
        } else {
            window.location.href = '/login';
        }
    }, []);

    return (
        <div>
        </div>
    );
};

export default Redirect;