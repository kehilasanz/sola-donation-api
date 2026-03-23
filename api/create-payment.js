export default async function handler(req, res) {

  // ✅ CORS HEADERS (MUST BE FIRST)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ HANDLE PREFLIGHT (THIS FIXES YOUR ERROR)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ SAFE BODY PARSE
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const { amount, name, email } = body;

    // ✅ CALL SOLA
    const response = await fetch("https://api.sola.co/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SOLA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: "USD",
        customer: {
          name,
          email
        },
        description: "Donation"
      })
    });

    const data = await response.json();

    // ✅ DEBUG (VERY IMPORTANT)
    console.log("SOLA RESPONSE:", data);

    return res.status(200).json({
      checkoutUrl: data.checkout_url || data.url || data.payment_url
    });

  } catch (err) {
    console.error("FULL ERROR:", err);

    return res.status(500).json({
      error: err.message || "Payment failed"
    });
  }
}
