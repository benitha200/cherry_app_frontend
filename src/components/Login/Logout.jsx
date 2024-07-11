import React, { useEffect } from 'react';

const Logout = ({profile,setProfile}) => {
  const logout = async () => {
    localStorage.removeItem('token');
        localStorage.removeItem('refreshtoken');
        localStorage.removeItem('cwscode');
        localStorage.removeItem('cwsname');
        localStorage.removeItem('role');
    try {
      const response = await fetch('https://cherryapp.sucafina.com:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          refresh_token: localStorage.getItem('refreshtoken'),
        }),
        redirect: 'follow',
      });

      if (response.ok) {
        console.log('Logout successful');
        // Clear local storage on successful logout
        Cookies.remove('token');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshtoken');
        localStorage.removeItem('cwscode');
        localStorage.removeItem('cwsname');
        localStorage.removeItem('role');
        setProfile("")
        
      } else {
        console.log('Logout failed');
      }
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  useEffect(() => {
    logout();
    // window.location.reload();
    window.location.href = "/";
  }, []); 

  return (
    <></>
  );
};

export default Logout;
