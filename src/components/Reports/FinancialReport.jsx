import React, { useState } from 'react';
import './reports.css';
import Transactions from '../Transactions/Transactions';

const FinancialReport = ({ date, onDateChange,token }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailytotal,setDailytotal]=useState();
  const [totalcherrya,setTotalcherrya]=useState();
  const [totalcherryb,setTotalcherryb]=useState();
  const [totalPaid,setTotalPaid]=useState();
  const [totalUnpaid,setTotalUnpaid]=useState();

const mapApiResponseToCustomers = (data) => {
  let overallTotal = 0;
  let cherry_a=0;
  let cherry_b=0;
  let paid=0;
  let unpaid=0;
  let grade=""

  const mappedData = data.map((item) => {
    const total = (parseFloat(item.price) + parseFloat(item.transport)) * parseFloat(item.cherry_kg);
    overallTotal += total;

    if(item.is_paid){
      const totalpaid = (parseFloat(item.price) + parseFloat(item.transport)) * parseFloat(item.cherry_kg);
      paid+=totalpaid;
    }
    else{
      const totalunpaid = (parseFloat(item.price) + parseFloat(item.transport)) * parseFloat(item.cherry_kg);
      unpaid+=totalunpaid;
    }

    console.log(item.cherry_grade);

    if(item.cherry_grade){
      grade=item.cherry_grade
    }

    

    if(grade.includes("A")){
      cherry_a+=parseFloat(item.cherry_kg);
    }
    else{
      cherry_b+=parseFloat(item.cherry_kg);
    }

    return {
      id: item.id,
      cws_name: item.cws_name,
      cws_code:item.cws_code,
      farmer_name: item.farmer_name,
      farmer_code: item.farmer_code,
      purchase_date: item.purchase_date,
      cherry_kg: parseFloat(item.cherry_kg),
      has_card: 1,
      cherry_grade: item.cherry_grade,
      price: parseFloat(item.price),
      season:item.season,
      plot_name:item.plot_name,
      total: total.toLocaleString('en-US'),
      grn_no: item.grn_no,
      transport: parseFloat(item.transport),
      is_paid:item.is_paid,
      is_approved:item.is_approved,
      is_rejected:item.is_rejected,
      batch_no: item.batch_no,
    };
  });

  setDailytotal(overallTotal.toLocaleString('en-US')); 
  setTotalPaid(paid.toLocaleString('en-US'));
  setTotalUnpaid(unpaid.toLocaleString('en-US'));
  setTotalcherrya(cherry_a.toLocaleString('en-US'));
  setTotalcherryb(cherry_b.toLocaleString('en-US'));

  return mappedData;
};


  const generateReport = async () => {
    console.log('Generate report for date:', date);

    if (date) {
      // const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
      const formattedDate = date;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "date": formattedDate
      });

      const requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: raw,
        redirect: 'follow'
      };
      try {
        setLoading(true);
      
        const response = await fetch("http://192.168.81.68:8000/api/getfinancialreport/", requestOptions);
      
        // if(response.status === 401) {
        //   localStorage.setItem('token','')
        //   window.location.href = "/";
        //   return;
        // }
      
        const data = await response.json();
      
        console.log(data);
      
        const mappedData = mapApiResponseToCustomers(data);
        setCustomers(mappedData);
        setLoading(false);
      
      } catch (error) {
        console.error('Error fetching financial report:', error);
        setLoading(false);
      }

     
    }
  };

  // Call generateReport when the component mounts or when the date changes
  React.useEffect(() => {
    generateReport();
  }, [date]);

  const StatCard = ({ title, value }) => (
    <div className='bg-slate-200 p-3 rounded-md'>
      <h2 className='text-black-600 text-lg font-bold mb-1'>{title}</h2>
      <p className='text-cyan-600 font-bold'>{value}</p>
    </div>
  );

  return (
    <div className='w-full mx-auto p-4'>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2'>
        <form className='w-full sm:w-auto mb-4 sm:mb-0'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center'>
            <label className='text-dark p-2 text-sm mb-1 sm:mb-0'>Select Date</label>
            <input
              placeholder="Select date"
              className="input m-2 
               w-full sm:w-auto"
              name="date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </form>

        <div className='w-full sm:w-auto'>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Purchase" value={`${dailytotal} RWF`} />
            <StatCard title="Cherry A" value={`${totalcherrya} Kg`} />
            <StatCard title="Cherry B" value={`${totalcherryb} Kg`} />
          </div>
        </div>
      </div>

      <div className='bg-slate-200 p-4 rounded-md mb-2'>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
          <span className='text-black-600 text-lg sm:text-xl font-bold'>
            Paid: <span className='text-teal-600 font-bold'>{totalPaid} RWF</span>
          </span>
          <div className='hidden sm:block w-px h-8 bg-gray-400'></div>
          <span className='text-black-600 text-lg sm:text-xl font-bold'>
            Unpaid: <span className='text-red-600 font-bold'>{totalUnpaid} RWF</span>
          </span>
        </div>
      </div>

      <Transactions customers={customers} loading={loading} dailytotal={dailytotal} />
    </div>
  );
};

export default FinancialReport;
