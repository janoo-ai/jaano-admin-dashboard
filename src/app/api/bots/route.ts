// pages/api/bots/index.ts
import Bot from "@/models/Bot";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";

export const GET = async () => {
  try {
    await connectMongo();
    const bots = await Bot.find({});
    return NextResponse.json({ bots });
  } catch (error) {
    return NextResponse.error();
  }
};
