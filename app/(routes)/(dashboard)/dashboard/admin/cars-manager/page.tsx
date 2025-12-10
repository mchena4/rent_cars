import { auth } from "@clerk/nextjs/server";
import { ButtonAddCar } from "./components/ButtonAddCar/ButtonAddCar";
import { ListCars } from "./components/ListCars/ListCars";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CarsManagerPage() {

    const {userId} = await auth()

    if (!userId) {
        return redirect('/')
    }

    const car = await prisma.car.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });


    return(
        <div>
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Manage your cars</h2>
                <ButtonAddCar />
            </div>
            <ListCars cars={car}></ListCars>
        </div>
    )
}