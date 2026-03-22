module.exports = async function handler(req, res) {

  // ✅ FIX CORS (THIS WAS YOUR ISSUE)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const { amount, name, email } = body;

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

    console.log("SOLA RESPONSE:", data);

    res.status(200).json({
      checkoutUrl: data.checkout_url || data.url || data.payment_url
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment failed" });
  }
};
