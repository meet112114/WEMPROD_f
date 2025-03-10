import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App'

const Logout = () => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await fetch('https://wemprod-b.onrender.com/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.status !== 200) {
          throw new Error('Failed to logout');
        }

        // Clear the JWT token cookie on the client side
        document.cookie = 'jwtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Dispatch the logout action
        dispatch({ type: 'USER_LOGOUT'  });

        // Navigate to the login page
        navigate('/login');

      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    handleLogout();
  }, [dispatch, navigate]);

  return (
    <>
    </>
  );
};

export default Logout;