# PayFlux
PayFlux: Unified Payment Orchestrator

### **Overview**

**PayFlux** is a **full-stack payment orchestration simulation platform** that demonstrates how a modern fintech gateway can intelligently route and process payments using multiple virtual gateways like Razorpay, Stripe, and Cashfree.
It allows users to simulate real-world payment scenarios, view live transaction history, and even generate downloadable invoices — all through a clean, responsive web interface.

---

### **Tech Stack**

| Layer               | Technology                              | Description                                                   |
| ------------------- | --------------------------------------- | ------------------------------------------------------------- |
| **Frontend**        | HTML5, CSS3, Vanilla JS                 | Interactive UI, responsive layout, invoice generation (jsPDF) |
| **Backend**         | Node.js, Express.js                     | REST API for payments and transaction history                 |
| **Database**        | PostgreSQL (via Prisma ORM)             | Stores simulated transaction records                          |
| **ORM**             | Prisma                                  | Simplified database queries and schema migrations             |
| **Deployment**      | Frontend – Vercel <br> Backend – Render | Full cloud deployment using free-tier hosting                 |
| **Version Control** | Git & GitHub                            | Project versioning and deployment integration                 |

---

### **Core Features**

#### 1. **Payment Simulation**

* User enters **amount, recipient, description, and payment method** (UPI, Card, or NetBanking).
* Backend **intelligently routes** the payment to a preferred gateway (Razorpay, Stripe, or Cashfree).
* Each transaction generates:

  * Unique transaction ID (auto-formatted)
  * Gateway name
  * Payment method & subtype (e.g., *Card (Visa)*, *UPI (Paytm)*)
  * Status (Success/Failed)
  * Timestamp

---

#### 2. **Transaction History**

* Displays all past simulated transactions in a responsive table.
* Uses Prisma to fetch data from PostgreSQL in descending order by date.
* Each row shows:

  * ID, Amount, Method, Gateway, Transaction ID, Status, and Timestamp.
* Color-coded success/failure for better visibility.

---

#### 3. **Invoice Generation**

* Clicking a transaction opens a **modal** displaying invoice details.
* User can **download the invoice as a PDF** using **jsPDF**.
* Automatically includes transaction metadata, recipient, date, and status.

---

#### 4. **Toast Notifications**

* Instant pop-up feedback on success or failure of payments.
* Auto-dismiss animations with smooth fade-out.

---

### **Directory Structure**

```
payflux/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   └── paymentRoutes.js
│   │   └── db/
│   │       └── prismaClient.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── index.html
    ├── style.css
    ├── script.js
    └── assets/
        ├── logo.svg
        └── favicon.ico
```

---

### **Conclusion**

**PayFlux** demonstrates how payment orchestration systems work — routing transactions efficiently across gateways with reliability and transparency.
The project is a perfect blend of **frontend UX, backend logic, and database management**, deployed on modern cloud platforms for a realistic, production-like experience.

---