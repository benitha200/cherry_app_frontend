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


const PricingInfo = ({ token, cwsname, cwscode, cws }) => {


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
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(null);
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


  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };


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
  const clearFilter = () => {
    initFilters();
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <span className="p-input-icon-left">
          {/* <i className="pi pi-search" /> */}
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} className='w-full' placeholder="Search" />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  const mapApiResponseToCustomers = (data) => {
    console.log(data);
    const mappedData = data.map((item) => {
      console.log(item.cws_name);
      // ,'cherry_grade','purchase_date'

      return {
        cws_name: item.cws_name,
        price_per_kg: item.price_per_kg,
        total_kgs: item.total_kgs,
        transport_limit: item.transport_limit,
        grade: item.grade,

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

        const response =await fetch("https://cherryapp.sucafina.com:8000/api/station-settings/", requestOptions)
        const data = await response.json();

        console.log(data);

        const mappedData = mapApiResponseToCustomers(data);
        setSettings(mappedData);
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

  const renderEditButton = (rowData) => {
    return (
      <div>
        <button
          className='bg-teal-500 text-white p-2 rounded-md'
          onClick={() => {
            // Implement your receive logic here
            console.log('Receive button clicked for:', rowData);
          }}
        >
          <Edit2 />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-9xl mx-auto border-2 border-slate-200 transition-all duration-300 hover:shadow-3xl">
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4">
        <h2 className="text-3xl font-bold text-white tracking-wide">Pricing Information</h2>
      </div>

      <div className="card p-2">
        <div className="flex justify-content-end mb-4">
          {/* Add any buttons or controls here */}
        </div>

        <DataTable
          value={settings}
          paginator
          showGridlines
          rows={10}
          dataKey="batch_no"
          filters={filters}
          globalFilterFields={['batch_no', 'cws_name', 'total_kgs']}
          header={header}
          emptyMessage="No Transactions found."
          className="shadow-lg"
          responsiveLayout="scroll"
          editMode="row"
          onRowEditComplete={(e) => {
            // Handle row edit complete
            console.log('Row edited:', e.newData);
            // You should implement the logic to update the data
          }}
        >
          <Column
            header="No."
            frozen
            alignFrozen="left"
            headerStyle={{ width: '3rem', backgroundColor: '#e2e8f0' }}
            body={(data, options) => options.rowIndex + 1}
            bodyClassName="font-semibold text-gray-700"
          />
          <Column
            field="cws_name"
            sortable
            header="CWS Name"
            filter
            filterPlaceholder="Search by CWS Name"
            style={{ minWidth: '12rem' }}
            headerClassName="bg-teal-50 text-teal-800"
            // editor={(options) => <input type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />}
          />
          <Column
            field="price_per_kg"
            sortable
            header="Price Per Kg"
            filter
            filterPlaceholder="Search by Price"
            style={{ minWidth: '12rem' }}
            headerClassName="bg-teal-50 text-teal-800"
            body={(rowData) => {
              const price = parseFloat(rowData.price_per_kg);
              return isNaN(price) ? rowData.price_per_kg : `${price.toFixed(2)} RWF`;
            }}
            editor={(options) => <input type="number" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />}
          />
          <Column
            field="transport_limit"
            sortable
            header="Transport Limit"
            filter
            filterPlaceholder="Search by Transport Limit"
            style={{ minWidth: '12rem' }}
            headerClassName="bg-teal-50 text-teal-800"
            body={(rowData) => {
              const limit = parseFloat(rowData.transport_limit);
              return isNaN(limit) ? rowData.transport_limit : `${limit.toFixed(2)} Kg`;
            }}
            editor={(options) => <input type="number" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />}
          />
          <Column
            field="grade"
            sortable
            header="Grade"
            style={{ minWidth: '10rem' }}
            headerClassName="bg-teal-50 text-teal-800"
            editor={(options) => <input type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />}
          />
          {/* <Column
            header="Actions"
            body={(rowData) => renderEditButton(rowData)}
            headerClassName="bg-teal-50 text-teal-800"
            style={{ minWidth: '10rem' }}
          /> */}
          <Column
            header="Edit Price"
            rowEditor
            headerClassName="bg-teal-50 text-teal-800"
            headerStyle={{ width: '10%', minWidth: '8rem' }}
            bodyStyle={{ textAlign: 'center' }}
          />
        </DataTable>
      </div>
    </div>

  );
};

export default PricingInfo;
