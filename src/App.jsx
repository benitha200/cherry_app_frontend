import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
export { FileInput,Users, NotebookPen, FileSpreadsheet, FileArchive,Files, DollarSign, BookUser, CircleUserRound, CoinsIcon, Truck, Briefcase, Home, CombineIcon, X, PersonStanding, Power,BoxIcon } from 'lucide-react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { FileInput, NotebookPen, FileSpreadsheet, FileArchive, CircleUserRound, CoinsIcon, Truck, Briefcase, Home, BoxIcon, CombineIcon, X, Divide, PersonStanding, Power, DollarSign } from 'lucide-react';
import Cookies from 'js-cookie';
import logo from "./assets/img/RwacofLogoCoulRVB.png";
import "./App.css";

// Import SidebarItem separately
import { SidebarItem } from './components/Header/Sidebar';
// import { BoxIcon, CombineIcon, DollarSign, FileInput, Files, Home, NotebookPen, Users, X } from 'lucide-react';

const AddTransaction = lazy(() => import('./components/Transactions/AddTransaction'));
const UploadFarmers = lazy(() => import('./components/Farmers/UploadFarmers'));
const Sidebar = lazy(() => import('./components/Header/Sidebar'));
const FinancialReportContainer = lazy(() => import('./components/Reports/FinancialReportContainer'));
const DprContainer = lazy(() => import('./components/Reports/DprContainer'));
const Logout = lazy(() => import('./components/Login/Logout'));
const Price = lazy(() => import('./components/Price/Price'));
const PricingInfo = lazy(() => import('./components/Price/PricingInfo'));
const ReceiveHarvest = lazy(() => import('./components/CwsTransactions/ReceiveHarvest'));
const ReceiveHarvestForm = lazy(() => import('./components/CwsTransactions/RerceiveHarvestForm'));
const ReceivedHarvest = lazy(() => import('./components/CwsTransactions/ReceivedHarvest'));
const StartProcessingForm = lazy(() => import('./components/CwsTransactions/StartProcessingForm'));
const BagOff = lazy(() => import('./components/CwsTransactions/BagOff'));
const BagOffForm = lazy(() => import('./components/CwsTransactions/BagOffForm'));
const Transfer = lazy(() => import('./components/CwsTransactions/Transfer'));
const BatchReport = lazy(() => import('./components/Reports/BatchReport'));
const NewDashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const DailyPurchaseValidation = lazy(() => import('./components/Transactions/DailyPurchaseValidation'));
const DailyPurchaseValidationReport = lazy(() => import('./components/Reports/DailyPurchaseValidation'));
const Loans = lazy(() => import('./components/Loans/Loans'));
const RequestLoanForm = lazy(() => import('./components/Loans/RequestLoanForm'));
const LoanRequests = lazy(() => import('./components/Loans/LoanRequests'));
const AllTransactions = lazy(() => import('./components/Transactions/AllTransactions'));
const AllFarmers = lazy(() => import('./components/Farmers/AllFarmers'));
const AddTransactionAdmin = lazy(() => import('./components/Transactions/AddTransactionAdmin'));

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

function AppContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshtoken, setRefreshtoken] = useState(null);
  const [role, setRole] = useState(null);
  const [cwsname, setCwsname] = useState(null);
  const [cwscode, setCwscode] = useState(null);
  const [cws, setCws] = useState(null);
  // const [profile, setProfile] = useState();
  const [profile, setProfile] = useState(others_profile);
  Cookies.set("profile", others_profile);

  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  // useEffect(() => {
  //   const urlString = window.location.href;
  //   const url = new URL(urlString);
  //   const profileParam = url.searchParams.get('profile');
  //   console.log(profileParam);

  //   if (profileParam) {
  //     try {
  //       const decodedProfileParam = decodeURIComponent(profileParam);
  //       const profileData = JSON.parse(profileParam);
  //       console.log(profileData);
  //       setProfile(profileData);
  //       Cookies.set("profile", JSON.stringify(profileData));
  //       setToken(profileData.mail);
  //     } catch (error) {
  //       console.error('Error parsing profile data:', error);
  //     }
  //   } else {
  //     window.location.href = "http://192.168.82.127:8000/login";
  //   }
  // }, []);

  if (Cookies.get("profile")) {
    return (
      <div className="flex flex-row w-full relative bg-teal-50">
        <button
          className="lg:hidden text-gray-500 w-5 h-5"
          onClick={() => setIsOpen(true)}
        >
          <Bars3Icon className="w-full h-full top-0 bg-teal-500 rounded-md text-white font-bold" />
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
        )}

        <div
          className={`fixed inset-y-0 left-0 bg-white p-2 mb-2 flex flex-col lg:relative lg:w-auto min-h-screen max-h-screen transition-all duration-300 transform lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-50 lg:z-auto`}
        >
          <button
            className="absolute top-0 right-0 lg:hidden text-gray-500 mb-4 mt-4 mr-4 w-8 h-8"
            onClick={() => setIsOpen(false)}
          >
            {/* <X className='mb-4 justify-left bg-teal-500 text-white rounded-md' /> */}
            <X className='mb-4 justify-left bg-teal-500 text-white rounded-md' />r 
          </button>
          <Suspense fallback={<div>Loading Sidebar...</div>}>
            <Sidebar profile={profile} role={role}>
              <div>
                <img src={logo} className='w-full' />
              </div>
              <div className='d-flex flex-column justify-content-between gap-2 mt-5'>
                {(() => {
                  if (role === 'cws_manager' || (profile?.jobTitle?.includes('CWS') && profile?.jobTitle?.includes('Manager'))) {
                    return (
                      <>
                        <SidebarItem
                          icon={<Home size={20} />}
                          text="Dashboard"
                          alert
                          component={Link}
                          to="/"
                          isActive={isActive('/')}
                        />
                        <SidebarItem
                          icon={<NotebookPen size={20} />}
                          text="Add Transactions"
                          alert
                          component={Link}
                          to="/add-transaction"
                          isActive={isActive('/add-transaction')}
                        />
                        <SidebarItem
                          icon={<FileInput size={20} />}
                          text="All Transactions"
                          alert
                          component={Link}
                          to="/alltransactions"
                          isActive={isActive('/alltransactions')}
                        />
                        <SidebarItem
                          icon={<BoxIcon size={20} />}
                          text="Receive Harvest"
                          alert
                          component={Link}
                          to="/receive-harvest"
                          isActive={isActive('/receive-harvest')}
                        />
                        <SidebarItem
                          icon={<Home size={20} />}
                          text="Processing"
                          alert
                          component={Link}
                          to="/processing"
                          isActive={isActive('/processing')}
                        />
                        <SidebarItem
                          icon={<Briefcase size={20} />}
                          text="Bagging Off"
                          alert
                          component={Link}
                          to="/bag-off"
                          isActive={isActive('/bag-off')}
                        />
                        <span className='font-semibold py-4'>Reports</span>
                        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                        <SidebarItem
                          icon={<File size={20} />}
                          text="Daily Report"
                          alert
                          component={Link}
                          to="/daily-report"
                          isActive={isActive('/daily-report')}
                        />
                        <SidebarItem
                          icon={<CombineIcon size={20} />}
                          text="Batch Report"
                          alert
                          component={Link}
                          to="/batchreport"
                          isActive={isActive('/batchreport')}
                        />
                      </>
                    );
                  } else if (role === 'Data analyst' || (profile?.jobTitle?.includes('Data') && profile?.jobTitle?.includes('Analyst'))) {
                    return (
                      <>
                        <SidebarItem
                          icon={<Home size={20} />}
                          text="Dashboard"
                          alert
                          component={Link}
                          to="/"
                          isActive={isActive('/')}
                        />
                        <SidebarItem
                          icon={<NotebookPen size={20} />}
                          text="Add Transactions"
                          alert
                          component={Link}
                          to="/add-transaction-admin"
                          isActive={isActive('/add-transaction-admin')}
                        />
                        <SidebarItem
                          icon={<FileInput size={20} />}
                          text="All Transactions"
                          alert
                          component={Link}
                          to="/alltransactions"
                          isActive={isActive('/alltransactions')}
                        />
                        <SidebarItem
                          icon={<BoxIcon size={20} />}
                          text="Receive Harvest"
                          alert
                          component={Link}
                          to="/receive-harvest"
                          isActive={isActive('/receive-harvest')}
                        />
                        <SidebarItem
                          icon={<Home size={20} />}
                          text="Processing"
                          alert
                          component={Link}
                          to="/processing"
                          isActive={isActive('/processing')}
                        />
                        <SidebarItem
                          icon={<Briefcase size={20} />}
                          text="Bagging Off"
                          alert
                          component={Link}
                          to="/bag-off"
                          isActive={isActive('/bag-off')}
                        />
                        <SidebarItem
                          icon={<DollarSign size={20} />}
                          text="Set Price"
                          alert
                          component={Link}
                          to="/all-farmers"
                          isActive={isActive('/all-farmers')}
                        />
                        <SidebarItem
                          icon={<FileInput size={20} />}
                          text="Upload Farmer"
                          alert
                          component={Link}
                          to="/upload-farmer"
                          isActive={isActive('/upload-farmer')}
                        />
                        <SidebarItem
                          icon={<CoinsIcon className='' size={20} />}
                          text="Station Pricing"
                          component={Link}
                          to="/price"
                          isActive={isActive('/price')}
                        />
                        <SidebarItem
                          icon={<CoinsIcon className='' size={20} />}
                          text="Pricing Info"
                          component={Link}
                          to="/price-info"
                          isActive={isActive('/price-info')}
                        />
                        <span className='font-semibold pl-2 m-2 pt-2'>Reports</span>
                        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                        <SidebarItem
                          icon={<FileSpreadsheet size={20} />}
                          text="Daily Report"
                          alert
                          component={Link}
                          to="/daily-report"
                          isActive={isActive('/daily-report')}
                        />
                          <SidebarItem
                          icon={<CombineIcon size={20} />}
                          text="Batch Report"
                          alert
                          component={Link}
                          to="/batchreport"
                          isActive={isActive('/batchreport')}
                        />
                        <SidebarItem
                          icon={<FileArchive size={20} />}
                          text="DPR"
                          alert
                          component={Link}
                          to="/dpr"
                          isActive={isActive('/dpr')}

                        />
                        {/* <SidebarItem
                        icon={<FileArchive size={20} />}
                        text="Loans"
                        alert
                        component={Link}
                        to="/loan-requests"
                      />
                      <SidebarItem
                        icon={<BookUser className='' size={20} />}
                        text="Register User"
                        component={Link}
                        to="/register-user"
                      /> */}


                      </>
                    );
                  }
                  else{
                   return (
                      <>
                        <SidebarItem
                          icon={<Home size={20} />}
                          text="Dashboard"
                          alert
                          component={Link}
                          to="/"
                          isActive={isActive('/')}
                        />
                        <SidebarItem
                          icon={<FileInput size={20} />}
                          text="All Transactions"
                          alert
                          component={Link}
                          to="/alltransactions"
                          isActive={isActive('/alltransactions')}
                        />
                        <SidebarItem
                          icon={<FileInput size={20} />}
                          text="Farmers"
                          alert
                          component={Link}
                          to="/all-farmers"
                          isActive={isActive('/upload-farmer')}
                        />
                        <SidebarItem
                          icon={<FileInput size={20} />}
                          text="Upload Farmer"
                          alert
                          component={Link}
                          to="/upload-farmer"
                          isActive={isActive('/upload-farmer')}
                        />
                        <SidebarItem
                          icon={<CoinsIcon className='' size={20} />}
                          text="Station Pricing"
                          component={Link}
                          to="/price"
                          isActive={isActive('/price')}
                        />
                        <SidebarItem
                          icon={<CoinsIcon className='' size={20} />}
                          text="Pricing Info"
                          component={Link}
                          to="/price-info"
                          isActive={isActive('/price-info')}
                        />
                        <br/>
                        <span className='font-semibold py-4'>Reports</span>
                        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                        <SidebarItem
                          icon={<FileSpreadsheet size={20} />}
                          text="Daily Report"
                          alert
                          component={Link}
                          to="/daily-report"
                          isActive={isActive('/daily-report')}
                        />
                        {/* <SidebarItem
                        icon={<FileSpreadsheet size={20} />}
                        text="Daily Purchase Validation"
                        alert
                        component={Link}
                        to="/daily-purchase-validation"
                      /> */}
                        <SidebarItem
                          icon={<FileArchive size={20} />}
                          text="DPR"
                          alert
                          component={Link}
                          to="/dpr"
                          isActive={isActive('/dpr')}

                        />
                        {/* <SidebarItem
                        icon={<FileArchive size={20} />}
                        text="Loans"
                        alert
                        component={Link}
                        to="/loan-requests"
                      />
                      <SidebarItem
                        icon={<BookUser className='' size={20} />}
                        text="Register User"
                        component={Link}
                        to="/register-user"
                      /> */}


                      </>
                   );
                  }
                })()}
              </div>
            </Sidebar>
          </Suspense>
        </div>

        <div className='flex-1 mt-1 bg-teal-50 w-full'>
        <div className='card gap-2 bg-slate-300 font-bold flex flex-row' style={{justifyContent:"right"}}>
                <CircleUserRound/> <p className='pt-2 '>Welcome</p><span className='text-teal-600 pt-2'>{profile.displayName}</span>
                <div className="bg-slate-300 p-1 text-white rounded-lg">
                  <SidebarItem
                    icon={<Power size={20} />}
                    text="Logout"
                    alert
                    component={Link}
                    to="/logout"
                    isActive={isActive('/logout')}
                  />
                </div>
            </div>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<NewDashboard />} />
              <Route path="/add-transaction" element={<AddTransaction />} />
              <Route path="/upload-farmers" element={<UploadFarmers />} />
              <Route path="/receive-harvest" element={<ReceiveHarvest />} />
              <Route path="/receive-harvest-form" element={<ReceiveHarvestForm />} />
              <Route path="/received-harvest" element={<ReceivedHarvest />} />
              <Route path="/processing" element={<StartProcessingForm />} />
              <Route path="/bag-off" element={<BagOff />} />
              <Route path="/bag-off-form" element={<BagOffForm />} />
              <Route path="/processing" element={<Transfer />} />
              <Route path="/batchreport" element={<BatchReport />} />
              <Route path="/financial-report" element={<FinancialReportContainer />} />
              <Route path="/dpr" element={<DprContainer />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/pricing" element={<Price />} />
              <Route path="/pricing-info" element={<PricingInfo />} />
              <Route path="/daily-purchase-validation" element={<DailyPurchaseValidation />} />
              <Route path="/daily-purchase-validation-report" element={<DailyPurchaseValidationReport />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/request-loan" element={<RequestLoanForm />} />
              <Route path="/loan-requests" element={<LoanRequests />} />
              <Route path="/alltransactions" element={<AllTransactions />} />
              <Route path="/farmers" element={<AllFarmers />} />
              <Route path="/add-transaction-admin" element={<AddTransactionAdmin />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-bold text-gray-500">Please wait...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;




// import React, { useState, useEffect, lazy, Suspens } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, Outlet, useLocation } from 'react-router-dom';
// import { Bars3Icon } from '@heroicons/react/24/outline';
// import { FileInput, NotebookPen, FileSpreadsheet, FileArchive, BookUser, CircleUserRound, CoinsIcon, Truck, Briefcase, Home, BoxIcon, CombineIcon, X, Divide, PersonStanding, Power } from 'lucide-react';
// import "./App.css";
// import { SidebarItem } from './components/Header/Sidebar';
// import Cookies from 'js-cookie';
// import { Suspense } from 'react';
// import logo from "./assets/img/RwacofLogoCoulRVB.png"

// // Directly imported components
// import AddTransaction from './components/Transactions/AddTransaction';
// import UploadFarmers from './components/Farmers/UploadFarmers';
// import Sidebar from './components/Header/Sidebar';
// import FinancialReportContainer from './components/Reports/FinancialReportContainer';
// import DprContainer from './components/Reports/DprContainer';
// import Logout from './components/Login/Logout';
// import Price from './components/Price/Price';
// import PricingInfo from './components/Price/PricingInfo';
// import ReceiveHarvest from './components/CwsTransactions/ReceiveHarvest';
// import ReceiveHarvestForm from './components/CwsTransactions/RerceiveHarvestForm';
// import ReceivedHarvest from './components/CwsTransactions/ReceivedHarvest';
// import StartProcessingForm from './components/CwsTransactions/StartProcessingForm';
// import BagOff from './components/CwsTransactions/BagOff';
// import BagOffForm from './components/CwsTransactions/BagOffForm';
// import Transfer from './components/CwsTransactions/Transfer';
// import BatchReport from './components/Reports/BatchReport';
// import NewDashboard from './components/Dashboard/Dashboard';
// import DailyPurchaseValidation from './components/Transactions/DailyPurchaseValidation';
// import DailyPurchaseValidationReport from './components/Reports/DailyPurchaseValidation';
// import Loans from './components/Loans/Loans';
// import RequestLoanForm from './components/Loans/RequestLoanForm';
// import LoanRequests from './components/Loans/LoanRequests';
// import { Divider } from 'primereact/divider';
// import AllTransactions from './components/Transactions/AllTransactions';
// import AllFarmers from './components/Farmers/AllFarmers';
// import AddTransactionAdmin from './components/Transactions/AddTransactionAdmin';


// const manager_profile = {
//   "givenName": "Uzamukunda",
//   "mail": "stephanie.uzamukunda@sucafina.com",
//   "displayName": "Stephanie Uzamukunda",
//   "jobTitle": "CWS Manager - Mashesha",
//   "officeLocation": "RWACOF",
//   "surname": "Stephanie",
//   "userPrincipalName": "stephanie.uzamukunda@sucafina.com"
// }

// const others_profile = {
//   "givenName": "Iyuyisenga",
//   "mail": "ibl@sucafina.com",
//   "displayName": "Iyuyisenga Benitha Louange",
//   "jobTitle": "Data Analyst",
//   "officeLocation": "RWACOF",
//   "surname": "Benitha Louange",
//   "userPrincipalName": "ibl@sucafina.com"
// }

// function AppContent() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [token, setToken] = useState(null);
//   const [refreshtoken, setRefreshtoken] = useState(null);
//   const [role, setRole] = useState(null);
//   const [cwsname, setCwsname] = useState(null);
//   const [cwscode, setCwscode] = useState(null);
//   const [cws, setCws] = useState(null);
//   // const [profile, setProfile] = useState(manager_profile);
//   // Cookies.set("profile", JSON.stringify(manager_profile));
//   const [profile, setProfile] = useState(others_profile);
//   Cookies.set("profile",JSON.stringify(others_profile));
//   // const [profile, setProfile] = useState();


//   // get active menu 
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const isActive = (path) => currentPath === path;


//   useEffect(() => {

//     const urlString = window.location.href;
//     const url = new URL(urlString);
//     const profileParam = url.searchParams.get('profile');
//     console.log(profileParam)

//     if (profileParam) {
//       try {
//         const decodedProfileParam = decodeURIComponent(profileParam);
//         const profileData = JSON.parse(profileParam);
//         console.log(profileData)
//         setProfile(profileData);
//         Cookies.set("profile", JSON.stringify(profileData));
//         setToken(profileData.mail)
//       } catch (error) {
//         console.error('Error parsing profile data:', error);
//       }
//     }
//     else if (profile) {
//       console.log("profile")
//       console.log(profile)
//     }
//     else {
//       // fetchProfileData();
//       // window.location.href="/login"
//       window.location.href = "http://192.168.82.127:8000/login";
//     }

//   }, []);



//   if (Cookies.get("profile")) {
//     return (
//       <div>

//         {/* <Router> */}

//         <div className='flex flex-row w-full relative bg-teal-50'>
//           <button
//             className="lg:hidden text-gray-500 w-5 h-5"
//             onClick={() => setIsOpen(true)}
//           >
//             <Bars3Icon className="w-full h-full top-0 bg-teal-500 rounded-md text-white font-bold" />
//           </button>

//           {isOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
//           )}

//           <div
//             className={`fixed inset-y-0 left-0 bg-white p-2 mb-2 flex flex-col lg:relative lg:w-auto min-h-screen max-h-screen transition-all duration-300 transform lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'
//               } z-50 lg:z-auto`}
//           >
//             <button
//               className="absolute top-0 right-0 lg:hidden text-gray-500 mb-4 mt-4 mr-4 w-8 h-8"
//               onClick={() => setIsOpen(false)}
//             >
//               <X className='mb-4 justify-left bg-teal-500 text-white rounded-md' />
//             </button>
//             <Sidebar profile={profile} role={role}>
//               <div>
//                 <img src={logo} className='w-full' />
//               </div>



//               {/* <div className='flex flex-row w-100'>
           
//             <button
//               className="lg:hidden text-gray-500 w-5 h-5"
//               onClick={() => setIsOpen(true)}
//             >
//               <Bars3Icon className="w-5 h-5top-0 bg-teal-500 rounded-md text-white" />
//             </button>
//             <div
//               className={`container-1 fixed bg-white p-2 mb-2 flex flex-col lg:relative w-100 min-h-screen max-h-screen transition-all duration-300 transform lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
//             >
//               <button
//                 className="absolute top-0 right-0 lg:hidden text-gray-500 mb-4 mt-4 mr-4  w-8 h-8"
//                 onClick={() => setIsOpen(false)}
//               >

//                 <X className='mb-4 justify-left bg-teal-500 text-white rounded-md'/>              
//                 </button>


//               <Sidebar profile={profile} role={role}>
                
//               <div>
//                   <img src={logo} className='w-full'/>
//               </div> */}
//               <div className='d-flex flex-column justify-content-between gap-2 mt-5'>
//               {(() => {
//                   if (role === 'cws_manager' || (profile.jobTitle.includes('CWS') && profile.jobTitle.includes('Manager'))) {
//                     return (
//                       <>

//                         <SidebarItem
//                           icon={<Home size={20} />}
//                           text="Dashboard"
//                           alert
//                           component={Link}
//                           to="/"
//                           isActive={isActive('/')}
//                         />
//                         <SidebarItem
//                           icon={<NotebookPen size={20} />}
//                           text="Add Transactions"
//                           alert
//                           component={Link}
//                           to="/add-transaction"
//                           isActive={isActive('/add-transaction')}
//                         />
//                         <SidebarItem
//                           icon={<FileInput size={20} />}
//                           text="All Transactions"
//                           alert
//                           component={Link}
//                           to="/alltransactions"
//                           isActive={isActive('/alltransactions')}
//                         />


//                         {/* <SidebarItem
//                         icon={<FileSpreadsheet size={20} />}
//                         text="Daily Purchase"
//                         alert
//                         component={Link}
//                         to="/daily-purchase"
//                       />
//                       <SidebarItem
//                         icon={<FileSpreadsheet size={20} />}
//                         text="Daily Purchase Validation"
//                         alert
//                         component={Link}
//                         to="/daily-purchase-validation"
//                       /> */}
//                         <SidebarItem
//                           icon={<BoxIcon size={20} />}
//                           text="Receive Harvest"
//                           alert
//                           component={Link}
//                           to="/receive-harvest"
//                           isActive={isActive('/receive-harvest')}
//                         />
//                         <SidebarItem
//                           icon={<Home size={20} />}
//                           text="Processing"
//                           alert
//                           component={Link}
//                           to="/processing"
//                           isActive={isActive('/processing')}
//                         />
//                         <SidebarItem
//                           icon={<Briefcase size={20} />}
//                           text="Bagging Off"
//                           alert
//                           component={Link}
//                           to="/bag-off"
//                           isActive={isActive('/bag-off')}
//                         />
//                         {/* <SidebarItem
//                         icon={<Truck size={20} />}
//                         text="ReadyTo Transfer"
//                         alert
//                         component={Link}
//                         to="/transfer"
//                       /> */}
//                       <br/>
//                         <span className='font-semibold py-4'>Reports</span>
//                         <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
//                         <SidebarItem
//                           icon={<FileSpreadsheet size={20} />}
//                           text="Daily Report"
//                           alert
//                           component={Link}
//                           to="/daily-report"
//                           isActive={isActive('/daily-report')}
//                         />
//                         <SidebarItem
//                           icon={<CombineIcon size={20} />}
//                           text="Batch Report"
//                           alert
//                           component={Link}
//                           to="/batchreport"
//                           isActive={isActive('/batchreport')}
//                         />
//                         {/* <SidebarItem
//                         icon={<CombineIcon size={20} />}
//                         text="Loans"
//                         alert
//                         component={Link}
//                         to="/loans"
//                       /> */}
//                       </>
//                       );
//                     } else if (role === 'Data analyst' || (profile.jobTitle.includes('Data') && profile.jobTitle.includes('Analyst'))) {
//                       return (
//                       <>
//                         <SidebarItem
//                           icon={<Home size={20} />}
//                           text="Dashboard"
//                           alert
//                           component={Link}
//                           to="/"
//                           isActive={isActive('/')}
//                         />
//                         <SidebarItem
//                           icon={<NotebookPen size={20} />}
//                           text="Add Transactions"
//                           alert
//                           component={Link}
//                           to="/add-transaction-admin"
//                           isActive={isActive('/add-transaction-admin')}
//                         />
//                         <SidebarItem
//                           icon={<FileInput size={20} />}
//                           text="All Transactions"
//                           alert
//                           component={Link}
//                           to="/alltransactions"
//                           isActive={isActive('/alltransactions')}
//                         />
//                         <SidebarItem
//                           icon={<BoxIcon size={20} />}
//                           text="Receive Harvest"
//                           alert
//                           component={Link}
//                           to="/receive-harvest"
//                           isActive={isActive('/receive-harvest')}
//                         />
//                         <SidebarItem
//                           icon={<Home size={20} />}
//                           text="Processing"
//                           alert
//                           component={Link}
//                           to="/processing"
//                           isActive={isActive('/processing')}
//                         />
//                         <SidebarItem
//                           icon={<Briefcase size={20} />}
//                           text="Bagging Off"
//                           alert
//                           component={Link}
//                           to="/bag-off"
//                           isActive={isActive('/bag-off')}
//                         />
//                         <SidebarItem
//                           icon={<FileInput size={20} />}
//                           text="Farmers"
//                           alert
//                           component={Link}
//                           to="/all-farmers"
//                           isActive={isActive('/all-farmers')}
//                         />
//                         <SidebarItem
//                           icon={<FileInput size={20} />}
//                           text="Upload Farmer"
//                           alert
//                           component={Link}
//                           to="/upload-farmer"
//                           isActive={isActive('/upload-farmer')}
//                         />
//                         <SidebarItem
//                           icon={<CoinsIcon className='' size={20} />}
//                           text="Station Pricing"
//                           component={Link}
//                           to="/price"
//                           isActive={isActive('/price')}
//                         />
//                         <SidebarItem
//                           icon={<CoinsIcon className='' size={20} />}
//                           text="Pricing Info"
//                           component={Link}
//                           to="/price-info"
//                           isActive={isActive('/price-info')}
//                         />
//                         <span className='font-semibold pl-2 m-2 pt-2'>Reports</span>
//                         <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
//                         <SidebarItem
//                           icon={<FileSpreadsheet size={20} />}
//                           text="Daily Report"
//                           alert
//                           component={Link}
//                           to="/daily-report"
//                           isActive={isActive('/daily-report')}
//                         />
//                           <SidebarItem
//                           icon={<CombineIcon size={20} />}
//                           text="Batch Report"
//                           alert
//                           component={Link}
//                           to="/batchreport"
//                           isActive={isActive('/batchreport')}
//                         />
//                         <SidebarItem
//                           icon={<FileArchive size={20} />}
//                           text="DPR"
//                           alert
//                           component={Link}
//                           to="/dpr"
//                           isActive={isActive('/dpr')}

//                         />
//                         {/* <SidebarItem
//                         icon={<FileArchive size={20} />}
//                         text="Loans"
//                         alert
//                         component={Link}
//                         to="/loan-requests"
//                       />
//                       <SidebarItem
//                         icon={<BookUser className='' size={20} />}
//                         text="Register User"
//                         component={Link}
//                         to="/register-user"
//                       /> */}


//                       </>
//                     )
//                   } else {
//                     return (
//                       <>
//                         <SidebarItem
//                           icon={<Home size={20} />}
//                           text="Dashboard"
//                           alert
//                           component={Link}
//                           to="/"
//                           isActive={isActive('/')}
//                         />
//                         <SidebarItem
//                           icon={<FileInput size={20} />}
//                           text="All Transactions"
//                           alert
//                           component={Link}
//                           to="/alltransactions"
//                           isActive={isActive('/alltransactions')}
//                         />
//                         <SidebarItem
//                           icon={<FileInput size={20} />}
//                           text="Farmers"
//                           alert
//                           component={Link}
//                           to="/all-farmers"
//                           isActive={isActive('/upload-farmer')}
//                         />
//                         <SidebarItem
//                           icon={<FileInput size={20} />}
//                           text="Upload Farmer"
//                           alert
//                           component={Link}
//                           to="/upload-farmer"
//                           isActive={isActive('/upload-farmer')}
//                         />
//                         <SidebarItem
//                           icon={<CoinsIcon className='' size={20} />}
//                           text="Station Pricing"
//                           component={Link}
//                           to="/price"
//                           isActive={isActive('/price')}
//                         />
//                         <SidebarItem
//                           icon={<CoinsIcon className='' size={20} />}
//                           text="Pricing Info"
//                           component={Link}
//                           to="/price-info"
//                           isActive={isActive('/price-info')}
//                         />
//                         <br/>
//                         <span className='font-semibold py-4'>Reports</span>
//                         <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
//                         <SidebarItem
//                           icon={<FileSpreadsheet size={20} />}
//                           text="Daily Report"
//                           alert
//                           component={Link}
//                           to="/daily-report"
//                           isActive={isActive('/daily-report')}
//                         />
//                         {/* <SidebarItem
//                         icon={<FileSpreadsheet size={20} />}
//                         text="Daily Purchase Validation"
//                         alert
//                         component={Link}
//                         to="/daily-purchase-validation"
//                       /> */}
//                         <SidebarItem
//                           icon={<FileArchive size={20} />}
//                           text="DPR"
//                           alert
//                           component={Link}
//                           to="/dpr"
//                           isActive={isActive('/dpr')}

//                         />
//                         {/* <SidebarItem
//                         icon={<FileArchive size={20} />}
//                         text="Loans"
//                         alert
//                         component={Link}
//                         to="/loan-requests"
//                       />
//                       <SidebarItem
//                         icon={<BookUser className='' size={20} />}
//                         text="Register User"
//                         component={Link}
//                         to="/register-user"
//                       /> */}


//                       </>
//                    );
//                   }
//                 })()}
//                 {/* <div className="bg-slate-400 mt-9 text-white rounded-lg">
//                   <SidebarItem
//                     icon={<CircleUserRound size={20} />}
//                     text="Logout"
//                     alert
//                     component={Link}
//                     to="/logout"
//                     isActive={isActive('/logout')}
//                   />
//                 </div> */}

//               </div>

//             </Sidebar>
//           </div>
//           {/* )} */}

//           <div className="container-2 p-0 mx-auto w-100">
//             <div className='card gap-2 bg-slate-300 font-bold flex flex-row' style={{justifyContent:"right"}}>
//                <CircleUserRound/> <p className='pt-2 '>Welcome</p><span className='text-teal-600 pt-2'>{profile.displayName}</span>
//                <div className="bg-slate-300 p-1 text-white rounded-lg">
//                   <SidebarItem
//                     icon={<Power size={20} />}
//                     text="Logout"
//                     alert
//                     component={Link}
//                     to="/logout"
//                     isActive={isActive('/logout')}
//                   />
//                 </div>
//             </div>
//             <Outlet />
//             <Routes>

//               <Route path="/" element={<NewDashboard />} />
//               <Route path="/upload-farmer" element={<UploadFarmers />} />
//               <Route path="/all-farmers" element={<AllFarmers />} />
//               <Route path="/add-transaction" element={<AddTransaction profile={profile} token={token} setToken={setToken} refreshtoken={refreshtoken} role={role} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//               <Route path="/add-transaction-admin" element={<AddTransactionAdmin profile={profile} token={token} setToken={setToken} refreshtoken={refreshtoken} role={role} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//               <Route path="/alltransactions" element={<AllTransactions token={token} />} />
//               <Route path="/daily-purchase" element={<DailyPurchaseValidation token={token} />} />
//               <Route path="/daily-report" element={<FinancialReportContainer token={token} />} />
//               <Route path="/dpr" element={<DprContainer />} />
//               <Route path='/price' element={<Price token={token} />} />
//               <Route path="/login" element={<NewDashboard />} />
//               <Route path='/price-info' element={<PricingInfo token={token} />} />
//               <Route path='/receive-harvest' element={<ReceiveHarvest token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} profile={profile} />} />
//               <Route path='/receive-harvest-form' element={<ReceiveHarvestForm profile={profile} />} />
//               <Route path='/start-processing-form' element={<StartProcessingForm profile={profile} />} />
//               <Route path='/bag-off-form' element={<BagOffForm profile={profile} />} />
//               <Route path="/logout" element={<Logout token={token} setToken={setToken} refreshtoken={refreshtoken} role={role} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} profile={profile} setProfile={setProfile} />} />
//               <Route path='/processing' element={<ReceivedHarvest token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//               <Route path='/bag-off' element={<BagOff token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} profile={profile} />} />
//               <Route path='/daily-purchase-validation' element={<DailyPurchaseValidationReport token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//               <Route path='/transfer' element={<Transfer token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} profile={profile} />} />
//               <Route path='/batchreport' element={<BatchReport token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//               <Route path='/loans' element={<Loans token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//               <Route path='/loan-requests' element={<LoanRequests token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//               <Route path='/request-loan-form' element={<RequestLoanForm />} />
//             </Routes>
//           </div>
//         </div>
//         {/* </Router> */}
//       </div>
//     );

//   }
//   else {
//     return (
//       <div>
//         <h4>Loading...</h4>
//         {/* <Login token={token} setToken={setToken} refreshtoken={refreshtoken} setRefreshtoken={setRefreshtoken} role={role} setRole={setRole} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} setCws={setCws}/> */}
//       </div>
//     );
//   }


// }

// function App() {
//   return (
//     <Router>
//       {/* <Suspense fallback={<div>Loading...</div>}> */}
//       <AppContent />
//       {/* </Suspense> */}
//     </Router>
//   );
// }

// export default App;


// import React, { useState, useEffect, lazy, Suspense } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
// import { Bars3Icon, XCircleIcon } from '@heroicons/react/24/outline';
// import Cookies from 'js-cookie';
// import { Sidebar as FlowbiteSidebar } from 'flowbite-react';
// import './App.css';
// import 'flowbite/dist/flowbite.css';

// // Lazy loaded components
// const AddTransaction = lazy(() => import('./components/Transactions/AddTransaction'));
// const UploadFarmers = lazy(() => import('./components/Farmers/UploadFarmers'));
// const Sidebar = lazy(() => import('./components/Header/Sidebar'));
// const FinancialReportContainer = lazy(() => import('./components/Reports/FinancialReportContainer'));
// const DprContainer = lazy(() => import('./components/Reports/DprContainer'));
// const Logout = lazy(() => import('./components/Login/Logout'));
// const RegisterUsers = lazy(() => import('./components/Login/RegisterUsers'));
// const Price = lazy(() => import('./components/Price/Price'));
// const PricingInfo = lazy(() => import('./components/Price/PricingInfo'));
// // const ReceiveHarvest = lazy(() => import('./components/CwsTransactions/ReceiveHarvest'));
// const ReceiveHarvest=lazy(()=>import('./components/CwsTransactions/ReceiveHarvest'));
// const ReceiveHarvestForm = lazy(() => import('./components/CwsTransactions/RerceiveHarvestForm'));
// const ReceivedHarvest = lazy(() => import('./components/CwsTransactions/ReceivedHarvest'));
// const StartProcessingForm = lazy(() => import('./components/CwsTransactions/StartProcessingForm'));
// const BagOff = lazy(() => import('./components/CwsTransactions/BagOff'));
// const BagOffForm = lazy(() => import('./components/CwsTransactions/BagOffForm'));
// const Transfer = lazy(() => import('./components/CwsTransactions/Transfer'));
// const BatchReport = lazy(() => import('./components/Reports/BatchReport'));
// const NewDashboard = lazy(() => import('./components/Dashboard/Dashboard'));
// const DailyPurchaseValidation = lazy(() => import('./components/Transactions/DailyPurchaseValidation'));
// const DailyPurchaseValidationReport = lazy(() => import('./components/Reports/DailyPurchaseValidation'));
// const Loans = lazy(() => import('./components/Loans/Loans'));
// const RequestLoanForm = lazy(() => import('./components/Loans/RequestLoanForm'));
// const LoanRequests = lazy(() => import('./components/Loans/LoanRequests'));

// const manager_profile = {
//   "givenName": "Uzamukunda",
//   "mail": "stephanie.uzamukunda@sucafina.com",
//   "displayName": "Stephanie Uzamukunda",
//   "jobTitle": "CWS Manager - Mashesha",
//   "officeLocation": "RWACOF",
//   "surname": "Stephanie",
//   "userPrincipalName": "stephanie.uzamukunda@sucafina.com"
// };

// const others_profile = {
//   "givenName": "Iyuyisenga",
//   "mail": "ibl@sucafina.com",
//   "displayName": "Iyuyisenga Benitha Louange",
//   "jobTitle": "Data Analyst",
//   "officeLocation": "RWACOF",
//   "surname": "Benitha Louange",
//   "userPrincipalName": "ibl@sucafina.com"
// };

// function App() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [token, setToken] = useState(null);
//   const [refreshtoken, setRefreshtoken] = useState(null);
//   const [role, setRole] = useState(null);
//   const [cwsname, setCwsname] = useState(null);
//   const [cwscode, setCwscode] = useState(null);
//   const [cws, setCws] = useState(null);
  // const [profile, setProfile] = useState(others_profile);
  // Cookies.set("profile", others_profile);

//   useEffect(() => {
//     const urlString = window.location.href;
//     const url = new URL(urlString);
//     const profileParam = url.searchParams.get('profile');

//     if (profileParam) {
//       try {
//         const decodedProfileParam = decodeURIComponent(profileParam);
//         const profileData = JSON.parse(profileParam);
//         setProfile(profileData);
//         Cookies.set("profile", profileData);
//         setToken(profileData.mail);
//       } catch (error) {
//         console.error('Error parsing profile data:', error);
//       }
//     } else if (profile) {
//       console.log(profile);
//     } else {
//       window.location.href = "http://192.168.82.127:8000/login";
//     }
//   }, [profile]);

//   if (Cookies.get("profile")) {
//     return (
//       <div className="flex flex-row min-h-screen">
//         <Router>
//           <Suspense fallback={<div>Loading...</div>}>
//             <button
//               className="lg:hidden text-gray-500 p-2"
//               onClick={() => setIsOpen(true)}
//             >
//               <Bars3Icon className="w-5 h-5" />
//             </button>

//             <div
//               className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
//               onClick={() => setIsOpen(false)}
//             />

//             <div
//               className={`fixed inset-y-0 left-0 transform lg:relative lg:transform-none z-50 w-64 bg-white overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
//             >
//               <button
//                 className="absolute top-0 right-0 lg:hidden text-gray-500 mt-4 mr-4"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <XCircleIcon className="h-8 w-8" />
//               </button>
//               <Sidebar profile={profile} role={role} />
//             </div>

//             <div className="flex-1 p-6 lg:ml-64">
//               <Outlet />
//               <Routes>
//                 <Route path="/" element={<NewDashboard />} />
//                 <Route path="/upload-farmer" element={<UploadFarmers />} />
//                 <Route path="/add-transaction" element={<AddTransaction profile={profile} token={token} setToken={setToken} refreshtoken={refreshtoken} role={role} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//                 <Route path="/daily-purchase" element={<DailyPurchaseValidation token={token} />} />
//                 <Route path="/daily-report" element={<FinancialReportContainer token={token} />} />
//                 <Route path="/dpr" element={<DprContainer />} />
//                 <Route path='/register-user' element={<RegisterUsers token={token} />} />
//                 <Route path='/price' element={<Price token={token} />} />
//                 <Route path="/login" element={<NewDashboard />} />
//                 <Route path='/price-info' element={<PricingInfo token={token} />} />
//                 <Route path='/receive-harvest' element={<ReceiveHarvest token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} profile={profile} />} />
//                 <Route path='/receive-harvest-form' element={<ReceiveHarvestForm profile={profile} />} />
//                 <Route path='/start-processing-form' element={<StartProcessingForm />} />
//                 <Route path='/bag-off-form' element={<BagOffForm />} />
//                 <Route path="/logout" element={<Logout token={token} setToken={setToken} refreshtoken={refreshtoken} role={role} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} profile={profile} setProfile={setProfile} />} />
//                 <Route path='/processing' element={<ReceivedHarvest token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//                 <Route path='/bag-off' element={<BagOff token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//                 <Route path='/daily-purchase-validation' element={<DailyPurchaseValidationReport token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//                 <Route path='/transfer' element={<Transfer token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//                 <Route path='/batchreport' element={<BatchReport token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//                 <Route path='/loans' element={<Loans token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//                 <Route path='/loan-requests' element={<LoanRequests token={token} cwsname={cwsname} setCwscode={setCwscode} setCwsname={setCwsname} cwscode={cwscode} cws={cws} />} />
//                 <Route path='/request-loan-form' element={<RequestLoanForm />} />
//               </Routes>
//             </div>
//           </Suspense>
//         </Router>
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         <h4>Loading...</h4>
//       </div>
//     );
//   }
// }

// export default App;

