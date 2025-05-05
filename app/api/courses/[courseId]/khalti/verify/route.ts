import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const pidx = searchParams.get("pidx");
    const { userId } = auth();

    if (!pidx) {
      return new NextResponse("Payment verification failed", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify payment with Khalti
    const response = await fetch(`https://a.khalti.com/api/v2/epayment/lookup/${pidx}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
      },
    });

    const verificationData = await response.json();

    if (!response.ok || verificationData.status !== 'Completed') {
      return new NextResponse("Payment verification failed", { status: 400 });
    }

    // Create purchase record
    const purchase = await db.purchase.create({
      data: {
        userId: userId,
        courseId: params.courseId,
      },
    });

    // Redirect to course page
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: `/courses/${params.courseId}`,
      },
    });

  } catch (error) {
    console.log("[KHALTI_VERIFICATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}