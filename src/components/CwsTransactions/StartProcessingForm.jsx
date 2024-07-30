import React, { useState,useEffect,useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';



const StartProcessingForm = ({profile}) => {        
    const [searchParams] = useSearchParams();
    const [options,setOptions]=useState();
    const [processtype,setProcesstype]=useState();
    const[responsemessage,setResponsemessage ]=useState();
  
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
    // const defaultGrade=grades[0]
    // const defaultOccupation = occupations[0];
    const [loading,setLoading]=useState(false)
    const [scheduledate,setScheduledate]=useState();
    const toast = useRef(null);
    
  
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


  
function get_cherry_grade_outputs(cherry_grade){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "grade_name": cherry_grade
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://192.168.81.68:8000/api/cherrygradeoutput/", requestOptions)
    .then(response => response.json())
    .then(result =>{
         console.log(result)
         setOptions(result)
    })
    .catch(error => console.log('error', error));
}


useEffect(() => {
  get_cherry_grade_outputs(cherry_grade);

  if (options && options.length > 0) {
    setProcesstype(options[0].id);
  }

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

        console.log(processtype,batch_no,scheduledate)

        var raw = JSON.stringify({
        "process_name": batch_no,
        "schedule_date": scheduledate.toISOString().split('T')[0],
        "process_type": parseInt(processtype, 10),
        "location_to":cwsname,
        "created_by":profile.displayName
        });

        var requestOptionss = {
        method: 'POST',
        headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
        body: raw,
        redirect: 'follow'
        };
        console.log("process:",processtype)


        try {
            setLoading(true);
          
            const response = await fetch("http://192.168.81.68:8000/api/createinventory/", requestOptionss);
            const result = await response.json();
            console.log(result);
            console.log(result.message);
          
            if (result && result.message) {
              setResponsemessage(result.message);
              toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
          
              setScheduledate("")
              // window.location.href = "/processing";
            } else {
              toast.current.show({ severity: 'error', summary: 'Error', detail: result.error });
            }
          } catch (error) {
            console.error('Error submitting transaction:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error submitting transaction' });
          } finally {
            setLoading(false);
          }
          
        }

       
      return (
        <div className="flex justify-center lg:w-1/2 md:w-3/4 mx-auto">
          <form className="flex flex-col w-full gap-4 bg-white border-2 shadow-xl rounded-lg font-inter p-6" onSubmit={handleSubmit}>
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white text-left pl-4 py-3 rounded-lg mb-4">
              <h2 className="text-2xl font-bold">START PROCESSING</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="processName">
                  Process Name
                </label>
                <input
                  type="text"
                  name="processName"
                  value={batch_no}
                  className="input_field border border-slate-300 rounded-md p-2 bg-gray-100"
                  id="processName"
                  readOnly
                />
              </div>

              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="processType">
                  Process Type
                </label>
                <select
                  value={processtype || ''}
                  onChange={(e) => setProcesstype(e.target.value)}
                  id="processType"
                  className="border border-slate-300 rounded-md p-2"
                  required
                >
                  <option value="" disabled>Select process type</option>
                  {options && options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.outputs}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input_container flex flex-col">
                <label className="input_label text-gray-700 font-semibold mb-1" htmlFor="scheduleDate">
                  Schedule Date
                </label>
                <Calendar 
                  value={scheduledate} 
                  onChange={(e) => setScheduledate(e.target.value)} 
                  dateFormat="dd/mm/yy" 
                  className="w-full border border-slate-300 rounded-md" 
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

            <div className="flex justify-center mt-4">
              <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out lg:w-1/2 md:w-1/2">
                Submit
              </button>
            </div>
          </form>
          <Toast ref={toast} />
        </div>
        
      );
    
}

export default StartProcessingForm;