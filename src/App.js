import { useState } from "react";

const API = "https://zonguru-api.onrender.com"; // <-- မင်း backend link

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState(0);

  // register
  const register = async () => {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message);
  };

  // login
  const login = async () => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      setUser(username);
    } else {
      alert("Login Failed");
    }
  };

  // deposit
  const deposit = async () => {
    const amount = prompt("Enter amount");

    const res = await fetch(API + "/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, amount })
    });

    const data = await res.json();
    setBalance(data.balance);
  };

  // withdraw
  const withdraw = async () => {
    const amount = prompt("Enter amount");

    const res = await fetch(API + "/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, amount })
    });

    const data = await res.json();

    if (data.success) {
      setBalance(data.balance);
    } else {
      alert("Not enough balance");
    }
  };

  // logged in screen
  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Welcome {user}</h1>
        <h2>Balance: {balance}</h2>

        <button onClick={deposit}>Deposit</button>
        <button onClick={withdraw}>Withdraw</button>
      </div>
    );
  }

  // login screen
  return (
    <div style={{ padding: 20 }}>
      <h1>Zonguru Login</h1>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
