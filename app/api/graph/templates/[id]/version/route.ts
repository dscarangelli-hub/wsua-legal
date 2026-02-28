import { NextRequest, NextResponse } from "next/server";
import { createTemplateVersion } from "@/lib/graph/template-api";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}));
    const { changeReason, changeLog, delta } = body;
    const result = await createTemplateVersion(params.id, {
      changeReason,
      changeLog,
      delta,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create template version" }, { status: 500 });
  }
}
