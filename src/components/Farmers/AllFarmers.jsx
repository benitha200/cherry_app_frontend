import React, { useState } from 'react';
// import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { Edit, Edit2 } from 'lucide-react';


const AllFarmers = ({ token, cwsname, cwscode, cws }) => {


  const getFirstDayOfMonth = () => {
    const now = new Date();
    const startdateofmonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return startdateofmonth.toISOString().split('T')[0];
    // return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  // Function to get the last day of the current month
  const getLastDayOfMonth = () => {
    const now = new Date();
    const enddateofmonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return enddateofmonth.toISOString().split('T')[0];
  };


  const [startdate, setStartdate] = useState(getFirstDayOfMonth());
  const [enddate, setEnddate] = useState(getLastDayOfMonth());
  const [customers, setCustomers] = useState([]);
  const [batch, setBatch] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    farmer_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    gender: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    village: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [exportData, setExportData] = useState(null);
  const [dailytotal, setDailytotal] = useState();
  const [totalcherrya, setTotalcherrya] = useState();
  const [totalcherryb, setTotalcherryb] = useState();

  const exportCSV = () => {
    setExportData(customers);
  };

  const csvHeaders = [
    { label: 'CWS Name', key: 'cws_name' },
    { label: 'Farmer Name', key: 'farmer_name' },
    { label: 'Farmer Code', key: 'farmer_code' },
    { label: 'Purchase Date', key: 'purchase_date' },
    { label: 'Has Card', key: 'has_card' },
    { label: 'Cherry Grade', key: 'cherry_grade' },
    { label: 'Cherry Kg', key: 'cherry_kg' },
    { label: 'Price', key: 'price' },
    { label: 'Transport', key: 'transport' },
    { label: 'GRN No', key: 'grn_no' },
    { label: 'Batch No', key: 'batch_no' },


  ];



  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'] = { value: value, matchMode: FilterMatchMode.CONTAINS };

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    const _filters = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      farmer_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      gender: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      address: { value: null, matchMode: FilterMatchMode.CONTAINS },
      village: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    };
    setFilters(_filters);
    setGlobalFilterValue('');
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center p-2">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
          className="p-button-sm"
        />
        <span className="p-input-icon-left w-72">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
            className="p-inputtext-sm w-full p-2"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  const mapApiResponseToCustomers = (data) => {
    console.log(data);
    const mappedData = data.map((item) => {
      // console.log(item.cws_name);
      // ,'cherry_grade','purchase_date'

      return {
        farmer_code: item.farmer_code,
        farmer_name: item.farmer_name,
        gender: item.gender,
        address: item.address,
        phone_number: item.phone_number,
        national_id: item.national_id,
        village: item.village,
        location: item.location,
        is_certified: item.is_certified,

      };
    });

    return mappedData;
  };


  const generateReport = async () => {
    console.log('Generate report for date:', startdate);

    if (startdate && enddate) {
      const formattedDate = startdate;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        redirect: 'follow'
      };

      try {
        setLoading(true);

        const response = await fetch("http://192.168.81.102:8000/api/allfarmers/", requestOptions)
        const data = await response.json();

        console.log(data);

        const mappedData = mapApiResponseToCustomers(data);
        setFarmers(mappedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching batch:', error);
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    generateReport();
  }, []);

  function handleReceive(batch_no, p_date, grade) {
    console.log(batch_no);
    console.log(p_date);
    console.log(grade)
  }
  const renderReceiveButton = (rowData) => {
    return <div>
      {/* <Link to={{
        pathname: "/receive-harvest-form",
        // state: { batch_no:rowData.batch_no, purchase_date:rowData.purchase_date, cherry_grade: rowData.cherry_grade,cws,cwsname,cwscode,token}
        state: {cws,cwsname,cwscode,token}
      }}> */}
      <button className='bg-teal-500 text-white p-2 rounded-md'
      //   onClick={() => handleReceive(rowData.batch_no,rowData.purchase_date,rowData.cherry_grade)}
      >
        {/* <Edit/> */}
        <Edit2 />
      </button>
      {/* </Link> */}
    </div>



  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className='bg-teal-600 text-white p-4'>
        <h1 className='text-2xl font-bold'>FARMERS INFORMATION</h1>
      </div>

      <div className="p-4">
        <DataTable
          value={farmers}
          paginator
          rows={10}
          dataKey="farmer_code"
          filters={filters}
          globalFilterFields={['farmer_code', 'farmer_name', 'gender', 'address', 'village']}
          header={renderHeader}
          emptyMessage="No Farmers found."
          className="p-datatable-sm"
          responsiveLayout="scroll"
        >
          <Column
            header="No."
            frozen
            alignFrozen="left"
            headerStyle={{ width: '3rem' }}
            body={(data, options) => options.rowIndex + 1}
          />
          <Column
            field="farmer_name"
            header="Farmer Name"
            sortable
            filter
            filterPlaceholder="Search Name"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="gender"
            header="Gender"
            sortable
            filter
            filterPlaceholder="Search Gender"
            style={{ minWidth: '8rem' }}
          />
          <Column
            field="address"
            header="Address"
            sortable
            filter
            filterPlaceholder="Search Address"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="phone_number"
            header="Phone Number"
            sortable
            style={{ minWidth: '10rem' }}
          />
          <Column
            field="national_id"
            header="National ID"
            sortable
            style={{ minWidth: '10rem' }}
          />
          <Column
            field="village"
            header="Village"
            sortable
            filter
            filterPlaceholder="Search Village"
            style={{ minWidth: '10rem' }}
          />
          <Column
            field="location"
            header="Location"
            sortable
            style={{ minWidth: '10rem' }}
          />
          <Column
            field="is_certified"
            header="Certified"
            sortable
            body={(rowData) => (
              <span className={`px-2 py-1 rounded-full ${rowData.is_certified ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {rowData.is_certified ? 'Yes' : 'No'}
              </span>
            )}
            style={{ minWidth: '8rem' }}
          />
          <Column
            header="Actions"
            body={renderReceiveButton}
            style={{ minWidth: '8rem' }}
          />
        </DataTable>
      </div>
    </div>

  );
};

export default AllFarmers;