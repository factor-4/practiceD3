// store sales data across 4 regions, with top 4 categories of goods
const SALES_DATA = [
    {
      region: 'North',
      s_t: 325000, // sports and travel
      h_l: 550000, // home and lifestyle
      e_g: 350000, // electronics and gadgets
      h_b: 300000, // health and beauty
    },
    {
      region: 'East',
      s_t: 400000, // sports and travel
      h_l: 500000, // home and lifestyle
      e_g: 450000, // electronics and gadgets
      h_b: 350000, // health and beauty
    },
    {
      region: 'South',
      s_t: 350000, // sports and travel
      h_l: 400000, // home and lifestyle
      e_g: 500000, // electronics and gadgets
      h_b: 325000, // health and beauty
    },
    {
      region: 'West',
      s_t: 600000, // sports and travel
      h_l: 350000, // home and lifestyle
      e_g: 550000, // electronics and gadgets
      h_b: 500000, // health and beauty
    },
  ];

  // A map for avvreviations

  const ABBR = new Map(
    [
        ['s_t', 'Sports and Travel'],
        ['h_l', 'Home and Lifestyle'],
        ['e_g', 'Electronics  and Gadgets'],
        ['h_b', 'Health  and Beauty'],
    ]
  )

  console.log(ABBR)