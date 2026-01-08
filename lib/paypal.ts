const PAYPAL_API = 'https://api-m.paypal.com' 

// Get access token for PayPal API
export async function getPayPalAccessToken(): Promise<string> {
    // Credentials with Basic
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    // Petition for Token
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
        cache: 'no-store',
    });

    // Check for errors
    if (!response.ok) {
        throw new Error('Failed to get PayPal access token');
    }

    // Parse JSON response
    const data = await response.json();
    return data.access_token;
}

// Payment order in PayPal
export async function createPayPalOrder(totalAmount: number, description: string) {
    const accessToken = await getPayPalAccessToken();

    // 
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            // Array of items that are being purchased
            purchase_units: [
            {
            // Price details
            amount: {
                currency_code: 'USD',
                value: totalAmount.toFixed(2),
            },
            description,
            },
        ],
        // User experience details
        application_context: {
            brand_name: 'Rent Cars',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
        }
        }),
        cache: 'no-store',
    });

    // Check for errors
    if (!response.ok) {
        const error = await response.json();
        console.error('PayPal Error:', error);
        throw new Error('Failed to create PayPal order');
    }

    return await response.json();
}

// Capture payment order in PayPal
export async function capturePayPalOrder(orderId: string) {
    const accessToken = await getPayPalAccessToken();
    
    // Petition with order ID (check and validate payment)
    const response = await fetch(
        `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    });

    // Check for errors
    if (!response.ok) {
        const error = await response.json();
        console.error('PayPal Capture Error:', error);
        throw new Error('Failed to capture PayPal payment');
    }

    return await response.json();
}