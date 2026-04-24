import { useState, useEffect } from "react";

const API = "https://zonguru-jack-api.onrender.com";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState([]);

  // 🔥 REGISTER
  const register = async () => {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  // 🔥 LOGIN
  const login = async () => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      setUser(data);
      setBalance(data.balance);
    }
  };

  // 🔥 GET PRODUCTS
  const getProducts = async () => {
    const res = await fetch(API + "/products");
    const data = await res.json();
    setProducts(data);
  };

  // 🔥 LOAD PRODUCTS AFTER LOGIN
  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [user]);

  // 🔥 ADD BALANCE
  const addBalance = async () => {
    const res = await fetch(API + "/add-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        amount: 100
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Balance added");
      setBalance(data.balance);
    }
  };

  // 🔥 BUY PRODUCT
  const buyProduct = async (id) => {
    const res = await fetch(API + "/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        productId: id
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Purchase success");
      setBalance(data.balance);
    }
  };

  // 🔥 UI
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login / Register</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome {user.username}</h2>

      <h3>Balance: ${balance}</h3>
      <button onClick={addBalance}>Add $100</button>

      <h2>Products</h2>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              margin: 10,
              padding: 10,
              width: 200
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              width="100%"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200";
              }}
            />

            <h4>{p.name}</h4>
            <p>${p.price}</p>

            <button onClick={() => buyProduct(p._id)}>
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
            }
