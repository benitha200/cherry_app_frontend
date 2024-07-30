import React, { useState, useEffect,useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

const Price = ({ token }) => {
    const [grade, setGrade] = useState(null);
    const [price,setPrice]=useState(null)
    const [transport,setTransport]=useState(null)
    const [selectedcws, setSelectedcws] = useState('');
    const [cws, setCws] = useState('');
    const toast = useRef(null);

  function get_cws() {
    var requestOptions = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      redirect: 'follow',
    };

    fetch("https://cherryapp.sucafina.com:8000/api/cws/", requestOptions)
      .then(response => response.json())
      .then(result => {
        setCws(result);
        
      })
      .catch(error => console.log('error', error));
  }

  const cwsOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.cws_code} - {option.cws_name}</div>
      </div>
    );
  };

  useEffect(() => {
    get_cws();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(grade.value);
    var raw = JSON.stringify({
      "cws": selectedcws?.id || "",
      "grade": grade.value,
      "price_per_kg": price,
      "transport_limit": transport
    });
  
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    try {
      const response = await fetch(`https://cherryapp.sucafina.com:8000/api/station-settings/${selectedcws?.cws_code || ''}/`, requestOptions);
      const result = await response.json();
      console.log(result);
  

      setGrade("");  
      setPrice(""); 
      setTransport("");  
  
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Price is set successfully' });
    } catch (error) {
      console.log('error', error);
    }
  };
  


    const gradeOptions = [
        { label: 'Cherry A', value: 'A' },
        { label: 'Cherry B', value: 'B' },
  ];

  return (
    <form className="form_container3 card w-5" onSubmit={handleRegister}>
      <div className="title_container">
        <p className="text-teal-600 text-pretty font-bold text-2xl">Set Price</p>
      </div>
      <br />
        <div className="input_container3 w-full flex m-2">
          <label className="input_label md:w-1/4" htmlFor="cws_name_field">
            Cws Name
          </label>
          <Dropdown
            value={selectedcws}
            onChange={(e) => setSelectedcws(e.value)}
            options={Array.isArray(cws) ? cws : []}
            optionLabel="cws_name"
            placeholder="Select a CWS"
            itemTemplate={cwsOptionTemplate}
            className="border-1 w-full"
            filter
            required
          />
        </div>
        <div className="input_container3 flex w-full m-2">
      <label className="input_label md:w-1/4" htmlFor="cws_name_field">
        Grade
      </label>
      <Dropdown
        value={grade}
        onChange={(e) => setGrade(e.value)}
        options={gradeOptions}
        optionLabel="label"
        placeholder="Select a Cherry Grade"
        className="border-1 w-full"
        required
      />
    </div>
      <div className="input_container3 flex w-full m-2">
        <label className="input_label md:w-1/4" htmlFor="username_field">
          Price Per Kg
        </label>
        <input
          placeholder="480"
          type="number"
          className="input_field3 border-1 w-full p-2 rounded-lg"
          id="price_per_kg_field"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="input_container3 w-full flex m-2">
        <label className="input_label md:w-1/4" htmlFor="email_field">
          Maximum Transport
        </label>
        <input
          placeholder="50"
          type="number"
          className="input_field3 w-full border-1 p-2 rounded-lg"
          id="maximum_transport_field"
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
          required
        />
      </div>


      <Toast ref={toast} />
      <center><button className='bg-teal-600 p-3 rounded text-gray-200 w-full' type="submit">Save</button></center>
    </form>
  );
};

export default Price;
