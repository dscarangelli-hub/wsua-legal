import { prisma } from './prisma';

const ENTITY_TYPES = {
  PERSON: 'PERSON',
  ORG: 'ORG',
  ACTIVITY: 'ACTIVITY',
  DOCUMENT: 'DOCUMENT',
  CASE: 'CASE',
  SHIPMENT: 'SHIPMENT',
  VERIFICATION: 'VERIFICATION',
} as const;

export async function ensureCRMEntityForPerson(personId: string) {
  const existing = await prisma.cRMEntity.findFirst({
    where: { type: ENTITY_TYPES.PERSON, refId: personId },
  });
  if (existing) return existing.id;
  const entity = await prisma.cRMEntity.create({
    data: { type: ENTITY_TYPES.PERSON, refId: personId },
  });
  await prisma.person.update({
    where: { id: personId },
    data: { crmEntityId: entity.id },
  });
  return entity.id;
}

export async function ensureCRMEntityForOrganization(orgId: string) {
  const existing = await prisma.cRMEntity.findFirst({
    where: { type: ENTITY_TYPES.ORG, refId: orgId },
  });
  if (existing) return existing.id;
  const entity = await prisma.cRMEntity.create({
    data: { type: ENTITY_TYPES.ORG, refId: orgId },
  });
  await prisma.organization.update({
    where: { id: orgId },
    data: { crmEntityId: entity.id },
  });
  return entity.id;
}

export async function ensureCRMEntityForActivity(activityId: string) {
  const existing = await prisma.cRMEntity.findFirst({
    where: { type: ENTITY_TYPES.ACTIVITY, refId: activityId },
  });
  if (existing) return existing.id;
  const entity = await prisma.cRMEntity.create({
    data: { type: ENTITY_TYPES.ACTIVITY, refId: activityId },
  });
  await prisma.activity.update({
    where: { id: activityId },
    data: { crmEntityId: entity.id },
  });
  return entity.id;
}

export async function ensureCRMEntityForDocument(docId: string) {
  const existing = await prisma.cRMEntity.findFirst({
    where: { type: ENTITY_TYPES.DOCUMENT, refId: docId },
  });
  if (existing) return existing.id;
  const entity = await prisma.cRMEntity.create({
    data: { type: ENTITY_TYPES.DOCUMENT, refId: docId },
  });
  await prisma.document.update({
    where: { id: docId },
    data: { crmEntityId: entity.id },
  });
  return entity.id;
}

export async function ensureCRMEntityForCase(caseId: string) {
  const existing = await prisma.cRMEntity.findFirst({
    where: { type: ENTITY_TYPES.CASE, refId: caseId },
  });
  if (existing) return existing.id;
  const entity = await prisma.cRMEntity.create({
    data: { type: ENTITY_TYPES.CASE, refId: caseId },
  });
  await prisma.case.update({
    where: { id: caseId },
    data: { crmEntityId: entity.id },
  });
  return entity.id;
}

export async function ensureCRMEntityForShipment(shipmentId: string) {
  const existing = await prisma.cRMEntity.findFirst({
    where: { type: ENTITY_TYPES.SHIPMENT, refId: shipmentId },
  });
  if (existing) return existing.id;
  const entity = await prisma.cRMEntity.create({
    data: { type: ENTITY_TYPES.SHIPMENT, refId: shipmentId },
  });
  await prisma.shipment.update({
    where: { id: shipmentId },
    data: { crmEntityId: entity.id },
  });
  return entity.id;
}

export async function ensureCRMEntityForPartnerVerification(verificationId: string) {
  const existing = await prisma.cRMEntity.findFirst({
    where: { type: ENTITY_TYPES.VERIFICATION, refId: verificationId },
  });
  if (existing) return existing.id;
  const entity = await prisma.cRMEntity.create({
    data: { type: ENTITY_TYPES.VERIFICATION, refId: verificationId },
  });
  await prisma.partnerVerification.update({
    where: { id: verificationId },
    data: { crmEntityId: entity.id },
  });
  return entity.id;
}
