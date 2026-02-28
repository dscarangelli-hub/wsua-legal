import { NextRequest, NextResponse } from "next/server";
import { listRd4uCategories, createRd4uCategory } from "@/lib/reparations/rd4u-categories";

export async function GET() {
  const categories = await listRd4uCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const category = await createRd4uCategory(body);
  return NextResponse.json(category, { status: 201 });
}
