import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ carId: string }> }
    )  {
        try {
            const { userId } = await auth();
            const { carId } = await params 
            const values = await req.json();

            if (!userId) {
                return new NextResponse("Unauthorized", { status: 401 });
            }

            if (!carId) {
                return new NextResponse("Car ID is required", { status: 400 });
            }

            const car = await prisma.car.update({
                where: {
                    id: carId,
                    userId: userId,
                },
                data: {
                    ...values
                }
            });

            return NextResponse.json(car)
            
        } catch (error) {
            console.log("CAR ID", error)
            return new NextResponse("Internal Server Error", { status: 500 });
        }
}