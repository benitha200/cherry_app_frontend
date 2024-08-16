import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { openDB } from 'idb';
import { useSearchParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from "primereact/inputtext";
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

const BagOffForm = ({profile}) => {
  const [searchParams] = useSearchParams();
  const [options, setOptions] = useState();
  const [quantity, setQuantity] = useState(1);
  const [batch, setBatch] = useState()
  const [outTurn, setOutTurn] = useState(0)

  const cwsname = searchParams.get('cwsname');
  const token = searchParams.get('token');
  const batch_no = searchParams.get('batch_no');
  const purchase_date = searchParams.get('purchase_date')
  const cherry_grade = searchParams.get('cherry_grade')
  const harvest_kgs = searchParams.get('harvest_kgs')
  const process_type = searchParams.get('process_type')
  const schedule_date = searchParams.get('schedule_date')
  const received_cherry_kg = searchParams.get('received_cherry_kg')

  const ref = useRef(null);


  // Log the retrieved values
  console.log("cwsname:", cwsname);
  console.log("token:", token);
  console.log("batch_no:", batch_no);
  console.log("purchase_date:", purchase_date);
  console.log("cherry_grade:", cherry_grade);
  console.log("harvest_kgs:", harvest_kgs);
  console.log("process_type:", process_type);

  const [loading, setLoading] = useState(false)
  const [completeddate, setCompleteddate] = useState();
  const toast = useRef(null);



  const mapApiResponseToCustomers = (data) => {
    console.log(data);
    const mappedData = data.map((item) => {
      console.log(item.process_name);
      // ,'cherry_grade','purchase_date'

      return {
        id: item.id,
        process_name: item.process_name,
        process_type_output: item.process_type_output,
        output_quantity: item.output_quantity,

      };
    });

    return mappedData;
  };


  console.log(cwsname)





  function get_cherry_grade_outputs(cherry_grade) {
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

  
    fetch("http://192.168.82.127:8000/api/inventoryoutput/", requestOptions)
    .then(response => response.json())
    .then(result =>{
         console.log(result)
         setOptions(result)
    })
    .catch(error => console.log('error', error));
}

  function get_output_items(batch_no) {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`https://cherryapp.sucafina.com:8000/api/inventoryitems/${batch_no}/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const mappedData = mapApiResponseToCustomers(result);
        console.log(mappedData)
        setBatch(mappedData);
        // setLoading(false);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    get_cherry_grade_outputs(cherry_grade);
    get_output_items(batch_no);

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
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      setLoading(true);

      let totalKgs = 0;

      for (const option of options) {
        const quantityValue = quantity[option.id] || 0;

        if (quantityValue > 0) {
          totalKgs += parseFloat(quantityValue);
        }
      }

      let out_turn_ = (totalKgs / received_cherry_kg) * 100
      // let out_turn_ = Math.round((totalKgs / received_cherry_kg) * 100 );


      setOutTurn(out_turn_)

      // Check if the total exceeds the threshold
      // const threshold = (received_cherry_kg * 20) / 100;

      // if (totalKgs > threshold) {
      //   toast.current.show({
      //     severity: 'error',
      //     summary: 'Error',
      //     detail: 'Total quantity exceeds the threshold. Data not saved.'
      //   });
      //   return; 
      // }

      // Proceed with saving data
      const successMessages = [];

      for (const option of options) {
        const quantityValue = quantity[option.id] || 0;

        if (quantityValue > 0) {
          const raw = JSON.stringify({
            "process_name": batch_no,
            "process_type": option.id,
            "output_quantity": parseInt(quantityValue),
            "out_turn": out_turn_
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };

          const response = await fetch("https://cherryapp.sucafina.com:8000/api/stockinventoryoutput/", requestOptions);
          const result = await response.json();
          console.log(result);

          if (result && result.message) {
            successMessages.push(result.message);
            setQuantity({});
          } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: result.error });
            // Optionally handle errors or break the loop on error
            break; // Break the loop on the first error (optional)
          }
        }
      }

      // Display success message if at least one success
      if (successMessages.length > 0) {
        const successMessage = successMessages.join('\n');
        toast.current.show({ severity: 'success', summary: 'Success', detail: "Items added successfully" });
        get_output_items(batch_no);
      }

    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error submitting transaction' });
    } finally {
      setLoading(false);
    }
  };


  function handleCompleteClick() {
    const requestOptions = {
      method: "POST",
      redirect: "follow"
    };
    const comp_date = completeddate.toISOString().split('T')[0]

    fetch(`https://cherryapp.sucafina.com:8000/api/stockinventoryupdate/${batch_no}/${comp_date}/${profile.dsplayName}/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.message) {
          toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
        }
        window.location.href = "/bag-off";
      })
      .catch((error) => console.error(error));
  }

  const onRowEditSave = (e) => {
    const updatedData = { ...e.data, ...e.newData };
    const id = updatedData.id;

    console.log(updatedData);
    console.log(id);

    // Make an API call to send the updated data to the endpoint
    fetch(`http://192.168.82.127:8000/api/stockinventoryoutputedit/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Data updated successfully');
          // Update the local state
          const updatedBatch = batch.map(item => item.id === id ? updatedData : item);
          setBatch(updatedBatch);
        } else {
          console.error('Failed to update data');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const typeTextEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const quantityTextEditor = (options) => {
    return (
      <InputText
        type="number"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const InfoItem = ({ label, value }) => (
    <div>
      <span className="text-sm text-gray-600">{label}</span>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );


  return (
    <div className="flex flex-col lg:w-3/4 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4">
        <h2 className="text-2xl font-bold">Bag Off</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Process Information Card */}
        <div className="bg-gray-100 rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-teal-700 mb-3">Process Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoItem label="Batch No" value={batch_no} />
            <InfoItem label="Process Type" value={process_type} />
            <InfoItem label="Scheduled Date" value={schedule_date} />
            <InfoItem label="Total Kgs" value={received_cherry_kg} />
            <InfoItem label="Out Turn" value={`${outTurn ? Math.round(outTurn) : "_"}%`} />
          </div>
        </div>

        {/* Complete Process Form */}
        {outTurn !== 0 && (
          <form onSubmit={handleCompleteClick} className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold text-teal-700 mb-3">Complete Process</h3>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="w-full md:w-auto font-medium" htmlFor="completedDate">
                Completed Date
              </label>
              <Calendar
                id="completedDate"
                value={completeddate}
                onChange={(e) => setCompleteddate(e.value)}
                dateFormat="dd/mm/yy"
                className="rounded-lg md:w-64"
                required
              />
              <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                Complete
              </Button>
            </div>
          </form>
        )}


        {/* Add Outputs Item Panel */}
        <Panel ref={ref} header="Add Outputs Item" className="text-teal-600" toggleable>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-teal-700">Add Output Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {options && options.map(option => (
                <div key={option.id} className="flex flex-col space-y-1">
                  <label className="font-medium text-gray-700">{option.output}</label>
                  <InputText
                    id={`output-${option.id}`}
                    type="number"
                    value={quantity[option.id] || ''}
                    onChange={(e) => setQuantity({ ...quantity, [option.id]: e.target.value })}
                    placeholder="Output KGS"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
              Submit
            </Button>
          </form>
        </Panel>

        {/* DataTable */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataTable
            value={batch}
            tableStyle={{ minWidth: '100%' }}
            editMode="row"
            onRowEditComplete={onRowEditSave}
            className="text-sm"
          >
            <Column
              header="No."
              frozen
              alignFrozen="left"
              headerStyle={{ width: '3rem' }}
              body={(data, options) => options.rowIndex + 1}
            />
            <Column field="process_name" header="Process Name" />
            <Column field="process_type_output" header="Process Type" editor={(options) => typeTextEditor(options)} />
            <Column field="output_quantity" header="Quantity" editor={(options) => quantityTextEditor(options)} />
            <Column
              rowEditor
              headerStyle={{ width: '10%', minWidth: '5rem', maxWidth: '7rem' }}
              bodyStyle={{ textAlign: 'center' }}
            />
          </DataTable>
        </div>
      </div>

      <Toast ref={toast} />
    </div>

  );

}

export default BagOffForm;