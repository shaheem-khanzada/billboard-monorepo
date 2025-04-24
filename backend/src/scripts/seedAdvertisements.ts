import { AdvertisementModel } from "@/schemas/AdvertisementSchema";

// --- Constants ---
const freeSlots = new Set([2, 14, 22, 34, 42, 54, 62, 74, 82, 94]);

const generatePriceMap = () => {
    const ranges = [
        { start: 1, end: 10, price: '5' },
        { start: 11, end: 20, price: '4.5' },
        { start: 21, end: 30, price: '4.0' },
        { start: 31, end: 40, price: '3.5' },
        { start: 41, end: 50, price: '3.0' },
        { start: 51, end: 60, price: '2.5' },
        { start: 61, end: 70, price: '2.0' },
        { start: 71, end: 80, price: '1.5' },
        { start: 81, end: 90, price: '1.0' },
        { start: 91, end: 100, price: '0.5' },
    ];

    return Object.fromEntries(
        ranges.flatMap(({ start, end, price }) =>
            Array.from({ length: end - start + 1 }, (_, i) => [start + i, price])
        )
    );
};

const priceMap = generatePriceMap();

// --- Utils ---

const createAdRecord = (tokenId: number) => {
  const price = priceMap[tokenId];
  return {
    tokenId,
    price,
    isFreeMint: freeSlots.has(tokenId),
  };
};

// --- Main Seeder ---
const seedAdvertisements = async () => {
  const existingCount = await AdvertisementModel.countDocuments();
  const totalToSeed = 100;

  if (existingCount >= totalToSeed) {
    console.log(`⚠️ ${existingCount} records already exist. Skipping seeding.`);
    return;
  }

  const adsToCreate = Array.from(
    { length: totalToSeed - existingCount },
    (_, i) => createAdRecord(existingCount + i + 1)
  );

  await AdvertisementModel.insertMany(adsToCreate, { ordered: false });
  console.log(`✅ Seeded ${adsToCreate.length} advertisements.`);
};

seedAdvertisements().catch(console.error);
