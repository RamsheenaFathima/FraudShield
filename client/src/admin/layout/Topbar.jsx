export default function Topbar() {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  return (
    <div className="topbar" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px"
    }}>
      
      <input placeholder="Search..." />

      

      <button onClick={handleLogout} className="btn">
        Logout
      </button>

    </div>
  );
}