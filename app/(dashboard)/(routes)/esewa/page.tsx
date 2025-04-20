"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const CheckoutPage = () => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "10",
      first_name: "",
      last_name: "",
    },
  });

  const [hiddenFields, setHiddenFields] = useState({
    tax_amount: "0",
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:3000/paymentsuccess",
    failure_url: "http://localhost:3000/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    transaction_uuid: uuidv4(),
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  useEffect(() => {
    const { transaction_uuid, product_code, secret } = hiddenFields;
    const total_amount = form.watch("amount");

    const generateSignature = () => {
      const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
      const hash = CryptoJS.HmacSHA256(hashString, secret);
      return CryptoJS.enc.Base64.stringify(hash);
    };

    const newSignature = generateSignature();
    setHiddenFields((prev) => ({ ...prev, signature: newSignature }));
  }, [form.watch("amount")]);

  return (
    <Form {...form}>
      <form
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        className="space-y-6 max-w-md mx-auto"
      >
        <h1 className="text-xl font-semibold text-center">Checkout</h1>

        {/* Amount Field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First Name Field */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name Field */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden Fields */}
        <input type="hidden" name="amount" value={form.watch("amount")} />
        <input
          type="hidden"
          name="tax_amount"
          value={hiddenFields.tax_amount}
        />
        <input type="hidden" name="total_amount" value={form.watch("amount")} />
        <input
          type="hidden"
          name="transaction_uuid"
          value={hiddenFields.transaction_uuid}
        />
        <input
          type="hidden"
          name="product_code"
          value={hiddenFields.product_code}
        />
        <input
          type="hidden"
          name="product_service_charge"
          value={hiddenFields.product_service_charge}
        />
        <input
          type="hidden"
          name="product_delivery_charge"
          value={hiddenFields.product_delivery_charge}
        />
        <input
          type="hidden"
          name="success_url"
          value={hiddenFields.success_url}
        />
        <input
          type="hidden"
          name="failure_url"
          value={hiddenFields.failure_url}
        />
        <input
          type="hidden"
          name="signed_field_names"
          value={hiddenFields.signed_field_names}
        />
        <input type="hidden" name="signature" value={hiddenFields.signature} />

        <Button type="submit" className="w-full">
          Pay via E-Sewa
        </Button>
      </form>
    </Form>
  );
};

export default CheckoutPage;
