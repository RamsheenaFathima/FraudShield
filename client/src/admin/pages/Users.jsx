export default function Users() {
  const users = [
    { id: 1, name: "Rahul", risk: "Low" },
    { id: 2, name: "Ayesha", risk: "High" },
    { id: 3, name: "John", risk: "Medium" },
  ];

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1 style={{ color: "white" }}>Users Overview 👥</h1>

      <div className="grid">
        {users.map((u) => (
          <div key={u.id} className="card">
            <h3>{u.name}</h3>
            <p>Risk Level: {u.risk}</p>
          </div>
        ))}
      </div>
    </div>
  );
}