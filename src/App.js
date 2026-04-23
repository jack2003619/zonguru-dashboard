import { useState } from "react";

const API = "https://zonguru-jack-api.onrender.com";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState(0);

  // register
  const register = async () => {
    alert("Register clicked");

    try {
      const res = await fetch(API + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      alert("Request sent");

      const data = await res.json();
      alert(JSON.stringify(data));

    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // login
  const login = async () => {
    alert("Login clicked");

    try {
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      alert("Request sent");

      const data = await res.json();
      alert(JSON.stringify(data));

      if (data.success) {
        setUser(data.user);
        setBalance(data.balance);
      }

    } catch (err) {
      alert("Error: " + err.message);
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
