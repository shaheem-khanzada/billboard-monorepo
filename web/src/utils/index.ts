export const freeSlots = new Set([2, 14, 22, 34, 42, 54, 62, 74, 82, 94]);

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

export const priceMap = generatePriceMap();

export const getSlotPrice = (slot: number): string => {
    if (freeSlots.has(slot)) return '0';
    return priceMap[slot] || '-1';
};