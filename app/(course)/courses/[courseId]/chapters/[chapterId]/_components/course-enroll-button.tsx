"use client";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const handlePayment = async (paymentMethod: 'esewa' | 'khalti') => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`, {
        paymentMethod
      });
      
      if (paymentMethod === 'esewa') {
        const { esewaUrl, paymentData } = response.data;
        // Create and submit form to eSewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = esewaUrl;
        Object.entries(paymentData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        // Handle Khalti payment flow
        const { khaltiUrl, paymentData } = response.data;
        window.location.href = khaltiUrl;
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!showPaymentOptions ? (
        <Button
          onClick={() => setShowPaymentOptions(true)}
          disabled={isLoading}
          className="w-full md:w-auto"
          size="sm"
        >
          Enroll for {formatPrice(price)}
        </Button>
      ) : (
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <Button
            onClick={() => handlePayment('esewa')}
            disabled={isLoading}
            className="flex items-center gap-2 w-full"
            variant="outline"
          >
            <Image 
              src="/esewa_logo.png" 
              alt="eSewa" 
              width={20} 
              height={20}
            />
            Pay with eSewa
          </Button>
          <Button
            onClick={() => handlePayment('khalti')}
            disabled={isLoading}
            className="flex items-center gap-2 w-full"
            variant="outline"
          >
            <Image 
              src="/khalti_logo.png" 
              alt="Khalti" 
              width={20} 
              height={20}
            />
            Pay with Khalti
          </Button>
          <Button
            onClick={() => setShowPaymentOptions(false)}
            variant="ghost"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseEnrollButton;
