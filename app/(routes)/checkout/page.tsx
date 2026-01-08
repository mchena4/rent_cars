"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PayPalCheckout } from "../(dashboard)/dashboard/components/PaypalCheckout";
import { Car } from "@/lib/generated/prisma/client";
import Image from "next/image";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  const carId = searchParams.get("carId");
  const carName = searchParams.get("carName");
  const priceDay = searchParams.get("priceDay");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  useEffect(() => {
    // Validate params
    if (!carId || !carName || !priceDay || !startDate || !endDate) {
      router.push("/");
      return;
    }

    // Load full car data from API
    const fetchCar = async () => {
      try {
        // Petition to get car details
        const response = await fetch(`/api/car/${carId}`);
        if (response.ok) {
          const data = await response.json();
          setCar(data);
        }
      } catch (error) {
        console.error("Error loading car:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch car data when component mounts
    fetchCar();
  }, [carId, carName, priceDay, startDate, endDate, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Validate params again
  if (!carId || !carName || !priceDay || !startDate || !endDate) {
    return null;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vehicle Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
          {car?.photo && (
            <Image
              src={car.photo}
              alt={carName}
              className="w-full h-48 object-cover rounded-lg mb-4"
              width={500}
              height={300}
            />
          )}
          <div className="space-y-2">
            <p className="text-lg font-semibold">{carName}</p>
            <div className="text-sm text-gray-600">
              <p>Start Date: {start.toLocaleDateString("es-AR")}</p>
              <p>End Date: {end.toLocaleDateString("es-AR")}</p>
              <p>Days: {numberOfDays}</p>
            </div>
          </div>
        </div>

        {/* PayPal Checkout */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <PayPalCheckout
            carId={carId}
            carName={carName}
            priceDay={priceDay}
            startDate={start}
            endDate={end}
          />
        </div>
      </div>
    </div>
  );
}