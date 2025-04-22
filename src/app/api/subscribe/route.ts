// @/app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

// Not using this currently, remove or implement in the future
// import mysql from "mysql2/promise";

async function fetchPlanData(plan: string, limit: number, page: number) {
  try {
    await connectMongo();
    const users = await User.find({ "plan.name": plan }) // Adjust field name as per your schema
      .skip(page * limit)
      .limit(limit);
    return users;
  } catch (error) {
    console.error("MongoDB Query Error (fetchPlanData):", error);
    return [];
  }
}

async function fetchAllPlans(limit: number, page: number) {
  try {
    await connectMongo();

    const response = await fetch("https://auth.jaano.ai/razorpay/getsorder", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log(response);

    if (!response.ok) throw new Error("Failed to fetch order data");

    const orders = await response.json();
    const allUsers: any[] = [];

    for (const order of orders) {
      const user = await User.findOne({
        paymentHistory: { $elemMatch: { order_id: order.order_id } },
      });

      if (user) {
        allUsers.push({
          userId: user.userId,
          email: user.email,
          payment: order,
        });
      }
    }

    return allUsers;
  } catch (error) {
    console.error("MongoDB Query Error (fetchAllPlans):", error);
    return [];
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "100000", 10);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const plan = url.searchParams.get("plan")?.toLowerCase();

    let queryResult;

    switch (plan) {
      case "free":
      case "standard":
      case "professional":
        queryResult = await fetchPlanData(plan, limit, page);
        break;
      default:
        queryResult = await fetchAllPlans(limit, page);
        break;
    }

    return NextResponse.json(
      { limit, page, plan, data: queryResult },
      { status: 200 }
    );
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
