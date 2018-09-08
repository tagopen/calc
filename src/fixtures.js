export const data = {
  currency: {
    usd: 63.00,
    eur: 74.00
  },
  printTypes: [
    "Без печати",
    "Подрядчик"
  ],
  cardboardTypes: [
    {
      name: "Китай",
      price: 1600
    },
    {
      name: "Европа",
      price: 1800
    }
  ],
  costPaperEur: "2070",
  singleLayer: {
    type: "Однослойный",
    volume: [
      250,
      350,
      450,
    ],
    density: [
      250,
      280,
      300,
    ],
    capacityPerMinute: "45",
    workingOursPerDay: "22",
    workingDaysPerMonth: "20",
    boxing: {
      priceForItem: "1"
    },
    itemsPerTon: [
      144000,
      96000,
      75000,
    ],
    printCostPerItem: [
      0.2,
      0.3,
      0.4,
    ],
    carveCostPerItem: [
      0.3,
      0.2,
      0.58,
    ],
    electricity: 2200,
    pricePacking: [
      1.67,
      3.52,
      4.28,
    ]
  },
  multiLayer: {
    type: "Двухслойный",
    volume: [
      250,
      350,
      450,
    ],
    density: [
      250,
      280,
      300,
    ],
    capacityPerMinute: "50",
    workingOursPerDay: "22",
    workingDaysPerMonth: "7",
    boxing: {
      glue: "0.065",
      priceForItem: "1"
    },
    itemsPerTon: [
      144000,
      96000,
      75000,
    ],
    printCostPerItem: [
      0.2,
      0.3,
      0.4,
    ],
    carveCostPerItem: [
      0.3,
      0.2,
      0.58,
    ],
    provisionPerItem: [
      0.83,
      1.03,
      1.38,
    ],
    electricity: 770,
    pricePacking: [
      5.00,
      6.38,
      8.00,
    ],
  }
}