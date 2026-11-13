// All wedding details live here. Every value is a PLACEHOLDER: replace with the real ones
export const wedding = {
  partnerOne: "Aminat", // First name
  partnerTwo: "Sodeeq", // Second name
  dateText: "Saturday, 5th December 2026", // Date as shown on the page
  dateISO: "2026-12-05T00:00:00+01:00", // Countdown target: 2:00 PM Lagos time (+01:00)
  calendarStart: "20261205T130000Z", // Start for "Add to calendar" in UTC (1 hour behind Lagos)
  calendarEnd: "20261205T200000Z", // End for "Add to calendar" in UTC
  venue: "Divine Heritage Event Center. 7 , Modasiru Close, Beside Estanza Royal Hotel, Ajuwon-Akute Road", // Short location under the date
  hashtag: "#Yusufied", // Wedding theme / hashtag

  // Pre-wedding photos for the hero carousel (files are in public/hero). position = which part stays visible when a photo is cropped
    heroPhotos: [
    { src: "/hero/1.jpg", position: "center 5%" },
    { src: "/hero/2.jpg", position: "center 5%" },
    { src: "/hero/3.jpg", position: "center 5%" },
    { src: "/hero/4.jpg", position: "center 5%" },
    { src: "/hero/5.jpg", position: "center 5%" },
    { src: "/hero/6.jpg", position: "center 5%" },
    ],
  siteUrl: "https://yusufied.online", // Used by the QR code on the page
  welcome:
    "Thank you for celebrating with us. Share the photos and videos you take today so we can relive every moment.", // Hero message

  // Paragraphs for the "Our story" section
  story: [
    "We met on an ordinary afternoon and it quickly became the best day of our lives. Every day since has been a story we are grateful to write together.",
    "Today we say yes to forever, surrounded by the people we love most. Thank you for being part of it.",
  ],

  // Cards in "Meet the couple". photo: "" shows the first letter; or use "/bride.jpg" for a photo in the public folder
  couple: [
    { role: "The bride", name: "Aminat", bio: "Print and Branding Director", photo: "" },
    { role: "The groom", name: "Sodeeq", bio: "Builder/Real Estate Consultant", photo: "" },
  ],

  // Rows for the "Order of the day" timeline
  schedule: [
    { time: "11:30 AM", title: "Guest arrival", text: "Find your seat and enjoy welcome drinks." },
    { time: "12:00 PM", title: "Engagement", text: "The exchange of vows." },
    { time: "2:00 PM", title: "Reception", text: "Drinks, music and photos with the couple." },
    { time: "4:00 PM", title: "Special Special", text: "Dinner, speeches and the first dance." },
    { time: "6:00 PM", title: "After Party Unlocked ", text: "Dance the night away." },
    { time: "8:00 PM", title: "Dance Dance Dance!!!", text: "The party continues until the last guest leaves." },

  ],

  // Cards in the "Venue" section (the address is used for the directions link)
  venues: [
    { label: "Engagement", name: "Divine Heritage Event Center", address: "7, Modasiru Close, Beside Estanza Royal Hotel, Ajuwon-Akute Road, Lagos", time: "11:00 AM" },
    { label: "Reception", name: "Divine Heritage Event Center", address: "7, Modasiru Close, Beside Estanza Royal Hotel, Ajuwon-Akute Road, Lagos", time: "1:00 PM" },
  ],

  // Dress code card (colours are shown as small circles)
  dressCode: {
  title: "Elegant formal",
  text: "We would love to see you in olive, champagne, plum, dusty pink.",
  colors: [
    "#6b7340", // Olive
    "#b3924f", // Champagne
    "#8E4585", // Plum
    "#D8A7A7", // Dusty Pink
        ],
    },

  // Wedding party groups
  party: [
    { role: "Bridal party", people: ["Janet", "Ifedolapo", "Bolakunmi", "Taofeeqah", "Lafunky", "Ayooluwa", "Oluwakemi", "Mary", "Jumoke", "Maaruphiano", "Neemarh", "Mynah", "Jane", "Sarah", "Oluwadamilola", "Temmy"] },
    { role: "Groomsmen", people: ["Gbolahan", "Phizzy", "Dapxy", "Torna", "Hemjay", "Gbade", "Josh", "Ugonna", "Lanre", "Xino", "Idris"] },
  ],

  // Questions in "Good to know" (sample answers: edit them)
  faqs: [
    { q: "How do I share my photos?", a: "Scan the QR code at the venue or tap Share your photos on this page. You can upload photos and videos straight from your phone." },
    // { q: "Can I bring children?", a: "Yes, little ones are welcome. Please keep them close during the ceremony." },
    // { q: "Is there parking?", a: "Yes, parking is available at both venues. Please arrive early as spaces fill up." },
    { q: "What time should I arrive?", a: "Please arrive by 1:00 PM so the ceremony can start on time." },
    { q: "Can I take photos during the ceremony?", a: "Yes, but please keep your phone quiet and out of the aisle. Our photographer will capture the main moments." },
  ],

  // Gift section. Set gifts to null to hide the whole section
//   gifts: {
//     text: "Your presence is the greatest gift. If you would like to give something, the details are below.",
//     details: [
//       { label: "Bank", value: "Bank name here" },
//       { label: "Account name", value: "Account name here" },
//       { label: "Account number", value: "0000000000" },
//     ],
//   },

  // Contact shown in the footer
  contact: { name: "Wedding coordinator (0deYours)", phone: "+234-706-4554-145" },
};