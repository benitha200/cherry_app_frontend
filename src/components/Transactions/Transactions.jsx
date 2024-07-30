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
import { InputSwitch } from 'primereact/inputswitch';
import "./Formpage.css"

export default function Transactions({ customers, dailytotal }) {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exportData, setExportData] = useState(null);
  const [grades] = useState(['CA', 'CB', 'NA', 'NB']);
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(customers);
  const [rowClick, setRowClick] = useState(true);

  const toast = useRef(null);

  const [totalOfSelected, setTotalOfSelected] = useState(0);
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
  };

  // // Example function for handling payment confirmation
  // const accept = (id) => {
  //   toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Payment confirmed', life: 3000 });

  // };

  // const reject = () => {
  //   toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Payment not confirmed', life: 3000 });
  // };



  const accept = (id) => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have confirmed', life: 3000 });
    function handlePaid(id) {
      const requestOptions = {
        method: "POST",
        redirect: "follow"
      };

      fetch(`http://192.168.81.68:8000/api/updatepaidstatus/${id}/`, requestOptions)
        .then((response) => response.json())
        .then((result) => {

          console.log(result)
          if (result.id) {
            // generateReport();
          }
        })
        .catch((error) => console.error(error));
    }
    handlePaid(id);

  }

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }


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
  const handlePay = (e) => {
    e.preventDefault();
  }

  const onRowEditComplete = (e) => {
    const editedRow = e.newData; // Extract the edited row data

    console.log("onRowEditComplete called", e);
    console.log("edited", editedRow);
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

    fetch(`http://192.168.81.68:8000/api/edittransaction/${editedRow.id}/`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);

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

  const GradeEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={grades}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Grade"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const allowEdit = (rowData) => {
    // Adjust the condition based on your requirement
    return rowData.name !== 'Blue Band';
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

  // const handleApprove = () => {
  //   if (selectedData && selectedData.length > 0) {
  //     const selectedIds = selectedData.map(item => item.id);
  //     console.log('Selected IDs:', selectedIds);
  //     // Add your approval logic here
  //     toast.current.show({ severity: 'success', summary: 'Approved', detail: 'Selected items have been approved' });
  //   } else {
  //     toast.current.show({ severity: 'warn', summary: 'No selection', detail: 'Please select items to approve' });
  //   }
  // };
  const handleApprove = async () => {
    if (selectedData && selectedData.length > 0) {
      const selectedIds = selectedData.map(item => item.id);
      console.log('Selected IDs:', selectedIds);
      try {
        const response = await fetch('http://192.168.81.68:8000/api/approvetransactions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedIds }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message); // Handle success
        } else {
          const errorData = await response.json();
          console.error('Error:', errorData.error); // Handle error
        }
      } catch (error) {
        console.error('Error:', error); // Handle network errors
      }
    }
  }
    ;

  const renderHeader = () => {
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
          {/* <Button className='bg-green-500 text-white p-3' onClick={handleApprove}>
            Approve
          </Button>
          <Button className='bg-slate-500 text-white p-3'>
            Reject
          </Button> */}
        </div>
        <span className="p-input-icon-left">
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className='w-full p-2 border-1'
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-full mx-auto">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-2">
        <h2 className="text-2xl font-bold text-white">Daily Report</h2>
      </div>

      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-end">
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
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center"
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
        rows={10}
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
        className="p-datatable-sm"
      >
        <Column
          header="No."
          frozen
          alignFrozen="left"
          headerStyle={{ width: '3rem' }}
          body={(data, options) => options.rowIndex + 1}
        />
        <Column field="batch_no" header="Batch Number" style={{ minWidth: '8rem' }} frozen alignFrozen='left' />
        <Column field="id" hidden sortable header="Transaction Id" filter filterPlaceholder="Transaction Id" style={{ minWidth: '2rem' }} />
        <Column field="cws_name" sortable header="CWS Name" filter filterPlaceholder="Search by CWS Name" style={{ minWidth: '10rem' }} />
        <Column field="farmer_name" sortable header="Farmer Name" filter filterPlaceholder="Search by Farmer Name" style={{ minWidth: '14rem' }} />
        <Column field="plot_name" sortable header="Plot Name" filter filterPlaceholder="Search by Plot Name" style={{ minWidth: '14rem' }} />
        <Column field="purchase_date" sortable header="Purchase Date" style={{ minWidth: '10rem' }} body={(rowData) => new Date(rowData.purchase_date).toLocaleDateString()} />
        <Column field="has_card" header="Has Card" style={{ minWidth: '8rem' }} body={(rowData) => rowData.has_card === 1 ? 'Yes' : 'No'} />
        <Column field="cherry_grade" sortable header="Cherry Grade" style={{ minWidth: '9rem' }} filterPlaceholder="Search by cherry grade" filter />
        <Column field="cherry_kg" header="Cherry Kg" style={{ minWidth: '5rem' }} editor={(options) => textEditor(options)} />
        <Column field="batch_no" header="Batch Number" style={{ minWidth: '8rem' }} />
        <Column field="is_paid" header="Paid" filter sortable style={{ minWidth: '8rem' }} body={(rowData) => rowData.is_paid === 1 ? <CheckBadgeIcon className="h-6 w-6 text-green-500" /> : <XCircleIcon className="h-6 w-6 text-red-500" />} />
        <Column field="price" header="Price" style={{ minWidth: '5rem' }} body={(rowData) => `${rowData.price.toLocaleString()} RWF`} />
        <Column field="total" header="Total (RWF)" style={{ minWidth: '5rem' }} body={(rowData) => `${rowData.total.toLocaleString()} RWF`} />
        <Column field="grn_no" header="Transaction No" style={{ minWidth: '8rem' }} />
        <Column field="transport" header="Transport" style={{ minWidth: '5rem' }} editor={(options) => textEditor(options)} />
        <Column
          header="Status"
          body={(rowData) => {
            if (rowData.is_approved == 1) {
              return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Approved</span>;
            } else if (rowData.is_rejected == 1) {
              return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Rejected</span>;
            } else {
              return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Pending</span>;
            }
          }}
        />

        <Column rowEditor headerStyle={{ width: '10%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        <Column header="Payment status" body={(rowData) => rowData.is_paid === 1 ?
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Paid</span>
          :
          <>
            <Toast ref={toast} />
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

      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">Total of Selected Rows: <span className="text-teal-600">{totalOfSelected.toLocaleString()} RWF</span></h3>
      </div>
    </div>
  );
}
