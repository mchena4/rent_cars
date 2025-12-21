import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

import { ListCars } from "./components/ListCars"

export default async function DashboardPage() {
  
  const { userId } = await auth()

  if (!userId){
    redirect('/')
  }

  const cars = await prisma.car.findMany({
    where: {
      isPublish: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
  
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          <ListCars cars={cars} />
        </h2>
      </div>
    </div>
  )
}
