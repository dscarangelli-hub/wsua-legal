import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const like = `%${q}%`;

  const [people, organizations, activities, documents, cases, shipments, verifications] =
    await Promise.all([
      prisma.person.findMany({
        where: {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      prisma.organization.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { type: { contains: q, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      prisma.activity.findMany({
        where: {
          OR: [
            { type: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      prisma.document.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { type: { contains: q, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      prisma.case.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { type: { contains: q, mode: "insensitive" } },
            { status: { contains: q, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      prisma.shipment.findMany({
        where: {
          OR: [
            { trackingNumber: { contains: q, mode: "insensitive" } },
            { origin: { contains: q, mode: "insensitive" } },
            { destination: { contains: q, mode: "insensitive" } }
          ]
        },
        take: 10
      }),
      prisma.partnerVerification.findMany({
        where: {
          OR: [
            { status: { contains: q, mode: "insensitive" } },
            { notes: { contains: q, mode: "insensitive" } }
          ]
        },
        take: 10
      })
    ]);

  return NextResponse.json({
    results: {
      people,
      organizations,
      activities,
      documents,
      cases,
      shipments,
      verifications
    }
  });
}

