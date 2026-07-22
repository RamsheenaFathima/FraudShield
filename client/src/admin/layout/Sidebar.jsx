import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
   <div className="sidebar">
      <h2 style={{ color: "cyan" }}>MenuBar</h2>
      
       <a href="/admin">Dashboard</a>
      <a href="/admin/transactions">Transactions</a>
      <a href="/admin/analytics">Analytics</a>
      <a href="/admin/users">Users</a>
      <a href="/admin/alerts">Alerts</a>
     
      
    </div>
  );
}