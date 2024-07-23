import React, { useState } from 'react';
import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { v4 as uuidv4 } from 'uuid';


const BatchReport = () => {


    const getFirstDayOfMonth = () => {
        const now = new Date();
        const startdateofmonth= new Date(now.getFullYear(), now.getMonth(), 1);
        return startdateofmonth.toISOString().split('T')[0];
      };
    
      // Function to get the last day of the current month
      const getLastDayOfMonth = () => {
        const now = new Date();
        const enddateofmonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return enddateofmonth.toISOString().split('T')[0];
      };
      const generateRandomId = () => uuidv4();





  const [startdate,setStartdate]=useState(getFirstDayOfMonth());
  const [enddate,setEnddate]=useState(getLastDayOfMonth());
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [filters, setFilters] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [dailytotal,setDailytotal]=useState();
  const [totalcherrya,setTotalcherrya]=useState();
  const [totalcherryb,setTotalcherryb]=useState();

  const exportCSV = () => {
      setExportData(customers);
  };

  const csvHeaders = [
    { label: 'Crop Year', key: 'season' },
    { label: 'CWS Name', key: 'cws_name' },
    { label: 'Cherry Grade', key: 'cherry_grade' },
    { label: 'Start Date', key: 'schedule_date' },
    { label: 'Completed Date', key: 'completed_date' },
    { label: 'Total Cherry KG', key: 'received_cherry_kg' },
    { label: 'Output Cherry KG', key: 'received_cherry_kg' },
    { label: 'Status', key: 'status' },
    { label: 'Process Type', key: 'process_type' },
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

  const renderOutTurn = (rowData) => {
    return rowData.out_turn ? `${rowData.out_turn}%` : '_%';
  };


  const renderHeader = () => {
    return (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <InputText className='w-full p-2' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );
};

  const header = renderHeader();

  const mapApiResponseToCustomers = (data) => {
    console.log(data);
    let overallTotal = 0;
    let cherryA = 0;
    let cherryB = 0;
    let grade = "";

    const mappedData = data.map((item) => {

        return {
            batch_no: item.batch_no,
            season: item.season,
            cws_name: item.cws_name,
            cherry_grade: item.cherry_grade,
            schedule_date: item.schedule_date,
            total_output_quantity:item.total_output_quantity,
            completed_date: item.completed_date,
            out_turn:item.out_turn,
            received_cherry_kg: parseInt(item.received_cherry_kg),
            status: item.status,
            process_type: item.process_type,
        };
    });

    return mappedData;
};


  const generateReport = async () => {
    console.log('Generate report for date:', startdate);

    if (startdate && enddate) {
      // const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
      const formattedDate = startdate;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

    //   const raw = JSON.stringify({
    //     "date": formattedDate
    //   });
    var raw = JSON.stringify({
        "start_date": startdate,
        "end_date": enddate
      });
      

      const requestOptions = {
        // method: 'POST',
        method:'GET',
        headers: myHeaders,
        // body: raw,
        redirect: 'follow'
      };

      try {
        setLoading(true);

        const response = await fetch("http://192.168.81.68:8000/api/batchreport/", requestOptions);
        const data = await response.json();

        console.log(data);

        const mappedData = mapApiResponseToCustomers(data);
        setCustomers(mappedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching batch report:', error);
        setLoading(false);
      }
    }
  };
  const modifyData = (data) => {
    let modifiedData = [];
    let uniqueCombos = new Set(); // To keep track of unique combinations of batch_no and season
  
    for (const row of data) {
      const comboKey = `${row.batch_no}-${row.season}`;
  
      if (!uniqueCombos.has(comboKey)) {
        // If the combination is not in the set, add the row to modifiedData
        modifiedData.push(row);
        uniqueCombos.add(comboKey);
      }
    }
  
    return modifiedData;
  };
  const modifiedCustomers = modifyData(customers);

  // Call generateReport when the component mounts or when the date changes
  React.useEffect(() => {
    generateReport();
  }, [startdate,enddate]);

  const modifiedCustomersWithId = modifiedCustomers.map(customer => ({
    ...customer,
    id: generateRandomId(),
  }));

  return (
    <div className="max-w-full mx-auto my-8">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold text-white">BATCH REPORT</h2>
      </div>
      
      <div className="bg-white shadow-lg rounded-b-lg overflow-hidden border-2 border-t-0">
        <div className="p-4">
          <div className="flex justify-end mb-4">
            {customers && (
              <CSVLink data={customers} headers={csvHeaders} filename="batch_report.csv">
                <Button
                  type="button"
                  icon="pi pi-file-excel"
                  label="Download Excel"
                  className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600 transition-colors"
                  onClick={exportCSV}
                />
              </CSVLink>
            )}
          </div>
          
          <DataTable
            value={modifiedCustomersWithId}
            paginator
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            dataKey="id"
            filters={filters}
            globalFilterFields={['season', 'batch_no', 'cws_name', 'cherry_grade', 'schedule_date', 'total_output_quantity', 'completed_date', 'received_cherry_kg', 'status']}
            header={header}
            emptyMessage="No transactions found."
            rowClassName={(data) => ({
              'bg-red-50 text-red-950': data.out_turn && parseFloat(data.out_turn) < 20,
              'bg-green-50 text-green-950': data.out_turn && parseFloat(data.out_turn) >= 20,
            })}
            className="p-datatable-sm"
            responsiveLayout="scroll"
          >
            <Column field="batch_no" header="Batch No" sortable filter filterPlaceholder="Search Batch No" style={{ minWidth: '10rem' }} />
            <Column field="season" header="Crop Year" sortable filter filterPlaceholder="Search Crop Year" style={{ minWidth: '10rem' }} />
            <Column field="cws_name" header="Station Name" sortable filter filterPlaceholder="Search Station" style={{ minWidth: '12rem' }} />
            <Column field="cherry_grade" header="Cherry Grade" sortable filter filterPlaceholder="Search Grade" style={{ minWidth: '10rem' }} />
            <Column field="schedule_date" header="Schedule Date" sortable style={{ minWidth: '10rem' }} />
            <Column field="completed_date" header="Completed Date" style={{ minWidth: '10rem' }} />
            <Column field="received_cherry_kg" header="Received KGS" sortable filter filterPlaceholder="Search Received KGS" style={{ minWidth: '10rem' }} />
            <Column field="total_output_quantity" header="Total Output Quantity" sortable style={{ minWidth: '12rem' }} />
            <Column field="out_turn" header="Out Turn %" sortable style={{ minWidth: '8rem' }} body={renderOutTurn} />
            <Column field="process_type" header="Process Type" style={{ minWidth: '10rem' }} />
            <Column
              field="status"
              header="Status"
              sortable
              filter
              filterMatchMode="equals"
              body={(rowData) => (rowData.completed_date ? 'Completed' : 'Pending')}
              style={{ minWidth: '8rem', fontWeight: 'bold' }}
            />
          </DataTable>
        </div>
      </div>
    </div>

  );
};

export default BatchReport;
