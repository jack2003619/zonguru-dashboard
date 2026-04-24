import { useState, useEffect } from "react";

const API = "https://zonguru-jack-api.onrender.com";

export default function App() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetch(API + "/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const register = async () => {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message || "Registered");
  };

  const login = async () => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      setBalance(data.user.balance);
      alert("Login success");
    } else {
      alert("Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    setBalance(0);
  };

  const buy = async (price) => {
    const res = await fetch(API + "/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        price
      })
    });

    const data = await res.json();

    if (data.balance !== undefined) {
      setBalance(data.balance);
      alert("Purchased!");
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Zonguru Shop</h2>

      {/* Login/Register */}
      {!user && (
        <div>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </div>
      )}

      {/* Logged In */}
      {user && (
        <div>
          <h3>Welcome {user.username}</h3>
          <p>Balance: ${balance}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}

      {/* Products */}
      <h3>Products</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <img src={p.image} width="100%" alt="" />
            <h4>{p.name}</h4>
            <p>${p.price}</p>

            {user && (
              <button onClick={() => buy(p.price)}>Buy</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
