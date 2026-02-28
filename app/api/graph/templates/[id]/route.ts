import { NextRequest, NextResponse } from "next/server";
import { getTemplate } from "@/lib/graph/template-api";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const template = await getTemplate(params.id);
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(template);
}
