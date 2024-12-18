import React, { useState, useEffect } from 'react';
import './reports.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';

const DprContainer = () => {
    const getFirstDayOfMonth = () => {
        const now = new Date();
        const startdateofmonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return startdateofmonth.toISOString().split('T')[0];
    };

    const getLastDayOfMonth = () => {
        const now = new Date();
        const enddateofmonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return enddateofmonth.toISOString().split('T')[0];
    };

    const [startdate, setStartdate] = useState(getFirstDayOfMonth());
    const [enddate, setEnddate] = useState(getLastDayOfMonth());
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
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
        _filters['global'] = { value, matchMode: FilterMatchMode.CONTAINS };
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
                    <InputText value={globalFilterValue} className='w-full p-2' onChange={onGlobalFilterChange} placeholder="Keyword Search" />
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
            const total = (parseFloat(item.price) + parseFloat(item.transport)) * parseFloat(item.cherry_kg);
            overallTotal += total;

            if (item.cherry_grade) {
                grade = item.cherry_grade;
            }

            if (grade.includes("A")) {
                cherryA += parseFloat(item.cherry_kg);
            } else {
                cherryB += parseFloat(item.cherry_kg);
            }

            return {
                id: item.id,
                cws_name: item.cws_name,
                farmer_name: item.farmer_name,
                farmer_code: item.farmer_code,
                purchase_date: item.purchase_date,
                cherry_kg: parseFloat(item.cherry_kg),
                has_card: item.has_card === 1,
                cherry_grade: item.cherry_grade,
                price: parseFloat(item.price),
                total: total.toLocaleString('en-US'),
                grn_no: item.grn_no,
                transport: parseFloat(item.transport),
                batch_no: item.batch_no,
            };
        });

        setDailytotal(overallTotal.toLocaleString('en-US'));
        setTotalcherrya(cherryA.toLocaleString('en-US'));
        setTotalcherryb(cherryB.toLocaleString('en-US'));

        return mappedData;
    };

    const generateReport = async () => {
        console.log('Generate report for date:', startdate);

        if (startdate && enddate) {
            const formattedDate = startdate;
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "start_date": startdate,
                "end_date": enddate
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            try {
                setLoading(true);

                const response = await fetch("http://192.168.81.102:8000/api/getdpr/", requestOptions);
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

    useEffect(() => {
        generateReport();
        initFilters();
    }, [startdate, enddate]);

    return (
        <div>
            <div className='text-teal-600 text-pretty font-bold text-2xl p-4'>DIRECT PURCHASE REPORT</div>
            <div className='flex flex-row space-x-2 md:space-x-8 justify-between'>
                <form className='flex flex-row flex-wrap mt-4 mb-4'>
                    <div className='flex flex-row justify-between ml-4'>
                        <label className='text-dark p-2 text-sm'>Start Date</label>
                        <input className="input" name="startDate" type="date" value={startdate} onChange={(e) => setStartdate(e.target.value)} />
                    </div>
                    <div className='flex flex-row justify-between ml-4 mt-4'>
                        <label className='text-dark p-2 text-sm'>End Date </label>
                        <input className="input" name="endDate" type="date" value={enddate} onChange={(e) => setEnddate(e.target.value)} />
                    </div>
                </form>
                <div className='card flex flex-column space-y-4'>
                    <div className="flex flex-row w-full gap-4">
                        <span className='text-black-600 text-xl font-bold p-2 flex flex-col w-2/6 rounded-md bg-slate-200'>
                            Purchase
                            <span className='text-sl text-cyan-600 font-bold p-2'>{dailytotal} RWF</span>
                        </span>
                        <span className='text-black-600 text-xl font-bold p-2 flex flex-col w-2/6 rounded-md bg-slate-200'>
                            Cherry A
                            <span className='text-sl text-cyan-600 font-bold p-2'>{totalcherrya} Kg</span>
                        </span>
                        <span className='text-black-600 text-xl font-bold p-2 flex flex-col w-2/6 rounded-md bg-slate-200'>
                            Cherry B
                            <span className='text-sl text-cyan-600 font-bold p-2'>{totalcherryb} Kg</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="flex justify-content-end m-2">
                    {customers && (
                        <CSVLink data={customers} headers={csvHeaders} filename="transactions.csv">
                            <Button type="button" icon="pi pi-file-excel" label="Download Excel" className="bg-teal-400 text-gray-100 p-3" onClick={exportCSV} />
                        </CSVLink>
                    )}
                </div>
                <DataTable value={customers} paginator showGridlines rows={10} dataKey="id"
                    filters={filters} globalFilterFields={['cws_name', 'farmer_name', 'cherry_grade', 'price', 'grn_no', 'transport', 'batch_no']} header={header}
                    emptyMessage="No Transactions found.">
                    <Column
                        header="No."
                        frozen
                        alignFrozen="left"
                        headerStyle={{ width: '3rem' }}
                        body={(data, options) => options.rowIndex + 1}
                    />
                    <Column field="cws_name" sortable header="CWS Name" filter filterPlaceholder="Search by CWS Name" style={{ minWidth: '12rem' }} />
                    <Column field="farmer_name" sortable header="Farmer Name" filter filterPlaceholder="Search by Farmer Name" style={{ minWidth: '12rem' }} />
                    <Column field="purchase_date" sortable header="Purchase Date" style={{ minWidth: '10rem' }} />
                    <Column field="cherry_kg" sortable header="Cherry Kg" style={{ minWidth: '10rem' }} />
                    <Column field="has_card" header="Has Card" style={{ minWidth: '8rem' }} />
                    <Column field="cherry_grade" sortable header="Cherry Grade" style={{ minWidth: '8rem' }} />
                    <Column field="price" header="Price" style={{ minWidth: '5rem' }} />
                    <Column field="total" header="Total" style={{ minWidth: '10rem' }} />
                    <Column field="grn_no" header="Paper GRN No" style={{ minWidth: '12rem' }} />
                    <Column field="transport" header="Transport" style={{ minWidth: '10rem' }} />
                    <Column field="batch_no" header="Batch Number" style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default DprContainer;
