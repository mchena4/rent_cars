import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { capturePayPalOrder } from "@/lib/paypal";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { paypalOrderId } = await req.json();

        // Check if userId exists
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if Order exists
        if (!paypalOrderId) {
            return new NextResponse("PayPal Order ID is required", { status: 400 });
        }
        
        // Get order
        const order = await prisma.order.findFirst({
            where: { paypalOrderId },
        });

        // Message if Order not found
        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        // Check if userId matches
        if (order.userId !== userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Store capture data
        const captureData = await capturePayPalOrder(paypalOrderId);

        // Update order in database as confirmed
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                status: "confirmed",
                paypalPayerId: captureData.payer.payer_id,
            },
        });

        // Respond with success
        return NextResponse.json(
            {
                success: true,
                order: updatedOrder,
                captureData,
            },
            { headers: corsHeaders }
        );

    // Check for error
    } catch (error) {
        console.error("[CAPTURE_ERROR]", error);
        return new NextResponse(
            "Internal Server Error",
            { status: 500, headers: corsHeaders }
        );
    }
}