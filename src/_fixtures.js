export const data = {
  heading: "РАСЧЕТ СЕБЕСТОИМОСТИ",
  subHeading: "ПРОИЗВОДСТВА БУМАЖНЫХ СТАКАНОВ",
  info: {
    heading: "Характеристики:",
    title: "Плотность бумаги:",
    switch1: "Однослойные",
    switch2: "Двухслойные",
    range: "Объем стакана:",
    switch3: "Без печати",
    switch4: "Подрядчик",
    package: "Картон:",
    country1: "Китай",
    country2: "Европа",
    label1: "Зарплата оператора в месяц, руб",
    label1Error: "Введите зачение от 0 до 100 000",
    label2: "Продажная цена 1 стакана",
    label2Error: "Введите зачение от 0 до 100",
    receiptsError: "Производство не рентабельно, увеличьте цену за 1 стакан",
  },
  capacity: [
    "Производительность, <span className='result__heading--small'>шт.</span> ",
    "Буду производить/Надо произвести, шт. в месяц:",
  ],
  capacityText: [
    "Стаканов в час",
    "Стаканов в день",
    "Стаканов в месяц",
  ],
  receipts: [
    "Выручка, <span className='result__heading--small'>руб</span>",
    "Хочу прибыль, руб. в месяц:",
  ],
  receiptsText: [
    "За штуку",
    "В час",
    "В день",
    "В месяц",
  ],
  costPrice: [
    "Себестоимость изделия, <span className='result__heading--small'>руб</span>",
  ],
  costPriceText: [
    "За одно изделие",
    "Электроэнергия",
    "Зарплата",
    "Печать",
    "Высечка",
    "Сырье",
    "Упаковка",
  ],
  result: "Расчеты производились без учета затрат на аренду помещения, оплату налогов, маркетинга, расходных материалов, для более детального просчета звоните (номер телефона)",
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
    capacityPerMinute: 45,
    workingOursPerDay: 22,
    workingDaysPerMonth: 20,
    boxing: {
      priceForItem: 0.04
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
    capacityPerMinute: 50,
    workingOursPerDay: 22,
    workingDaysPerMonth: 7,
    boxing: {
      glue: 0.00065,
      priceForItem: 0.04
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