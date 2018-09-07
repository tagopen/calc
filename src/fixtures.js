export const data = {
  currency: {
    usd: "63.00",
    eur: "74.00"
  },
  printTypes: [
    "Без печати",
    "Подрядчик"
  ],
  cardboardTypes: [
    "Китай",
    "Европа",
  ],
  costPaperEur: "2070",
  singleLayer: {
    type: "Однослойный",
    volume: [
      "250",
      "350",
      "450",
    ],
    density: [
      "250",
      "280",
      "300",
    ],
    capacityPerMinute: "45",
    workingOursPerDay: "22",
    workingDaysPerMonth: "20",
    boxing: {
      priceForItem: "1"
    }
  },
  multiLayer: {
    type: "Двухслойный",
    volume: [
      "250",
      "350",
      "450",
    ],
    density: [
      "250",
      "280",
      "300",
    ],
    capacityPerMinute: "50",
    workingOursPerDay: "22",
    workingDaysPerMonth: "7",
    boxing: {
      glue: "0.065",
      priceForItem: "1"
    }
  }
}