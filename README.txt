ZONGURU READY PACKAGE

1) BACKEND
Upload the contents of backend/ to your Render-linked GitHub repository.

Render:
Build Command: npm install
Start Command: node server.js

Required Environment Variables:
MONGO_URL = your MongoDB Atlas connection string
JWT_SECRET = a long random secret

Optional:
ADMIN_USERNAME = admin
ADMIN_PASSWORD = ChangeMe123!

The backend creates the admin account on first startup if it does not already exist.

2) FRONTEND
Upload the contents of frontend/ to the GitHub Pages repository.

The frontend files already point to:
https://zonguru-jack-api.onrender.com

3) IMPORTANT
Deposit and withdrawal are REQUEST systems in this package. They do not connect to a real bank, card, or crypto payment processor. Admin approval changes the internal demo/account ledger.

Products Optimize is an internal product workflow. It requires sufficient account balance and records the generated profit in the user's account.

4) FIRST TEST
Register a normal user.
Login.
Open Products Optimize.
Use the admin account to set a user's test balance if needed.
Create a deposit/withdraw request and approve/reject it from admin.html.

5) SECURITY
Change ADMIN_PASSWORD and JWT_SECRET on Render before real use.
Do not put MongoDB credentials in frontend files.
