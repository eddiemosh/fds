const express = require('express');
const stripe = require('stripe')('your-secret-key');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/charge', async (req, res) => {
    const { stripeToken, name, email, dogName } = req.body;

    try {
        const charge = await stripe.charges.create({
            amount: 1000,
            currency: 'usd',
            source: stripeToken,
            description: `Registration fee for ${dogName}`,
            receipt_email: email,
        });

        res.send('Payment successful!');
    } catch (err) {
        res.status(500).send(`Payment failed: ${err.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
