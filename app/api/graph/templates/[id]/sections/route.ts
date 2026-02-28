import { NextRequest, NextResponse } from "next/server";
import { getTemplateSections } from "@/lib/graph/template-api";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sections = await getTemplateSections(params.id);
  return NextResponse.json({ sections });
}
