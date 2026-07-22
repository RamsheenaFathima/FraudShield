import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT MAIN AREA */}
      <div className="main">
        
        {/* TOP NAVBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <div className="content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}