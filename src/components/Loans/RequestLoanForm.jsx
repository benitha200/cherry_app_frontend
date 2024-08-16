
import React, { useState,useEffect,useRef } from 'react';
import { Toast } from 'primereact/toast';
import {openDB} from 'idb';
import { useSearchParams } from 'react-router-dom';


const RequestLoanForm = () => {        
    const [searchParams] = useSearchParams();
    const [loanAmount,setLoanAmount]=useState();
    const [loading,setLoading]=useState(false)
  
    // Access query parameters using get method
    const farmer_code = searchParams.get('farmer_code');
    const farmer_name = searchParams.get('farmer_name');
    const loan_limit = searchParams.get('loan_limit');
    const token = searchParams.get('token');

    
  
    // Log the retrieved values
    console.log("farmer_code:", farmer_code);
    console.log("token:", token);
    console.log("farmer_name:", farmer_name);
    console.log("loan_limit:", loan_limit);

   
    const [price,setPrice]=useState(410)
    const toast = useRef(null);


    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        // date:'',
        lastTwoDigitsOfYear: '',
        formattedMonth: '',
        formattedDay: '',
        farmerName: '',
        hasCard: false,
        pricePerKg: '',
        transportPerKg: '',
        cherryGrade: '',
        prebatch: '',
        batchNumber: '',
      });

    
const getPriceForGrade = (grade) => {
  return grade.includes('A') ? 410 : 100;
}
const handleInputChange = (e) => {

  const {name, value} = e.target;

  // Date validation
  if(name === 'date') {
    const selected = new Date(value);
    const lastTwoDigitsOfYear = selected.getFullYear().toString().slice(-2);
    const formattedMonth = String(selected.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(selected.getDate()).padStart(2, '0');
    setFormData({
        ...formData,
        [name]: value,
        lastTwoDigitsOfYear,
        formattedMonth,
        formattedDay,
     });
    if(!isDateValid(selected)) {
      setFormData({
        ...formData,
        date: ''
      });
      alert('Please select today or yesterday');
      return;
    }
  }

  // Handle cherryGrade
  if(name === 'cherryGrade') {
    setGrade(value)
    const price = getPriceForGrade(value); 
    setPrice(price);
  }

  // Update form data 
  setFormData({
    ...formData,
    [name]: value 
  });

}    
   
    useEffect(() => {
        // get_farmers();
      
        const handleOnlineStatusChange = () => {
          if (navigator.onLine) {
            synchronizeOfflineData();
          }
        };
      
        window.addEventListener('online', handleOnlineStatusChange);
      
        return () => {
          window.removeEventListener('online', handleOnlineStatusChange);
        };
      }, []);
      
    
    const handleSubmit = async (e) => {
        // print()
        e.preventDefault();
        console.log("button Clicked")
        const requestOptions = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              "farmer_code": farmer_code,
              "farmer_name": farmer_name,
              "loan_limit": loan_limit,
              "loan_amount": loanAmount,
            }),
            redirect: 'follow',
          };
          
          try {
            setLoading(true);
          
            const response = await fetch("http://192.168.82.127:8000/api/requetloan/", requestOptions);
            const result = await response.json();
            console.log(result);
            console.log(result.farmer_code);
          
            if (result && result.farmer_code) {
            //   setResponsemessage(result.message);
              toast.current.show({ severity: 'success', summary: 'Success', detail: "Loan Request Was Sent Successfully" });
          
            } else {
              toast.current.show({ severity: 'error', summary: 'Error', detail: "Ooops error occured"});
            }
          } catch (error) {
            console.error('Error submitting transaction:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error submitting transaction' });
          } finally {
            setLoading(false);
          }
          
     
        }

       
      return (
        <div className="flex justify-center w-100">
        

        <form className="form_container w-100" onSubmit={handleSubmit}>
          <div className='text-teal-600 text-pretty font-bold text-2xl gap-2 mb-3'>REQUEST LOAN</div>
          <hr className='border-teal-600 h-2 mb-3'></hr>
          <div className='divider'></div>

          <div className="input_container mt-2">
            <label className="input_label" htmlFor="farmerName">
              Farmer Name 
            </label>
            <input
              type="text"
              name="farmername"
              value={farmer_name}
              className="input_field"
              id="famerName"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="farmerCode">
              Farmer Code
            </label>
            <input
              type="text"
              name="farmerCode"
              value={farmer_code}
              className="input_field"
              id="farmercode"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="loanLimit">
              Loan Limit
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={loan_limit}
              className="input_field"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="loanAmount">
              Requested Loan Amount
            </label>
            <input
              type="text"
              name="loanAmount"
              value={loanAmount}
              onChange={(e)=>setLoanAmount(e.target.value)}
              className="input_field"
              id="loanAmount"
              
            />
          </div>
      
          <button className='sign-in_btn mb-12'>Submit</button>
        </form>
        <Toast ref={toast} />
        </div>
        
      );
    
}

export default RequestLoanForm;