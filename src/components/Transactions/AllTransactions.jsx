import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InputSwitch } from 'primereact/inputswitch';
import "./Formpage.css"
import Cookies from 'js-cookie';
import { Select } from 'flowbite-react';

export default function AllTransactions({ dailytotal }) {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exportData, setExportData] = useState(null);
  const [grades] = useState(['CA', 'CB', 'NA', 'NB']);
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState('customers');
  const [rowClick, setRowClick] = useState(true);
  const [customers,setCustomers]=useState([])
  const [status, setStatus] = useState('Pending');
  const [totalCherryKg, setTotalCherryKg] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

//   const toast = useRef(null);

  const [totalOfSelected, setTotalOfSelected] = useState(0);

  function get_transactions(){
    const myHeaders = new Headers();
    myHeaders.append("Cookie", "csrftoken=m4Li2tWC0w0QKzBHV7e8tal2rnYqh6nj; sessionid=lxnwy9lh8o0o9u3lwd5ej6yjp57pp9u6");

    const requestOptions = {
    method: "GET",
    headers: myHeaders
    };

    fetch("http://192.168.81.102:8000/api/getalltransactions/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        setCustomers(result); 
    })
    .catch((error) => console.error(error));
  }

  function get_transactions_pending(){
    const myHeaders = new Headers();
    myHeaders.append("Cookie", "csrftoken=m4Li2tWC0w0QKzBHV7e8tal2rnYqh6nj; sessionid=lxnwy9lh8o0o9u3lwd5ej6yjp57pp9u6");

    const requestOptions = {
    method: "GET",
    headers: myHeaders
    };

    fetch("http://192.168.81.102:8000/api/getpendingtransactions/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        setCustomers(result); 
    })
    .catch((error) => console.error(error));
  }

  function get_transactions_rejected(){
    const myHeaders = new Headers();
    myHeaders.append("Cookie", "csrftoken=m4Li2tWC0w0QKzBHV7e8tal2rnYqh6nj; sessionid=lxnwy9lh8o0o9u3lwd5ej6yjp57pp9u6");

    const requestOptions = {
    method: "GET",
    headers: myHeaders
    };

    fetch("http://192.168.81.102:8000/api/getrejectedtransactions/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        setCustomers(result); 
    })
    .catch((error) => console.error(error));
  }

  useEffect(()=>{
    get_transactions();
  },[])


  const calculateTotalOfSelected = (selectedRows) => {
    if (selectedRows.length > 0) {
      const total = selectedRows.reduce((sum, row) => sum + row.total, 0);
      setTotalOfSelected(total.length);
      
    } else {
      setTotalOfSelected(0);
    }
  };

  // Handler for selection change
  const handleSelectionChange = (e) => {
    const selectedRows = e.value;

    setSelectedData(selectedRows);
    calculateTotalOfSelected(selectedRows);
  
  const totalCherryKg = selectedRows.reduce((sum, row) => sum + parseFloat(row.cherry_kg || 0), 0);
  const totalAmount = selectedRows.reduce((sum, row) => {
    const rowTotal = (parseFloat(row.cherry_kg || 0) + parseFloat(row.transport || 0)) * parseFloat(row.price || 0);
    return sum + rowTotal;
  }, 0);
  
  setTotalCherryKg(totalCherryKg);
  setTotalAmount(totalAmount);
    
  };





  const accept = (id) => {
    toast.success("You have confirmed")
    //   toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have confirmed', life: 3000 });
      function handlePaid(id){
        const requestOptions = {
          method: "POST",
          redirect: "follow"
        };
        
        fetch(`http://192.168.81.102:8000/api/updatepaidstatus/${id}/`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            
            console.log(result)
            if(result.id){
             get_transactions();
            }
          })
          .catch((error) => console.error(error));
      }
      handlePaid(id);
    
  }

  const reject = () => {
    //   toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    toast.error("You have rejected")
  }




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

  const getSeverity = (value) => {
    switch (value) {
      case 'CA':
        return 'success';

      case 'CB':
        return 'success';

      case 'NA':
      case 'NB':
        return 'primary';

      default:
        return null;
    }
  };


  const onRowEditComplete = (e) => {
    const editedRow = e.newData; // Extract the edited row data

    console.log("onRowEditComplete called", e);
    console.log("edited",editedRow);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Create the payload using the edited row data
    const raw = JSON.stringify({
        pk: editedRow.id,
        cws_name: editedRow.cws_name,
        cws_code: editedRow.cws_code,
        purchase_date: editedRow.purchase_date,
        farmer_code: editedRow.farmer_code,
        farmer_name: editedRow.farmer_name,
        season: editedRow.season,
        cherry_kg: editedRow.cherry_kg,
        has_card: editedRow.has_card,
        cherry_grade: editedRow.cherry_grade,
        price: editedRow.price,
        grn_no: editedRow.grn_no,
        transport: editedRow.transport,
        batch_no: editedRow.batch_no,
        occupation: editedRow.occupation,
        synced: editedRow.synced,
        id_no: editedRow.id_no,
        created_at: editedRow.created_at,
    });

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`http://192.168.81.102:8000/api/edittransaction/${editedRow.id}/`, requestOptions)
        .then(response => response.json())
        .then(result => {
        //  toast.current.show({ severity: 'info', summary: 'Success', detail: 'You have edited Transaction successfully', life: 3000 });
        toast.success("You have edited Transaction successfully")
          console.log(result);
          get_transactions()
          
        })
        .catch(error => console.log('error', error));

    location.reload(true);
};



  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };


  const handleStatusChange = (e) => {
    const status = e.target.value;
    if (status === 'Pending') {
      get_transactions_pending();
    } else if (status === 'Rejected') {
      get_transactions_rejected();
    }
  };

  useEffect(() => {
    initFilters();
  }, []);

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      'country.name': {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue('');
  };

  const handleApprove = async () => {
    if (selectedData && selectedData.length > 0) {
          const selectedIds = selectedData.map(item => item.id);
          console.log('Selected IDs:', selectedIds);
    try {
      const response = await fetch('http://192.168.81.102:8000/api/approvetransactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Handle success
        // toast.current.show({ severity: 'info', summary: 'Approved', detail: 'You have Approved successfully', life: 3000 });
        toast.success("You have Approved successfully");
        get_transactions();
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error); // Handle error
      }
    } catch (error) {
      console.error('Error:', error); // Handle network errors
    }
  }}
  ;

  const renderHeader = () => {
    // {role === 'cws_manager' ||profile.jobTitle.includes('CWS') && profile.jobTitle.includes('Manager')? ( 

    const manager_profile = {
      "givenName": "Uzamukunda",
      "mail": "stephanie.uzamukunda@sucafina.com",
      "displayName": "Stephanie Uzamukunda",
      "jobTitle": "CWS Manager - Mashesha",
      "officeLocation": "RWACOF",
      "surname": "Stephanie",
      "userPrincipalName": "stephanie.uzamukunda@sucafina.com"
    }
    
    const others_profile = {
      "givenName": "Iyuyisenga",
      "mail": "ibl@sucafina.com",
      "displayName": "Iyuyisenga Benitha Louange",
      "jobTitle": "Data Analyst",
      "officeLocation": "RWACOF",
      "surname": "Benitha Louange",
      "userPrincipalName": "ibl@sucafina.com"
    }
        const profileCookie = others_profile;
        console.log(profileCookie);

        const profile = profileCookie;
        console.log("profile")
        console.log(profile)
        
        if (profile && 
        profile.jobTitle && 
        profile.jobTitle.includes('CWS1') && 
        profile.jobTitle.includes('Manager1'))
         {
            
        return (
            <div className="flex justify-content-between">
              <div className='flex flex-row gap-4'>
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Clear"
                  outlined
                  onClick={clearFilter}
                />
                </div>
              <span className="p-input-icon-left">
                <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Keyword Search"
                  className='w-full p-2'
                />
              </span>
            </div>
          );
    }
    else{
        return(
            <div className="flex justify-content-between">
              <div className='flex flex-row gap-4'>
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Clear"
                  outlined
                  onClick={clearFilter}
                />
                <Button className='bg-green-500 text-white p-3' onClick={handleApprove}>
                  Approve
                </Button>
                <Button className='bg-slate-500 text-white p-3'>
                  Reject
                </Button>
              </div>
              <span className="p-input-icon-left">
                <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Keyword Search"
                  className='w-full p-2'
                />
              </span>
            </div>
        )
        
    }
   
  };

  const header = renderHeader();

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-full mx-auto border-2">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-3 ">
        <h2 className="text-2xl font-bold text-white"> All Transactions</h2>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
        <Select 
          onChange={handleStatusChange}
          className="w-48 rounded-md shadow-sm border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
        >
          <option value="all">All Transactions</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </Select>

        {customers && (
          <CSVLink
            data={customers}
            headers={csvHeaders}
            filename="transactions.csv"
          >
            <Button
              type="button"
              icon="pi pi-file-excel"
              label="Download Excel"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            />
          </CSVLink>
        )}
      </div>

      <DataTable
        value={customers}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        paginator
        showGridlines
        rows={100}
        loading={loading}
        dataKey="id"
        filters={filters}
        globalFilterFields={[
          'cws_name',
          'farmer_name',
          'cherry_grade',
          'price',
          'grn_no',
          'transport',
          'batch_no',
        ]}
        header={header}
        emptyMessage="No Pending Transactions found."
        selectionMode='checkbox'
        selection={selectedData}
        onSelectionChange={handleSelectionChange}
        columnResizeMode="expand"
        resizableColumns
        scrollable
        scrollHeight="400px"
        style={{ width: '1600px' }} 
        className="small-row"
        footer={selectedData.length > 0 ? 
          <div className="flex flex-wrap justify-between items-center p-3 bg-gray-100 text-sm">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="font-semibold text-gray-700">Selected:</span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full">
                {selectedData.length}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="font-semibold text-gray-700">Total Cherry Kg:</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                {totalCherryKg.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="font-semibold text-gray-700">Total Amount:</span>
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full">
                {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'RWF' })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Average Price:</span>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
                {(totalAmount / totalCherryKg).toLocaleString('en-US', { style: 'currency', currency: 'RWF', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          : undefined
        }
      >
         <Column 
          selectionMode="multiple" 
          headerStyle={{ width: '3rem' }}
          frozen 
          alignFrozen="left"
        />
        <Column
          header="No."
          frozen
          alignFrozen="left"
          headerStyle={{ width: '3rem' }}
          body={(data, options) => options.rowIndex + 1}
        />
        <Column field="batch_no" header="Batch Number" filter style={{ minWidth: '8rem' }} frozen alignFrozen='left'/>
        <Column field="id" sortable header="Transaction Id" filter filterPlaceholder="Transaction Id" hidden style={{ minWidth: '2rem' }} />
        <Column field="cws_name" sortable header="CWS Name" filter filterPlaceholder="Search by CWS Name" style={{ minWidth: '10rem' }} />
        <Column field="farmer_name" sortable header="Farmer Name" filter filterPlaceholder="Search by Farmer Name" style={{ minWidth: '14rem' }} />
        <Column field="plot_name" sortable header="Plot Name" filter filterPlaceholder="Search by Plot Name" style={{ minWidth: '14rem' }} />
        <Column field="purchase_date" sortable header="Purchase Date" style={{ minWidth: '10rem' }} />        
        <Column field="has_card" header="Has Card" style={{ minWidth: '8rem' }} body={(rowData) => rowData.has_card === 1 ? 'Yes' : 'No'} />
        <Column field="cherry_grade" sortable header="Cherry Grade" style={{ minWidth: '9rem' }} filterPlaceholder="Search by cherry grade" filter />
        <Column field="cherry_kg" header="Cherry Kg" style={{ minWidth: '5rem' }} editor={(options) => textEditor(options)} />
        <Column field="is_paid" header="Paid" filter sortable style={{ minWidth: '8rem' }} body={(rowData) => rowData.is_paid === 1 ? <CheckBadgeIcon className="h-6 w-6 text-green-500" /> : <XCircleIcon className="h-6 w-6 text-red-500" />} />
        <Column field="price" header="Price" style={{ minWidth: '5rem' }} />
        
        <Column 
          field="total" 
          header="Total (RWF)" 
          style={{ minWidth: '5rem' }}
          body={(rowData) => {
            const total = (parseFloat(rowData.cherry_kg) + parseFloat(rowData.transport)) * parseFloat(rowData.price);
            return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }}
        />
        <Column field="grn_no" header="Transaction No" style={{ minWidth: '8rem' }} />
        <Column field="transport" header="Transport" style={{ minWidth: '5rem' }} editor={(options) => textEditor(options)} />
        <Column field="created_by" header="Created By" style={{ minWidth: '10rem' }} />
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        
        <Column header="Payment status" body={(rowData) => rowData.is_paid === 1 ? 
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Paid</span> 
          : 
          <>
            <ToastContainer/>
            <ConfirmDialog 
              group="declarative" 
              visible={visible} 
              onHide={() => setVisible(false)} 
              message="Are you sure you want to Confirm Payment?" 
              header="Confirmation" 
              icon="pi pi-exclamation-triangle" 
              accept={() => accept(rowData.id)} 
              reject={reject} 
            />
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-150 ease-in-out" 
              onClick={() => setVisible(true)} 
              icon="pi pi-check" 
              label="Confirm" 
            />
          </>
        } />
      </DataTable>

      <ToastContainer/>
      {/* <div className="bg-gray-50 p-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">Total of Selected Rows: <span className="text-teal-600">{totalOfSelected} RWF</span></h3>
      </div> */}
    </div>
  );
}
