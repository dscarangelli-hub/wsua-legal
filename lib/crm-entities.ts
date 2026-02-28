import {
  Activity,
  Case as CaseModel,
  CRMEntity,
  Document,
  Organization,
  PartnerVerification,
  Person,
  Shipment
} from "@prisma/client";
import { prisma } from "./prisma";

export type CRMEntityType =
  | "PERSON"
  | "ORG"
  | "ACTIVITY"
  | "DOCUMENT"
  | "CASE"
  | "SHIPMENT"
  | "VERIFICATION";

export async function ensureCRMEntityForPerson(
  person: Person
): Promise<CRMEntity> {
  if (person.crmEntityId) {
    return prisma.cRMEntity.findUniqueOrThrow({
      where: { id: person.crmEntityId }
    });
  }

  const entity = await prisma.cRMEntity.create({
    data: {
      type: "PERSON",
      refId: person.id,
      person: { connect: { id: person.id } }
    }
  });

  await prisma.person.update({
    where: { id: person.id },
    data: { crmEntityId: entity.id }
  });

  return entity;
}

export async function ensureCRMEntityForOrganization(
  organization: Organization
): Promise<CRMEntity> {
  if (organization.crmEntityId) {
    return prisma.cRMEntity.findUniqueOrThrow({
      where: { id: organization.crmEntityId }
    });
  }

  const entity = await prisma.cRMEntity.create({
    data: {
      type: "ORG",
      refId: organization.id,
      organization: { connect: { id: organization.id } }
    }
  });

  await prisma.organization.update({
    where: { id: organization.id },
    data: { crmEntityId: entity.id }
  });

  return entity;
}

export async function ensureCRMEntityForActivity(
  activity: Activity
): Promise<CRMEntity> {
  if (activity.crmEntityId) {
    return prisma.cRMEntity.findUniqueOrThrow({
      where: { id: activity.crmEntityId }
    });
  }

  const entity = await prisma.cRMEntity.create({
    data: {
      type: "ACTIVITY",
      refId: activity.id,
      activity: { connect: { id: activity.id } }
    }
  });

  await prisma.activity.update({
    where: { id: activity.id },
    data: { crmEntityId: entity.id }
  });

  return entity;
}

export async function ensureCRMEntityForDocument(
  document: Document
): Promise<CRMEntity> {
  if (document.crmEntityId) {
    return prisma.cRMEntity.findUniqueOrThrow({
      where: { id: document.crmEntityId }
    });
  }

  const entity = await prisma.cRMEntity.create({
    data: {
      type: "DOCUMENT",
      refId: document.id,
      document: { connect: { id: document.id } }
    }
  });

  await prisma.document.update({
    where: { id: document.id },
    data: { crmEntityId: entity.id }
  });

  return entity;
}

export async function ensureCRMEntityForCase(
  caseModel: CaseModel
): Promise<CRMEntity> {
  if (caseModel.crmEntityId) {
    return prisma.cRMEntity.findUniqueOrThrow({
      where: { id: caseModel.crmEntityId }
    });
  }

  const entity = await prisma.cRMEntity.create({
    data: {
      type: "CASE",
      refId: caseModel.id,
      case: { connect: { id: caseModel.id } }
    }
  });

  await prisma.case.update({
    where: { id: caseModel.id },
    data: { crmEntityId: entity.id }
  });

  return entity;
}

export async function ensureCRMEntityForShipment(
  shipment: Shipment
): Promise<CRMEntity> {
  if (shipment.crmEntityId) {
    return prisma.cRMEntity.findUniqueOrThrow({
      where: { id: shipment.crmEntityId }
    });
  }

  const entity = await prisma.cRMEntity.create({
    data: {
      type: "SHIPMENT",
      refId: shipment.id,
      shipment: { connect: { id: shipment.id } }
    }
  });

  await prisma.shipment.update({
    where: { id: shipment.id },
    data: { crmEntityId: entity.id }
  });

  return entity;
}

export async function ensureCRMEntityForPartnerVerification(
  verification: PartnerVerification
): Promise<CRMEntity> {
  if (verification.crmEntityId) {
    return prisma.cRMEntity.findUniqueOrThrow({
      where: { id: verification.crmEntityId }
    });
  }

  const entity = await prisma.cRMEntity.create({
    data: {
      type: "VERIFICATION",
      refId: verification.id,
      partnerVerification: { connect: { id: verification.id } }
    }
  });

  await prisma.partnerVerification.update({
    where: { id: verification.id },
    data: { crmEntityId: entity.id }
  });

  return entity;
}

