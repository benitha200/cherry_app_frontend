import React, { useState } from 'react';
// import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';


const ReceivedHarvest = ({token,cwsname,cwscode,cws}) => {


    const getFirstDayOfMonth = () => {
        const now = new Date();
        const startdateofmonth= new Date(now.getFullYear(), now.getMonth(), 1);
        return startdateofmonth.toISOString().split('T')[0];
        // return new Date(now.getFullYear(), now.getMonth(), 1);
      };
    
      // Function to get the last day of the current month
      const getLastDayOfMonth = () => {
        const now = new Date();
        const enddateofmonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return enddateofmonth.toISOString().split('T')[0];
      };


  const [startdate,setStartdate]=useState(getFirstDayOfMonth());
  const [enddate,setEnddate]=useState(getLastDayOfMonth());
  const [customers, setCustomers] = useState([]);
  const [batch,setBatch]=useState([]);
  const [loading, setLoading] = useState(false); 
  const [filters, setFilters] = useState(null);


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

const getSeverity = (status) => {
    switch (status) {
        case 0:
            return 'Not In Progress';

        case 1:
            return 'In Progress';
        default:
            return null;
    }
};

const statusBodyTemplate = (status) => {
    return <Tag value={status} severity={getSeverity(status)}></Tag>;
};

  const renderHeader = () => {
    return (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                {/* <i className="pi pi-search" /> */}
                <InputText style={{width:'5rem'}} value={globalFilterValue} onChange={onGlobalFilterChange} className='w-full' placeholder="Search" />
            </span>
        </div>
    );
};

  const header = renderHeader();

  const mapApiResponseToCustomers = (data) => {
    console.log(data);
    const mappedData = data.map((item) => {
        console.log(item.total_kgs);
        // ,'cherry_grade','purchase_date'

        return {
            batch_no: item.batch_no,
            cherry_grade:item.cherry_grade,
            harvest_cherry_kg:item.harvest_cherry_kg,
            received_cherry_kg:item.received_cherry_kg,
            location_to:item.location_to,
            status:item.status,
            batch_creation_date:item.batch_creation_date,

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

        const response =await fetch("https://cherryapp.sucafina.com:8000/api/receivedharvest/", requestOptions)
        const data = await response.json();

        console.log(data);

        const mappedData = mapApiResponseToCustomers(data);
        setBatch(mappedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching batch:', error);
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    generateReport();
  },[]);

  function handleReceive(batch_no,p_date,grade){
        console.log(batch_no);
        console.log(p_date);
        console.log(grade)
  }
  const renderReceiveButton = (rowData) => {
    // Log the state values before passing them to the Link
    console.log("State values before Link:", {
      batch_no: rowData.batch_no,
      purchase_date: rowData.purchase_date,
      cherry_grade: rowData.cherry_grade,
      cws,
      cwsname:rowData.location_to,
      cwscode,
      token,
    });

    if(rowData.status){
        return (
            <div>
              {/* <Link
                to={{
                  pathname: "/start-processing-form",
                  search: `?cwsname=${cwsname}&token=${token}&batch_no=${rowData.batch_no}
                              &purchase_date=${rowData.purchase_date}&cherry_grade=${rowData.cherry_grade}
                              &cwsname=${cwsname}&cwscode=${cwscode}&harvest_kgs=${rowData.total_kgs}`,
                  state: {
                    batch_no: rowData.batch_no,
                    purchase_date: rowData.purchase_date,
                    cherry_grade: rowData.cherry_grade,
                    harvest_kgs: rowData.total_kgs,
                    cws,
                    cwsname,
                    cwscode,
                    token,
                  },
                }}
              >
                <button className='bg-green-500 text-white p-2 rounded-md w-8'>
                  Bag Off
                </button>
              </Link> */}
               <button className='bg-green-500 text-white p-2 rounded-md w-8' title='go ahead and bag off if it is done'>
                  Started
                </button>
        
            </div>
          );
    }
    else{
       return (
      <div>
        <Link
          to={{
            pathname: "/start-processing-form",
            search: `?cwsname=${rowData.location_to}&token=${token}&batch_no=${rowData.batch_no}
                        &purchase_date=${rowData.purchase_date}&cherry_grade=${rowData.cherry_grade}
                        &cwscode=${cwscode}&harvest_kgs=${rowData.total_kgs}`,
            state: {
              batch_no: rowData.batch_no,
              purchase_date: rowData.purchase_date,
              cherry_grade: rowData.cherry_grade,
              harvest_kgs: rowData.total_kgs,
              cws,
              cwsname:rowData.location_to,
              cwscode,
              token,
            },
          }}
        >
          <button className='bg-cyan-500 text-white p-2 rounded-md w-8'>
            Start
          </button>
        </Link>
  
        {/* <button
          className='bg-teal-500 text-white p-2 rounded-md ml-2'
          // onClick={() => handleReceive(rowData.batch_no,rowData.purchase_date,rowData.cherry_grade)}
        >
          Start
        </button> */}
      </div>
    ); 
    }
  
    
  };
  


  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-full mx-auto my-8 border-2">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-3 ">
            <h2 className="text-2xl font-bold text-white"> Start Processing</h2>
          </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 sm:p-0 md:mt-4">
          <DataTable
            value={batch}
            paginator
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            rows={100}
            dataKey="batch_no"
            filters={filters}
            globalFilterFields={['batch_no', 'cws_name', 'total_kgs', 'status']}
            header={header}
            emptyMessage="No transactions found."
            className="p-datatable-sm"
            responsiveLayout="scroll"
          >
            <Column
              field="batch_no"
              header="Batch No"
              sortable
              filter
              filterPlaceholder="Search Batch No"
              style={{ minWidth: '10rem' }}
              className="p-column-title"
            />
            <Column
              field="location_to"
              header="Station Name"
              sortable
              filter
              filterPlaceholder="Search Station"
              style={{ minWidth: '12rem' }}
            />
            <Column
              field="cherry_grade"
              header="Cherry Grade"
              sortable
              filter
              filterPlaceholder="Search Grade"
              style={{ minWidth: '10rem' }}
            />
            <Column
              field="harvest_cherry_kg"
              header="Harvest KGS"
              sortable
              filter
              filterPlaceholder="Search Harvest KGS"
              style={{ minWidth: '10rem' }}
            />
            <Column
              field="received_cherry_kg"
              header="Received KGS"
              sortable
              filter
              filterPlaceholder="Search Received KGS"
              style={{ minWidth: '10rem' }}
            />
            <Column
              field="location_to"
              header="Location"
              sortable
              style={{ minWidth: '10rem' }}
            />
            <Column
              header="Start Processing"
              body={renderReceiveButton}
              style={{ minWidth: '10rem' }}
            />
          </DataTable>
        </div>
      </div>
    </div>

  );
};

export default ReceivedHarvest;
