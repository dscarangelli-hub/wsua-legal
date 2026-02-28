import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) {
    return NextResponse.json({
      people: [],
      organizations: [],
      activities: [],
      documents: [],
      cases: [],
      shipments: [],
      verifications: [],
    });
  }
  const contains = { contains: q, mode: 'insensitive' as const };
  const [people, organizations, activities, documents, cases, shipments, verifications] =
    await Promise.all([
      prisma.person.findMany({
        where: {
          OR: [
            { firstName: contains },
            { lastName: contains },
            { email: contains },
          ],
        },
        take: 10,
        select: { id: true, firstName: true, lastName: true, email: true, crmEntityId: true },
      }),
      prisma.organization.findMany({
        where: { name: contains },
        take: 10,
        select: { id: true, name: true, crmEntityId: true },
      }),
      prisma.activity.findMany({
        where: { description: contains },
        take: 10,
        select: { id: true, type: true, description: true, crmEntityId: true },
      }),
      prisma.document.findMany({
        where: { title: contains },
        take: 10,
        select: { id: true, title: true, crmEntityId: true },
      }),
      prisma.case.findMany({
        where: { title: contains },
        take: 10,
        select: { id: true, title: true, crmEntityId: true },
      }),
      prisma.shipment.findMany({
        where: {
          OR: [
            { trackingNumber: contains },
            { origin: contains },
            { destination: contains },
          ],
        },
        take: 10,
        select: { id: true, trackingNumber: true, crmEntityId: true },
      }),
      prisma.partnerVerification.findMany({
        take: 10,
        select: { id: true, status: true, crmEntityId: true },
      }),
    ]);
  return NextResponse.json({
    people,
    organizations,
    activities,
    documents,
    cases,
    shipments,
    verifications,
  });
}
