"use client";

import { ModalAddReservationProps } from "./ModalAddReservation.types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Car } from "@/lib/generated/prisma/client";
import { CalendarSelector } from "./Calendar";
import { addDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";import { toast } from "sonner";
import { useRouter } from "next/navigation";


export function ModalAddReservation(props: ModalAddReservationProps) {
  const { car } = props;
  const router  = useRouter();
  
  const onReserveCar = async (car: Car, dateSelected: DateRange) => {
    if (!dateSelected.from || !dateSelected.to) {
      toast.error("Please select the rental dates");
      return;
    }

    if (dateSelected.to <= dateSelected.from) {
      toast.error("The end date must be later than the start date");
      return;
    }
    
    try {
        const from: Date = dateSelected.from;
        const to: Date = dateSelected.to;
        
        const params = new URLSearchParams({
          carId: car.id,
          carName: car.name,
          priceDay: car.priceDay,
          startDate: from.toISOString(),
          endDate: to.toISOString(),
        });

        router.push(`/checkout?${params.toString()}`);
      } catch (error) {
      console.log("Error:", error)
      toast.error("Error creating reservation")
    }

  };
  
  const [dateSelected, setDateSelected] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: addDays(new Date(), 5)
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full-mt-3">Add Reservation</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Select the dates you want to rent the car</AlertDialogTitle>
          <AlertDialogDescription>
            <CalendarSelector setDateSelected={setDateSelected} carPriceDay={car.priceDay} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onReserveCar(car, dateSelected)}>
            Reserve Vehicle
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
