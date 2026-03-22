module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { amount, name, email } = req.body;

  try {
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

    res.status(200).json({
      checkoutUrl: data.checkout_url || data.url
    });

  } catch (err) {
    res.status(500).json({ error: "Payment failed" });
  }
};
