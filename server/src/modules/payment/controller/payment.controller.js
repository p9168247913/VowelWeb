const stripe = require('stripe')("sk_test_51P4FPRSJ4lv8dWzjdvsgsiKqjeanJpw58n9MXGUHmYltkmfGhwFXVfQxpsS37UxiMrGSHQVnF1KECZBtHg2J2xxr00FzkXFI4Y");
const pick = require('../../../utils/pick');
const cartservice = require('../../cart/service')

const stripePayment = async (req, res) => {
    const { lineItems, customerName, customerAddress, selectedProducts } = req.body;
    console.log(req.body);
    try {
        // Create a customer in Stripe
        console.log(customerAddress?.country )
        const customer = await stripe.customers.create({
            name: customerName,
            address: {
                line1: customerAddress.line1,
                line2: customerAddress.line2,
                city: customerAddress.city,
                state: customerAddress.state,
                country: "US",
                postal_code: customerAddress.postal_code,
            },
        });

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/success',  // Change these URLs as needed
            cancel_url: 'http://localhost:3000/cancel',  // Change these URLs as needed
            customer: customer.id,
        });

        selectedProducts.map((id)=>{
            const response = cartservice.deleteCart(id)
        })


        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = stripePayment;