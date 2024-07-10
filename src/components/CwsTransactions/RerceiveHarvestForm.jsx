import React, { useState,useEffect,useRef } from 'react';
import { toast,ToastContainer } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';



const ReceiveHarvestForm = ({profile}) => {        
    const [searchParams] = useSearchParams();
  
    // Access query parameters using get method
    const cwsname = searchParams.get('cwsname');
    const token = searchParams.get('token');
    const batch_no = searchParams.get('batch_no');
    const purchase_date=searchParams.get('purchase_date')
    const cherry_grade=searchParams.get('cherry_grade')
    const harvest_kgs=searchParams.get('harvest_kgs')
    
  
    // Log the retrieved values
    console.log("cwsname:", cwsname);
    console.log("token:", token);
    console.log("batch_no:", batch_no);
    console.log("purchase_date:", purchase_date);
    console.log("cherry_grade:", cherry_grade);
    console.log("harvest_kgs:", harvest_kgs);

    const occupations = [
        {name: 'Select Occupation'},
        { name: 'Site Collector', code: 'Site Collector' },
        { name: 'Farmer', code: 'Farmer' },
    ];
    const grades = [
        {name: 'Select Grade'},
        { name: 'CA', value: 'CA' },
        { name: 'CB', value: 'CB' },
        { name: 'NA', value: 'NA' },
        { name: 'NB', value: 'NB' },
    ];
    const defaultGrade=grades[0]
    const [loading,setLoading]=useState(false)
    const [responsemessage,setResponsemessage]=useState()
    const [farmers, setFarmers] = useState([]);
    const [price,setPrice]=useState(410)
    // const toast = useRef(null);
    const [receivedqty, setReceivedqty] = useState();
    // const [grade, setGrade] = useState(defaultGrade);
    const [grade, setGrade] = useState([
      { name: 'CA', value: 'CA' },
      { name: 'CB', value: 'CB' },
      { name: 'NA', value: 'NA' },
      { name: 'NB', value: 'NB' },
    ]);
    const [selectedGradePrice,setSelectedGradePrice ]=useState()
    const [selectedGradeLimit,setSelectedGradeLimit]=useState()
    

    console.log(cwsname)    
   
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

    

    useEffect(() => {
      
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

        if(receivedqty>harvest_kgs){
            toast.error("Received Quantity is greater than Harvest quantity")
        }
        else{
           const requestOptions = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              "batch_no": batch_no,
              "cherry_grade": cherry_grade,
              "batch_creation_date": purchase_date,
              "harvest_cherry_kg": harvest_kgs,
              "received_cherry_kg": receivedqty,
              "location_to": cwsname,
            }),
            redirect: 'follow',
          };
          
          try {
            setLoading(true);
          
            const response = await fetch("http://192.168.81.68:8000/api/receiveharvest/create", requestOptions);
            const result = await response.json();
            console.log(result);
            console.log(result.message);
          
            if (result && result.message) {
              setResponsemessage(result.message);
              toast.success(result.message)
              // toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
          
              setReceivedqty("")
              window.location.href = "/receive-harvest";
            } else {
              toast.error(result.error)
              // toast.current.show({ severity: 'error', summary: 'Error', detail: result.error });
            }
          } catch (error) {
            console.error('Error submitting transaction:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error submitting transaction' });
          } finally {
            setLoading(false);
          }
        }
       
          
     
        }

       
      return (
        <div className="flex justify-center w-100">
        

        <form className="form_container card p-15" style={{width:"50%"}} onSubmit={handleSubmit}>
          <div className='text-teal-600 text-pretty font-bold text-2xl gap-2 mb-3'>RECEIVE HARVEST</div>
          <hr className='border-teal-600 h-2 mb-3'></hr>
          <div className='divider'></div>

          <div className="input_container mt-2">
            <label className="input_label" htmlFor="pricePerKg">
              Batch No
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={batch_no}
              className="input_field border-slate-400 rounded-lg"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="pricePerKg">
              Grade
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={cherry_grade}
              className="input_field border-slate-400 rounded-lg"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="pricePerKg">
              Batch Creation Date
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={purchase_date}
              className="input_field border-slate-400 rounded-lg"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="pricePerKg">
              Harvest Quantity
            </label>
            <input
              type="text"
              name="pricePerKg"
              value={harvest_kgs}
              className="input_field border-slate-400 rounded-lg"
              id="pricePerKg"
              autoComplete='off'
              readOnly
            />
          </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="transportPerKg">
              Received Quantity
            </label>
            <input
                type="number"
                name="transportPerKg"
                value={receivedqty}
                onChange={(e) => setReceivedqty(e.target.value)}
                className="input_field border-slate-400 rounded-lg"
                id="transportPerKg"
                autoComplete='off'
                required
                />
                        </div>
          <div className="input_container mt-2">
            <label className="input_label" htmlFor="transportPerKg">
              Location To
            </label>
            <input
              type="text"
              name="transportPerKg"
              value={cwsname}
              className="input_field border-slate-400 rounded-lg"
              id="transportPerKg"
              autoComplete='off'
              readOnly
            />
          </div>

          <button className='sign-in_btn mb-12'>Submit</button>
        </form>
        <ToastContainer/>
        </div>
        
      );
    
}

export default ReceiveHarvestForm;