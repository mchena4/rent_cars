import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ carId: string }> }
    ) {
        try{
            const { userId } = await auth()
            const { carId } =  await params
        
            if (!userId){
                return new NextResponse("Unauthorized", { status: 401})
            }
        
            const deletedCar = await prisma.car.delete({
                where: {
                    id: carId
                },
            });
        
            return NextResponse.json(deletedCar)
        } 
        catch (error){
            console.log("Car ID: ", error)
            return new NextResponse("Internal error", { status: 500 })
        }
}