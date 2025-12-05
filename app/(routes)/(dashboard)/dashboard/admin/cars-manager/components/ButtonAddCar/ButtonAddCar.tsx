"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { FormAddCar } from "../FormAddCar/FormAddCar"

export function ButtonAddCar() {
    const [openDialog, setOpenDialog] = useState(false);

    return (
        < Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Add new car 
                    <PlusCircle className="ml-2"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Add a new car!
                </DialogTitle>
                <DialogHeader>
                    <DialogDescription asChild>
                        <FormAddCar setOpenDialog={setOpenDialog}/>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog> 
    )
}
