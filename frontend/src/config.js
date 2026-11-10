// All wedding details live here. Every value is a PLACEHOLDER: replace with the real ones
export const wedding = {
  partnerOne: "Aminat", // First name
  partnerTwo: "Sodeeq", // Second name
  dateText: "Saturday, 5th December 2026", // Date as shown on the page
  dateISO: "2026-12-05T00:00:00+01:00", // Countdown target: 2:00 PM Lagos time (+01:00)
  calendarStart: "20261205T130000Z", // Start for "Add to calendar" in UTC (1 hour behind Lagos)
  calendarEnd: "20261205T200000Z", // End for "Add to calendar" in UTC
  venue: "Lagos, Nigeria", // Short location under the date
  hashtag: "#Yusufied", // Wedding theme / hashtag
  siteUrl: "http://localhost:3000", // CHANGE to the real website address once it is hosted (used by the QR code)
  welcome:
    "Thank you for celebrating with us. Share the photos and videos you take today so we can relive every moment.", // Hero message

  // Paragraphs for the "Our story" section
  story: [
    "We met on an ordinary afternoon and it quickly became the best day of our lives. Every day since has been a story we are grateful to write together.",
    "Today we say yes to forever, surrounded by the people we love most. Thank you for being part of it.",
  ],

  // Cards in "Meet the couple". photo: "" shows the first letter; or use "/bride.jpg" for a photo in the public folder
  couple: [
    { role: "The bride", name: "Aminat", bio: "Short sentence about the bride.", photo: "" },
    { role: "The groom", name: "Sodeeq", bio: "Short sentence about the groom.", photo: "" },
  ],

  // Rows for the "Order of the day" timeline
  schedule: [
    { time: "1:00 PM", title: "Guest arrival", text: "Find your seat and enjoy welcome drinks." },
    { time: "2:00 PM", title: "Ceremony", text: "The exchange of vows." },
    { time: "4:00 PM", title: "Cocktail hour", text: "Drinks, music and photos with the couple." },
    { time: "5:30 PM", title: "Reception", text: "Dinner, speeches and the first dance." },
    { time: "8:00 PM", title: "Party time", text: "Dance the night away." },
  ],

  // Cards in the "Venue" section (the address is used for the directions link)
  venues: [
    { label: "Ceremony", name: "Venue name here", address: "Street address, Lagos", time: "2:00 PM" },
    { label: "Reception", name: "Venue name here", address: "Street address, Lagos", time: "5:30 PM" },
  ],

  // Dress code card (colours are shown as small circles)
  dressCode: {
    title: "Elegant formal",
    text: "We would love to see you in olive, champagne, cream or earthy tones. Please avoid white.",
    colors: ["#6b7340", "#b3924f", "#efe6cc", "#353a22"],
  },

  // Wedding party groups
  party: [
    { role: "Bridal party", people: ["Name one", "Name two", "Name three"] },
    { role: "Groomsmen", people: ["Name one", "Name two", "Name three"] },
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
  contact: { name: "Wedding coordinator", phone: "+2348000000000" },
};