// trigger deploy
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { amount, name, email } = req.body;

  try {
    const response = await fetch("https://api.sola.co/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": "Bearer hachhatorebmeirbaalhaned87fba933d784b18889f4a",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: "USD",
        customer: { name, email }
      })
    });

    const data = await response.json();

    res.status(200).json({
      checkoutUrl: data.checkout_url || data.url
    });

  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
}
