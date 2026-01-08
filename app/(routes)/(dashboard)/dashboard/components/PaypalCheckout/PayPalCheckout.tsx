"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayPalCheckoutProps } from "./PaypalCheckout.types";

export function PayPalCheckout(props: PayPalCheckoutProps) {
    const { carId, carName, priceDay, startDate, endDate } = props;

    // Initialize router and states
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalAmount = Number(priceDay) * numberOfDays;

    // Create order in database and payment intent
    const createOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            // Petition to API checkout for order creation
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    carId,
                    carName,
                    priceDay,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                }),
            });

            // Check for errors
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error al crear la orden");
                }

            // Store Paypal data
            const data = await response.json();

            // Return PayPal order ID
            return data.paypalOrderId;
        // Check errors
        } catch (error) {
            const errMsg = error instanceof Error ? error.message: "Error"
            setError(errMsg);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Handle successful payment approval
    const onApprove = async (data: any) => {
        try {
            setLoading(true);
            
            // Send capture request to PayPal 
            const response = await fetch("/api/checkout/capture", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                paypalOrderId: data.orderID,
                }),
            });

            // Check for error
            if (!response.ok) {
                throw new Error("Error al procesar el pago");
            }

            // Store payment capture data
            const captureData = await response.json();

            // Redirect to order confirmation page and refresh
            router.push(`/order-confirmation/${captureData.order.id}`);
            router.refresh();
            
        // Check for errors
        } catch (error) {
            const errMsg = error instanceof Error ? error.message: "Error"
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    }

    // Show error
    const onError = (error: any) => {
        console.error("PayPal Checkout Error:", error);
    };

    // Show cancellation message
    const onCancel = () => {
        setError("Payment cancelled");
    }
    
    return (
    <div className="w-full">
        <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Reservation Summary</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{carName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Rental Days:</span>
                    <span className="font-medium">{numberOfDays}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Price per Day:</span>
                    <span className="font-medium">${priceDay}</span>
                </div>
                <div className="flex justify-between pt-3 border-t text-lg">
                    <span className="font-bold">Total to Pay:</span>
                    <span className="font-bold text-blue-600">${totalAmount}</span>
                </div>
            </div>
        </div>

        {loading && (
            <div className="text-center py-6 mb-4">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-3">Processing payment...</p>
            </div>
        )}

        {!loading && (
            <PayPalScriptProvider
                options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                    currency: "USD",
                    intent: "capture",
                }}
            >
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={onCancel}
                    style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "paypal",
                        height: 48,
                    }}
                />
            </PayPalScriptProvider>
        )}

        {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
        )}
    </div>
    );
}
