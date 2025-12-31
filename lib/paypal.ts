const PAYPAL_API = process.env.NODE_ENV === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

export async function getPayPalAccessToken(): Promise<string> {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json();
    return data.access_token;
}

export async function createPayPalOrder(totalAmount: number, description: string) {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
            {
            amount: {
                currency_code: 'USD',
                value: totalAmount.toFixed(2),
            },
            description,
            },
        ],
        application_context: {
            brand_name: 'Alquiler de Autos',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
        }
        }),
        cache: 'no-store',
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('PayPal Error:', error);
        throw new Error('Failed to create PayPal order');
    }

    return await response.json();
}

export async function capturePayPalOrder(orderId: string) {
    const accessToken = await getPayPalAccessToken();
    
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

    if (!response.ok) {
        const error = await response.json();
        console.error('PayPal Capture Error:', error);
        throw new Error('Failed to capture PayPal payment');
    }

    return await response.json();
}