// app/api/users/[uuid]/route.ts
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export const GET = async () => {
  try {
    await connectMongo();
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.error();
  }
};
