import { useState, useEffect } from "react";

const API = "https://zonguru-jack-api.onrender.com";

export default function App() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("USDT");
  const [depositAddresses, setDepositAddresses] = useState({});

  useEffect(() => {
    fetch(API + "/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const loadPlatformSettings = async () => {
    try {
      const res = await fetch(API + "/api/public/deposit-addresses");
      const data = await res.json();
      setDepositAddresses(data.addresses || {});
    } catch (_) {}
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await fetch(API + "/api/me", { headers: { Authorization: "Bearer " + (localStorage.getItem("zonguru_token") || "") } });
      const data = await res.json();
      if (data.user) { setUser(data.user); setBalance(data.user.balance || 0); setCurrency(data.user.currency || "USDT"); }
      await loadPlatformSettings();
    } catch (_) {}
  };

  const changeCurrency = async (next) => {
    setCurrency(next);
    try {
      const res = await fetch(API + "/api/me/profile", { method:"PATCH", headers:{"Content-Type":"application/json",Authorization:"Bearer "+(localStorage.getItem("zonguru_token")||"")}, body:JSON.stringify({username:user.username,email:user.email,phone:user.phone,currency:next}) });
      const data = await res.json();
      if (data.user) setUser(data.user); else alert(data.message || "Currency update failed");
    } catch (_) { alert("Currency update failed"); }
  };

  const register = async () => {
    const res = await fetch(API + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message || "Registered");
  };

  const login = async () => {
    const res = await fetch(API + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      setBalance(data.user.balance);
      localStorage.setItem("zonguru_token", data.token || "");
      setCurrency(data.user.currency || "USDT");
      loadPlatformSettings();
      alert("Login success");
    } else {
      alert("Login failed");
    }
  };

  useEffect(() => { if (!user) return; loadPlatformSettings(); const timer=setInterval(refreshUser,3000); return () => clearInterval(timer); }, [user]);

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
          <p>Balance: {balance} {currency}</p>
          <label>Currency</label>
          <select value={currency} onChange={(e)=>changeCurrency(e.target.value)}>
            <option value="USDT">USDT</option><option value="BTC">BTC</option><option value="ETH">ETH</option>
          </select>
          <h4>Deposit Addresses</h4>
          <div>USDT TRC20: {depositAddresses["USDT-TRC20"] || "-"}</div>
          <div>USDT ERC20: {depositAddresses["USDT-ERC20"] || "-"}</div>
          <div>ETH ERC20: {depositAddresses["ETH-ERC20"] || "-"}</div>
          <div>BTC: {depositAddresses["BTC-BTC"] || "-"}</div>
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
