import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { paymentMethod } = await req.json();
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized No User Found", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const transaction_uuid = `${course.id}-${user.id}-${Date.now()}`;
    const total_amount = course.price?.toString() || "0";

    if (paymentMethod === 'esewa') {
      const esewaTestUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${params.courseId}/success`;
      const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${params.courseId}/failure`;

      // Generate signature for eSewa
      const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
      const signature = crypto
        .createHmac("sha256", process.env.ESEWA_SECRET_KEY!)
        .update(dataToSign)
        .digest("base64");

      const paymentData = {
        amount: total_amount,
        tax_amount: "0",
        total_amount: total_amount,
        transaction_uuid: transaction_uuid,
        product_code: "EPAYTEST",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: successUrl,
        failure_url: failureUrl,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
      };

      return NextResponse.json({
        esewaUrl: esewaTestUrl,
        paymentData,
      });
    } else if (paymentMethod === 'khalti') {
      const khaltiTestUrl = "https://test-pay.khalti.com/";
      const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${params.courseId}/khalti/verify`;
      
      // Generate Khalti payment data
      const khaltiPaymentData = {
        return_url: returnUrl,
        website_url: process.env.NEXT_PUBLIC_APP_URL,
        amount: parseInt(total_amount) * 100, // Khalti expects amount in paisa
        purchase_order_id: transaction_uuid,
        purchase_order_name: course.title,
        customer_info: {
          name: user.firstName + " " + user.lastName,
          email: user.emailAddresses[0].emailAddress,
        },
      };

      // Make request to Khalti API to create payment session
      const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
        method: 'POST',
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(khaltiPaymentData),
      });

      const khaltiResponse = await response.json();

      if (!response.ok) {
        throw new Error('Failed to initialize Khalti payment');
      }

      return NextResponse.json({
        khaltiUrl: khaltiResponse.payment_url,
        paymentData: khaltiPaymentData,
      });
    }

    return new NextResponse("Invalid payment method", { status: 400 });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
