import React, { useState, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';

const DailyPurchaseValidation = () => {
  const [date, setDate] = useState();
  const [cherryGrade, setCherryGrade] = useState('');
  const [cherryKg, setCherryKg] = useState('');
  const [amount, setAmount] = useState('');
  const toast = useRef(null);

  const grades = [
    { name: 'CA', code: 'CA' },
    { name: 'NA', code: 'NA' },
    { name: 'CB', code: 'CB' },
    { name: 'NB', code: 'NB' }
];

  const handleStockValidation = async (e) => {
    e.preventDefault();

    var date__ = new Date(date);
        date__.setDate(date__.getDate() + 1); // Incrementing by one day

    var newdate = date__.toISOString().split('T')[0];

    // let newdate=date.toISOString().split('T')[0];

    const formData = {
      newdate,
      cherryGrade,
      cherryKg,
      amount
    };

    try {
      const response = await fetch('http://10.100.10.43:8000/api/daily-purchase-validation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Reset form fields
      setDate('');
      setCherryGrade('');
      setCherryKg('');
      setAmount('');

      // Show success message
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock validated successfully' });
    } catch (error) {
      console.error('Error submitting form:', error.message);
      // Show error message
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to validate stock' });
    }
  };

  return (
    <form className="form_container3 medium_card" onSubmit={handleStockValidation}>
      <div className="title_container">
        <p className="text-teal-600 text-pretty font-bold text-2xl">DAILY PURCHASE VALIDATION</p>
      </div>
      <br />
      <div className="input_container3 flex justify-between">
        <label className="input_label w-25" htmlFor="date_field">
          Date
        </label>
        <Calendar
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className=''
          required
        />
      </div>
      <div className="input_container3 flex justify-between">
    <label className="input_label w-25" htmlFor="cherry_grade_field">
        Cherry Grade
    </label>

    <Dropdown 
        value={cherryGrade} 
        onChange={(e) => setCherryGrade(e.value.name)} 
        options={grades} 
        optionLabel="name" 
        placeholder="Select a Grade" 
        className="w-full md:w-30rem" 
    />
</div>



      <div className="input_container3 flex justify-between">
        <label className="input_label w-25" htmlFor="cherry_kg_field">
          Cherry Kg
        </label>
        <input
          type="number"
          className="input_field3"
          id="cherry_kg_field"
          value={cherryKg}
          onChange={(e) => setCherryKg(e.target.value)}
          required
        />
      </div>
      <div className="input_container3 flex justify-between">
        <label className="input_label w-25" htmlFor="amount_field">
          Amount
        </label>
        <input
          type="number"
          className="input_field3"
          id="amount_field"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <Toast ref={toast} />
      <button className='bg-teal-600 p-3 rounded text-gray-200 w-5' type="submit">Submit</button>
    </form>
  );
};

export default DailyPurchaseValidation;