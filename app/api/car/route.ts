import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const  { userId }  = await auth();
        const data = await req.json();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const car = await prisma.car.create({
            data: {
                userId,
                ...data
            }
        });

        return NextResponse.json(car, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
