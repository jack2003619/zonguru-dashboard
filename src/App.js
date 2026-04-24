import { useState, useEffect } from "react";

const API = "https://zonguru-jack-api.onrender.com";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState([]);

  // ======================
  // LOAD PRODUCTS
  // ======================
  const loadProducts = async () => {
    try {
      const res = await fetch(API + "/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ======================
  // REGISTER
  // ======================
  const register = async () => {
    try {
      const res = await fetch(API + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      alert("Registered!");
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // LOGIN
  // ======================
  const login = async () => {
    try {
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.error) {
        alert("Login failed");
      } else {
        setUser(data);
        setBalance(data.balance);
        alert("Login success");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <div style={{ padding: "20px" }}>
      <h1>Zonguru Dashboard</h1>

      {/* LOGIN / REGISTER */}
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={register}>Register</button>
      <button onClick={login} style={{ marginLeft: "10px" }}>Login</button>

      <hr />

      {/* USER INFO */}
      {user && (
        <div>
          <h2>Welcome {user.username}</h2>
          <p>Balance: ${balance}</p>
          <p>VIP Level: {user.vipLevel}</p>
        </div>
      )}

      <hr />

      {/* PRODUCTS */}
      <h2>Products</h2>

      {products.map(p => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px",
            borderRadius: "10px"
          }}
        >
          <img src={p.image} width="120" alt="" />
          <h3>{p.name}</h3>
          <p>Price: ${p.price}</p>
          <p>VIP: {p.vipLevel}</p>
        </div>
      ))}
    </div>
  );
          }
