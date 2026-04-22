import React, { useState } from "react";
import axios from "axios";

const API = "https://zonguru-jack-api.onrender.com";

function App() {
  const [user, setUser] = useState("");
  const [amount, setAmount] = useState("");

  const deposit = async () => {
    const res = await axios.post(`${API}/deposit`, {
      user,
      amount
    });
    alert("Balance: " + res.data.balance);
  };

  const withdraw = async () => {
    const res = await axios.post(`${API}/withdraw`, {
      user,
      amount
    });
    alert("Balance: " + res.data.balance);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Zonguru Admin Dashboard</h1>

      <input placeholder="User" onChange={e => setUser(e.target.value)} />
      <br /><br />

      <input placeholder="Amount" onChange={e => setAmount(e.target.value)} />
      <br /><br />

      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
}

export default App;
