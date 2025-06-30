// src/data/mockVibes.js
const mockVibes = [
  {
    id: "1",
    name: "CoffeeSpace",
    lat: 43.4668,
    lng: -79.6991,
    type: "business",
    description: "Downtown Oakville coffee shop. The best latte in the city!",
    photo: null,
    contacts: [
      { type: "instagram", value: "coffeespace_to" },
      { type: "website", value: "coffeespace.com" },
      { type: "phone", value: "+14165557788" },
      { type: "email", value: "info@coffeespace.com" },
    ],
    extraBlocks: [
      { type: "hours", label: "Hours", value: "Mon-Fri 08:00–18:00, Sat-Sun 09:00–16:00" },
      { type: "offers", label: "Offers", value: "Every 6th coffee free!" },
      { type: "address", label: "Address", value: "123 Main St, Oakville" },
    ]
  },
  {
    id: "2",
    name: "Ivan's Guitar Studio",
    lat: 43.4679,
    lng: -79.6901,
    type: "personal",
    description: "Learn guitar with Ivan. First lesson free!",
    photo: null,
    contacts: [
      { type: "telegram", value: "@ivanguitar" },
      { type: "instagram", value: "ivansguitar" },
      { type: "phone", value: "+14165559999" }
    ],
    extraBlocks: [
      { type: "hours", label: "Hours", value: "Daily 11:00–20:00" },
      { type: "custom", label: "Genres", value: "Rock, Blues, Jazz" },
    ]
  }
];

export default mockVibes;
