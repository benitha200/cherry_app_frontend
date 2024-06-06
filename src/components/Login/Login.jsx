import React, { useState } from 'react';
import './Login.css';
import Cookies from 'js-cookie'; 
import VerifyOTP from './verifyOTP';

const Login = ({setToken, token, setRefreshtoken, refreshtoken, setRole, role, setCwsname, setCwscode, cwsname, cwscode, setCws, cws}) => {
  const [responseMessage, setResponseMessage] = useState(null);
  const [username,setUsername]=useState()
  const [password,setPassword]=useState()


  const handleSignIn = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const emailOrPhone = document.getElementById('email_field').value;
    const password = document.getElementById('password_field').value;

    setUsername(emailOrPhone)
    setPassword(password)

    const raw = JSON.stringify({
      "username": emailOrPhone,
      "password": password
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        body: raw,
        redirect: 'follow',
        headers: myHeaders
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`response retrieved ${result}`)
        setResponseMessage(result);

        if (result.access) {
          // Handle successful login
          setToken(result.access);
          setRefreshtoken(result.refresh);
          setCwscode(result.cws_code);
          setCwsname(result.cws_name);
          setRole(result.role);
          setCws(result.cws);

          Cookies.set("token", result.access);
          Cookies.set("refreshtoken", result.refresh);
          Cookies.set("cwscode", result.cws_code);
          Cookies.set("cwsname", result.cws_name);
          Cookies.set("role", result.role);
          Cookies.set("cws", result.cws);

          localStorage.setItem("token", result.access);
          localStorage.setItem("refreshtoken", result.refresh);
          localStorage.setItem("cwscode", result.cws_code);
          localStorage.setItem("cwsname", result.cws_name);
          localStorage.setItem("role", result.role);
          localStorage.setItem("cws", result.cws);
        }
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.log('Error during login:', error);
    }
  };

  if (responseMessage && responseMessage.detail) {
    return <VerifyOTP username={username} password={password} token={token} setToken={setToken} refreshtoken={refreshtoken} setRefreshtoken={setRefreshtoken} role={role} setRole={setRole} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} setCws={setCws}/>;
  } else {
    return (
      <form className="form_container2 w-1/4 mx-auto mt-10" onSubmit={handleSignIn}>
        <div className="title_container">
          <p className="title text-teal-800 font-bold text-6xl">Cherry App</p>
        </div>
        <div className="logo_container mt-2"></div>
        <div className="title_container">
          <p className="title text-teal-600 font-bold text-2xl">Login</p>
        </div>
        <hr className='line'/>
        <br />
        <div className="input_container2">
          <label className="input_label2" htmlFor="email_field">
            Username
          </label>
          <input
            placeholder="username"
            title="Input title"
            name="input-name"
            type="text"
            className="input_field1"
            id="email_field"
            autoComplete='off'
          />
        </div>
        <div className="input_container2">
          <label className="input_label2" htmlFor="password_field">
            Password
          </label>
          <input
            placeholder="Password"
            title="Input title"
            name="input-name"
            type="password"
            className="input_field1"
            id="password_field"
          />
        </div>
        <button className='sign-in_btn'>Sign In</button>
      </form>
    );
  }
};

export default Login;
