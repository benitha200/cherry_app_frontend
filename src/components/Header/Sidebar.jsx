
// import { useContext, createContext, useState } from "react";
// import React from "react";
// import logo from "../../assets/img/RwacofLogoCoulRVB.png";
// import { Link } from "react-router-dom";
// import { Sidebar as FlowbiteSidebar } from "flowbite-react";

// const SidebarContext = createContext();

// export default function Sidebar({ children }) {
//   const [expanded, setExpanded] = useState(true);

//   return (
//     <FlowbiteSidebar className="h-screen">
//       <SidebarContext.Provider value={{ expanded }}>
//         <ul className="flex-1 px-3">{children}</ul>
//       </SidebarContext.Provider>
//     </FlowbiteSidebar>
//   );
// }


// export const SidebarItem = ({ icon, text, alert, component, to, isActive }) => {
//   return (
//     <Link
//       to={to}
//       className={`flex items-center p-2 my-1 text-gray-700 rounded-md transition-colors duration-200 ${
//         isActive ? 'bg-teal-600 text-white' : 'hover:bg-gray-200'
//       }`}
//     >
//       {icon}
//       <span className="ml-3">{text}</span>
//       {/* {alert && <span className="ml-auto text-xs text-red-600">!</span>} */}
//     </Link>
//   );
// };

import React, { useContext, createContext, useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import logo from "../../assets/img/RwacofLogoCoulRVB.png";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <FlowbiteSidebar className="h-screen bg-white shadow-lg">
      {/* <div className="p-4 mb-6">
        <img src={logo} alt="Rwacof Logo" className="w-32 mx-auto" />
      </div> */}
      <SidebarContext.Provider value={{ expanded }}>
        <nav className="flex-1 space-y-1 px-1">
          {children}
        </nav>
      </SidebarContext.Provider>
    </FlowbiteSidebar>
  );
}

export const SidebarItem = ({ icon, text, to, isActive }) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center p-2 rounded-lg transition-all duration-200 ease-in-out
        ${isActive 
          ? 'bg-teal-600 text-white shadow-md' 
          : 'text-gray-700 hover:bg-gray-100'
        }
      `}
    >
      <span className={`text-xl ${isActive ? 'text-white' : 'text-teal-600'}`}>
        {icon}
      </span>
      <span className="ml-3 font-medium">{text}</span>
    </Link>
  );
};