"use client"

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
import { DateRange } from "react-day-picker";


export function ModalAddReservation(props: ModalAddReservationProps) {
  const { car } = props;

  const onReserveCar = async (car: Car, dateSelected: DateRange) => {
    console.log("Reserve Car")
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
