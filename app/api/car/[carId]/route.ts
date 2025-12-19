import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: {params: Promise<{ carId: string}>}  
    ) {
        try {
            const { userId } = await auth()
            const { carId } =  await params
            const { isPublished } = await req.json()
            
            if (!userId){
                return new NextResponse("Unauthorized", { status: 401})
            }
            
            if (!carId){
                return new NextResponse("Car ID is required", { status: 400}) 
            }

            const car = await prisma.car.update({
                where: {
                    id: carId,
                    userId
                },
                data: {
                    isPublish: isPublished
                }
            })
            return NextResponse.json(car)
        } catch (error) {
            console.log(error)
            return new NextResponse("Internal error", { status: 500 })
        }
    }


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