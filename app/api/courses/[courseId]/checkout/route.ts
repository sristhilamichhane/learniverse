import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
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

    // eSewa Payment Integration
    const esewaTestUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${params.courseId}/success`;
    const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${params.courseId}/failure`;

    const transaction_uuid = `${course.id}-${user.id}-${Date.now()}`;
    const total_amount = course.price?.toString() || "0";

    // Generate signature
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

    // Return the URL and payment data to the frontend
    return NextResponse.json({
      esewaUrl: esewaTestUrl,
      paymentData,
    });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
