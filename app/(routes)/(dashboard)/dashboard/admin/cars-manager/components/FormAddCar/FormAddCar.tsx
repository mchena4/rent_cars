"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { formSchema } from "./FormAddCar.form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue, 
} from "@/components/ui/select"

import { UploadButton } from "@/utils/uploadthing"
import { useState } from "react"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"

import { useRouter } from "next/navigation"
interface FormAddCarProps {
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}

export function FormAddCar({ setOpenDialog }: FormAddCarProps) {
    const [photo, setPhoto] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      mode: "onChange",
      defaultValues: {
        name: "",
        cv: "",
        transmission: "",
        people: "",
        photo: "",
        engine: "",
        type: "",
        priceDay: "",
        isPublish: false,
      },
    });

    const router = useRouter();

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
      console.log(values);
      setOpenDialog(false); 
      try {
            await axios.post("/api/car", values);
            toast.success("Car added successfully!");
            router.refresh();
          } catch (error) {
            toast.error("Something went wrong.");
            console.log(error)
        }
    };

    const { isValid } = form.formState;

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Volkswagen Polo GTI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Power</FormLabel>
                      <FormControl>
                        <Input placeholder="150 CV" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the type of transmission"></SelectValue>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="automatic">Automatic</SelectItem>
                        </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="people"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>People</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the quantity of people"></SelectValue>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                        </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the engine of people"></SelectValue>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="gasoil">Gasoil</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="hibrid">Hibrid</SelectItem>
                        </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the type of car"></SelectValue>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="coupe">Coupe</SelectItem>
                            <SelectItem value="familiar">Familiar</SelectItem>
                            <SelectItem value="luxe">Luxe</SelectItem>
                        </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Image</FormLabel>
                      <FormControl>
                        {photo ? (
                          <p className="text-sm text-green-600">Photo uploaded successfully!</p>
                        ) : (
                        <UploadButton 
                        className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                        endpoint="photo"
                        onClientUploadComplete={(res) => {
                          form.setValue("photo", res?.[0].ufsUrl, { shouldValidate: true });
                          setPhoto(true);
                          }}
                          onUploadError={(error: Error) => {
                            console.log(`ERROR! ${error.message}`);
                          }}
                        />
                        )}        
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Day</FormLabel>
                      <FormControl>
                        <Input placeholder="$20" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <Button type="submit" className="w-full mt-5" disabled={!isValid}>Add car</Button>
            </form>
        </Form>
    )
}

