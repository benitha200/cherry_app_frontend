import React, { useState,useEffect,useRef } from 'react';
import { toast,ToastContainer } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';



const ReceiveHarvestForm = ({profile}) => {        
    const [searchParams] = useSearchParams();
  
    // Access query parameters using get method
    const cwsname = searchParams.get('cws_name');
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
    const [receivedqty, setReceivedqty] = useState();
    const [grade, setGrade] = useState([
      { name: 'CA', value: 'CA' },
      { name: 'CB', value: 'CB' },
      { name: 'NA', value: 'NA' },
      { name: 'NB', value: 'NB' },
    ]);
    const [selectedGradePrice,setSelectedGradePrice ]=useState()
    const [selectedGradeLimit,setSelectedGradeLimit]=useState()
    

    console.log(cwsname)    
   
    function get_farmers(){
        var requestOptions = {
        method: 'GET',
        headers: {
            "Authorization":`Bearer ${token}`
        },
        redirect: 'follow',
        };

        fetch("https://cherryapp.sucafina.com:8000/api/farmers/", requestOptions)
        .then(response => response.json())
        .then(result => setFarmers(result))
        .catch(error => console.log('error', error));
    }
    const farmerOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.farmer_code} - {option.farmer_name}</div>
            </div>
        );
    };
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

        if(parseInt(receivedqty)!==parseInt(harvest_kgs)){
            toast.error("Received Quantity must be the same as Harvest Quantity Please correct it")
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
              "created_by":profile.displayName
            }),
            redirect: 'follow',
          };
          
          try {
            setLoading(true);
          
            const response = await fetch("https://cherryapp.sucafina.com:8000/api/receiveharvest/create", requestOptions);
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
        <div className="d-flex lg:w-1/2 md:w-3/4 mx-auto">
        
        <form className="flex flex-col items-center justify-center  gap-4 bg-white border-2 shadow-xl rounded-lg font-inter" onSubmit={handleSubmit}>
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white text-left pl-2 py-2 w-full rounded-lg">
          <h2 className="text-2xl font-bold">Receive Harvest</h2>
        </div>
      

            <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-4">
              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="batchNo">
                  Batch No
                </label>
                <input
                  type="text"
                  name="batchNo"
                  value={batch_no}
                  className="input_field border border-slate-300 rounded-md p-2 bg-gray-100"
                  id="batchNo"
                  readOnly
                />
              </div>

              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="grade">
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  value={cherry_grade}
                  className="input_field border border-slate-300 rounded-md p-2 bg-gray-100"
                  id="grade"
                  readOnly
                />
              </div>

              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="batchCreationDate">
                  Batch Creation Date
                </label>
                <input
                  type="text"
                  name="batchCreationDate"
                  value={purchase_date}
                  className="input_field border border-slate-300 rounded-md p-2 bg-gray-100"
                  id="batchCreationDate"
                  readOnly
                />
              </div>

              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="harvestQuantity">
                  Harvest Quantity
                </label>
                <input
                  type="text"
                  name="harvestQuantity"
                  value={Math.round(harvest_kgs)}
                  className="input_field border border-slate-300 rounded-md p-2 bg-gray-100"
                  id="harvestQuantity"
                  readOnly
                />
              </div>

              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="receivedQuantity">
                  Received Quantity
                </label>
                <input
                  type="number"
                  name="receivedQuantity"
                  value={receivedqty}
                  onChange={(e) => setReceivedqty(e.target.value)}
                  className="input_field border border-slate-300 rounded-md p-2"
                  id="receivedQuantity"
                  required
                />
              </div>

              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="locationTo">
                  Location To
                </label>
                <input
                  type="text"
                  name="locationTo"
                  value={cwsname}
                  className="input_field border border-slate-300 rounded-md p-2 bg-gray-100"
                  id="locationTo"
                  readOnly
                />
              </div>
            </div>

            <button className="bg-teal-600 hover:bg-teal-700 md:w-1/2 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out mt-2 mb-4">
              Submit
            </button>
          </form>
          <ToastContainer/>
        </div>
        
      );
    
}

export default ReceiveHarvestForm;