import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createPayPalOrder } from "@/lib/paypal";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(req: Request) {
    const { userId } = await auth();
    const {carId, priceDay, startDate, endDate, carName} = await req.json()

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!carId) {
        return new NextResponse("Car ID is required", { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    const totalAmount = Number(priceDay * numberOfDays)

    const paypalOrder = await createPayPalOrder(totalAmount, carName)

    const order = await prisma.order.create({
        data: {
            carId,
            carName: carName,
            userId: userId,
            status: "pending",
            totalAmount: totalAmount.toString(),
            orderDate: startDate,
            orderEndDate: endDate,
            paypalOrderId: paypalOrder.id
        },
    });

    return NextResponse.json(
        {
            orderId: order.id,
            paypalOrderId: paypalOrder.id,
            totalAmount,
            numberOfDays
        },
        {
        headers: corsHeaders,
    })
}