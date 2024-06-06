import React, { useState } from "react";

const VerifyOTP = ({setToken, token, setRefreshtoken, refreshtoken, setRole, role, setCwsname, setCwscode, cwsname, cwscode, setCws, cws,username,password}) => {

    const [otp, setOtp] = useState(new Array(6).fill('')); 

    const handleOtpChange = (e, index) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
      };

      const handlePaste = (e) => {
        const data = e.clipboardData.getData('text/plain').slice(0, 6);
        const newOtp = new Array(6).fill('');
        for (let i = 0; i < data.length; i++) {
          newOtp[i] = data[i];
        }
        setOtp(newOtp);
        e.preventDefault();
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        console.log(username)
        console.log(password)
        const otp_ = `${otp.join('')}`;
    
        // const emailOrPhone = document.getElementById('email_field').value;
        // const password = document.getElementById('password_field').value;
    
        // setUsername(emailOrPhone)
        // setPassword(password)
    
        const raw = JSON.stringify({
          "username": username,
          "password": password,
          "otp":otp_
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
            // setResponseMessage(result);
    
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
    
  return (
    <>
    {/* <form onSubmit={handleSignIn} className="form flex flex-col items-center w-72 h-96 rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:shadow-sm">
      <p className="heading text-center text-black font-bold mt-12">Verify</p>
      <svg className="check self-center mt-16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="60" height="60" viewBox="0 0 60 60" xmlSpace="preserve">
        <image id="image0" width="60" height="60" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAQAAACQ9RH5AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0NDzN/r+StAAACR0lEQVRYw+3Yy2sTURTH8W+bNgVf aGhFaxNiAoJou3FVEUQE1yL031BEROjCnf4PLlxILZSGYncuiiC48AEKxghaNGiliAojiBWZNnNd xDza3pl77jyCyPzO8ubcT85wmUkG0qT539In+MwgoxQoUqDAKDn2kSNLlp3AGi4uDt9xWOUTK3xg hVU2wsIZSkxwnHHGKZOxHKfBe6rUqFGlTkPaVmKGn6iYao1ZyhK2zJfY0FZ9ldBzsbMKxZwZjn/e 5szGw6UsD5I0W6T+hBhjUjiF7bNInjz37Ruj3igGABjbtpIo3GIh30u4ww5wr3fwfJvNcFeznhBs YgXw70TYX2bY/ulkZhWfzfBbTdtrzjPFsvFI+T/L35jhp5q2owDs51VIVvHYDM9sa/LY8XdtKy1l FXfM8FVN2/X2ajctZxVXzPA5TZvHpfb6CFXxkerUWTOcY11LX9w0tc20inX2mmF4qG3upnNWrOKB hIXLPu3dF1x+kRWq6ysHpkjDl+7eQjatYoOCDIZF3006U0unVSxIWTgTsI3HNP3soSJkFaflMDwL 3OoHrph9YsPCJJ5466DyOGUHY3Epg2rWloUxnMjsNw7aw3AhMjwVhgW4HYm9FZaFQZ/bp6QeMRQe hhHehWKXGY7CAuSpW7MfKUZlAUqWdJ3DcbAAB3guZl9yKC4WYLfmT4muFtgVJwvQx7T2t0mnXK6J XlGGyAQvfNkaJ5JBmxnipubJ5HKDbJJsM0eY38QucSx5tJWTVHBwqDDZOzRNmn87fwDoyM4J2hRz NgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QxMzoxNTo1MCswMDowMKC8JaoAAAAldEVY dGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMTM6MTU6NTArMDA6MDDR4Z0WAAAAKHRFWHRkYXRlOnRp bWVzdGFtcAAyMDIzLTAyLTEzVDEzOjE1OjUxKzAwOjAwIIO3fQAAAABJRU5ErkJggg=="></image>
      </svg>
      <div className="box flex">
        <input className="input w-10 h-10 rounded-md border-none outline-none bg-gray-300 shadow-md transition duration-300 ease-in-out hover:bg-gray-400" type="password" maxLength="1" />
        <input className="input w-10 h-10 rounded-md border-none outline-none bg-gray-300 shadow-md transition duration-300 ease-in-out hover:bg-gray-400" type="password" maxLength="1" />
        <input className="input w-10 h-10 rounded-md border-none outline-none bg-gray-300 shadow-md transition duration-300 ease-in-out hover:bg-gray-400" type="password" maxLength="1" />
        <input className="input w-10 h-10 rounded-md border-none outline-none bg-gray-300 shadow-md transition duration-300 ease-in-out hover:bg-gray-400" type="password" maxLength="1" />
        <input className="input w-10 h-10 rounded-md border-none outline-none bg-gray-300 shadow-md transition duration-300 ease-in-out hover:bg-gray-400" type="password" maxLength="1" />
        <input className="input w-10 h-10 rounded-md border-none outline-none bg-gray-300 shadow-md transition duration-300 ease-in-out hover:bg-gray-400" type="password" maxLength="1" />
      </div>
      <button type="submit" className="btn1 mt-8 w-64 h-12 rounded-md border-none outline-none transition duration-300 ease-in-out shadow-md hover:shadow-inner">Submit</button>
    </form> */}

        <form onSubmit={handleSubmit} className="form flex flex-col mx-auto m-5 mt-16 p-5 items-center w-1/4 h-1/4 rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:shadow-sm">
            <p className="text-3xl text-center text-teal-700 font-bold mt-12 ">Verify OTP</p>
            <p className="mb-10">Please Enter Verification code that was sent on your email</p>
            <div className="box flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                    key={index}
                    className="input w-10 h-12 text-center rounded-md border-none outline-none bg-gray-200 shadow-md transition duration-300 ease-in-out hover:bg-gray-400"
                    type="text"
                    name={`otp${index}`}
                    value={otp[index] || ''}
                    onChange={(e) => handleOtpChange(e, index)}
                    maxLength="1"
                    onPaste={handlePaste}
                    />
                ))}
                </div>
        <button type="submit" className="btn1 bg-teal-600 text-slate-50 mt-8 mb-12 w-64 h-12 rounded-md border-none outline-none transition duration-300 ease-in-out shadow-md hover:shadow-inner">Submit</button>
        </form>
 
    </>
   );  
};

export default VerifyOTP;
