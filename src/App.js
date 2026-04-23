import { useState } from "react";

const API = "https://zonguru-jack-api.onrender.com";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState(0);

  // REGISTER
  const register = async () => {
    alert("Register clicked");

    try {
      alert("Sending request...");

      const res = await fetch(API + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      alert("Request sent");

      const data = await res.json();
      alert(data.message || JSON.stringify(data));

    } catch (err) {
      alert("ERROR: " + err.message);
    }
  };

  // LOGIN
  const login = async () => {
    alert("Login clicked");

    try {
      alert("Sending request...");

      const res = await fetch(API + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      alert("Request sent");

      const data = await res.json();
      alert(data.message || JSON.stringify(data));

      if (data.success) {
        setUser(username);
        setBalance(data.balance || 0);
      }

    } catch (err) {
      alert("ERROR: " + err.message);
    }
  };

  // DEPOSIT
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

  // WITHDRAW
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

  // AFTER LOGIN
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

  // LOGIN SCREEN
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
