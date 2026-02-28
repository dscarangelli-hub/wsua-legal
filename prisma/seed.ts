import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const international = await prisma.jurisdiction.upsert({
    where: { code: 'INTERNATIONAL' },
    create: { code: 'INTERNATIONAL', name: 'International Law' },
    update: {},
  });
  const eu = await prisma.jurisdiction.upsert({
    where: { code: 'EU' },
    create: { code: 'EU', name: 'European Union', parentId: international.id },
    update: {},
  });
  const ua = await prisma.jurisdiction.upsert({
    where: { code: 'UA' },
    create: { code: 'UA', name: 'Ukraine (National)', parentId: international.id },
    update: {},
  });
  const uaOblast = await prisma.jurisdiction.upsert({
    where: { code: 'UA_OBLAST' },
    create: { code: 'UA_OBLAST', name: 'Ukrainian Oblast', parentId: ua.id },
    update: {},
  });
  const uaCity = await prisma.jurisdiction.upsert({
    where: { code: 'UA_CITY' },
    create: { code: 'UA_CITY', name: 'Ukrainian City', parentId: ua.id },
    update: {},
  });
  await prisma.jurisdiction.upsert({
    where: { code: 'US' },
    create: { code: 'US', name: 'U.S. Federal', parentId: international.id },
    update: {},
  });
  await prisma.jurisdiction.upsert({
    where: { code: 'US_CIRCUIT' },
    create: { code: 'US_CIRCUIT', name: 'U.S. Circuit', parentId: international.id },
    update: {},
  });
  await prisma.jurisdiction.upsert({
    where: { code: 'US_STATE' },
    create: { code: 'US_STATE', name: 'U.S. State', parentId: international.id },
    update: {},
  });

  await prisma.rd4uCategory.upsert({
    where: { categoryId: 'property_damage' },
    create: {
      categoryId: 'property_damage',
      title: 'Property damage',
      description: 'Damage to real or personal property',
      eligibilityCriteria: 'Documented damage during conflict',
      requiredEvidence: ['photos', 'ownership_docs'],
      narrativeStructure: 'Describe date, location, and nature of damage.',
      versionNumber: 1,
    },
    update: {},
  });
  await prisma.rd4uCategory.upsert({
    where: { categoryId: 'personal_injury' },
    create: {
      categoryId: 'personal_injury',
      title: 'Personal injury',
      description: 'Physical or psychological harm',
      eligibilityCriteria: 'Medical or psychological documentation',
      requiredEvidence: ['medical_records', 'testimony'],
      versionNumber: 1,
    },
    update: {},
  });
}

main()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
