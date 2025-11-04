const payBtn = document.getElementById("payBtn");
const statusBox = document.getElementById("statusBox");
const statusText = document.getElementById("statusText");
const historyBody = document.getElementById("historyBody");

const API_BASE = "http://localhost:5000/api";

// Fetch and display transaction history
async function fetchHistory() {
  try {
    const res = await fetch(`${API_BASE}/history`);
    const data = await res.json();

    historyBody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      historyBody.innerHTML = "<tr><td colspan='7'>No transactions yet</td></tr>";
      return;
    }

    data.reverse().forEach((tx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.id}</td>
        <td>₹${tx.amount}</td>
        <td>${tx.method || "N/A"}</td>
        <td>${tx.gateway ? tx.gateway.toUpperCase() : "Auto"}</td>
        <td>${tx.transactionId || "-"}</td>
        <td style="color: ${
          tx.status === "Success" ? "var(--success)" : "var(--error)"
        }">${tx.status}</td>
        <td>${new Date(tx.createdAt).toLocaleString()}</td>
      `;
      historyBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading history:", err);
    historyBody.innerHTML = "<tr><td colspan='7'>Failed to load history</td></tr>";
  }
}

// Simulate payment
async function simulatePayment() {
  const amount = document.getElementById("amount").value.trim();
  const method = document.getElementById("method").value.trim();
  const subtype = document.getElementById("subtype")?.value || null;
  const recipient = document.getElementById("recipient").value.trim() || "Demo Merchant";
  const description =
    document.getElementById("description").value.trim() || `Payment via ${method}`;

  if (!amount || amount <= 0) {
    showToast("Please enter a valid amount!", "error");
    return;
  }

  payBtn.disabled = true;
  statusBox.classList.remove("hidden");
  statusText.textContent = "Routing to best payment gateway...";

  await new Promise((r) => setTimeout(r, 1200));

  try {
    const res = await fetch(`${API_BASE}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        method,
        recipient,
        description,
        subtype,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast(`✅ Payment via ${data.gateway.toUpperCase()} successful!`);
      fetchHistory();
    } else {
      showToast(data.error || "Payment Failed ❌", "error");
    }
  } catch (err) {
    console.error("Error processing payment:", err);
    showToast("Network Error ❌", "error");
  } finally {
    payBtn.disabled = false;
    statusBox.classList.add("hidden");
  }
}

// Toast notification
function showToast(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  if (type === "error") toast.style.background = "var(--error)";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Dynamic subtype (UPI / Card / Bank)
document.getElementById("method").addEventListener("change", (e) => {
  const val = e.target.value;
  document.getElementById("subtypeGroup")?.remove();

  if (["upi", "card", "netbanking"].includes(val)) {
    const subtypeGroup = document.createElement("div");
    subtypeGroup.className = "input-group";
    subtypeGroup.id = "subtypeGroup";

    const label = document.createElement("label");
    label.textContent =
      val === "card" ? "Card Type" : val === "upi" ? "UPI App" : "Bank Name";

    const select = document.createElement("select");
    select.id = "subtype";

    const options =
      val === "card"
        ? ["Visa", "MasterCard", "RuPay"]
        : val === "upi"
        ? ["Paytm", "GooglePay"]
        : ["HDFC", "ICICI", "SBI", "Axis", "Kotak"];

    options.forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      select.appendChild(o);
    });

    subtypeGroup.appendChild(label);
    subtypeGroup.appendChild(select);

    const methodGroup = document.getElementById("method").parentElement;
    methodGroup.insertAdjacentElement("afterend", subtypeGroup);
  }
});

payBtn.addEventListener("click", simulatePayment);
fetchHistory();
