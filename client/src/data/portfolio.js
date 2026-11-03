// Portfolio facts are sourced from Amir's June 2026 resume, with his current
// Centennial program added. Approximate results retain their original qualifiers.
export const profile = {
  name: "Amir Younesi",
  shortName: "Amir Younesi",
  role: "Full-Stack Developer",
  location: "Richmond Hill, Ontario",
  email: "amiryh.dev@gmail.com",
  phone: "+1 647-879-1229",
  youtube: "https://www.youtube.com/@SpikeTaka",
  linkedin: "https://www.linkedin.com/in/amyouh/",
  resume: "/documents/Amir-Younesi-Resume.pdf",
};
export const navigation = [
  { path: "/", label: "Home", number: "01" },
  { path: "/about", label: "About me", number: "02" },
  { path: "/projects", label: "Projects", number: "03" },
  { path: "/education", label: "Education", number: "04" },
  { path: "/services", label: "Services", number: "05" },
  { path: "/contact", label: "Contact", number: "06" },
];
export const projects = [
  {
    slug: "editools",
    number: "01",
    title: "Editools",
    category: "Web application",
    subtitle: "A creative tool, engineered for speed.",
    period: "Oct 2020 — Sep 2023",
    role: "Frontend Developer",
    company: "Editools",
    description:
      "A browser-based graphic design platform with an integrated SVG editor and a library of over two million creative assets.",
    result: "≈ 3× faster initial loading",
    tags: ["React", "Next.js", "Node.js", "Cloud storage"],
    image: "/images/editools.svg",
    imageAlt:
      "Editools architecture overview: prioritized assets and lazy loading feed the design editor and SVG editor.",
    challenge:
      "A graphic design editor needs to feel immediate, even when its asset library contains millions of images, vectors, fonts, and templates.",
    approach: [
      "Built the browser interface with React and Next.js, working closely with UI/UX designers.",
      "Prioritized and categorized editor assets, then combined lazy loading with caching to improve the initial experience.",
      "Developed an embedded SVG editor so users could modify vector graphics within the platform.",
      "Integrated cloud object storage and introduced automated testing to support reliability.",
    ],
    outcomes: [
      { value: "≈ 3×", label: "Faster initial loading" },
      { value: "2M+", label: "Creative assets supported" },
    ],
    takeaway:
      "A responsive creative experience starts with deciding what the user needs first, and loading the rest when it matters.",
  },
  {
    slug: "travel-platform",
    number: "02",
    title: "Travel booking platform",
    category: "Full-stack platform",
    subtitle: "Less manual work. A smoother booking journey.",
    period: "Sep 2014 — Sep 2020",
    role: "Full-Stack Developer",
    company: "Mosaferan Aseman Hashtom Travel Agency",
    description:
      "An integrated booking platform for flights, hotels, buses, and travel insurance, built with Vue.js and Laravel.",
    result: "≈ 70% less support workload",
    tags: ["Vue.js", "Laravel", "REST APIs", "Queues"],
    image: "/images/travel.svg",
    imageAlt:
      "Travel platform workflow: the Vue application connects through a cached API to a Laravel booking queue and automated ticket issuance.",
    challenge:
      "Travel reservations involve external providers, repeated API requests, ticket issuance, and refunds. Manual workflows create unnecessary work for both customers and support teams.",
    approach: [
      "Developed and maintained a Vue.js application supported by Laravel REST APIs.",
      "Automated ticket issuance using Laravel Queue and improved the surrounding support workflows.",
      "Introduced a structured cache to reduce repeated requests to external providers.",
      "Built an online refund workflow, affiliate features, and a customer scoring system.",
    ],
    outcomes: [
      { value: "≈ 70%", label: "Less support workload" },
      { value: "≈ 20%", label: "Lower external API usage and costs" },
      { value: "≈ 75%", label: "Less refund paperwork" },
    ],
    takeaway:
      "Good software improves the work behind the interface as much as the experience in front of it.",
  },
  {
    slug: "uphub",
    number: "03",
    title: "UpHub",
    category: "Mobile · In development",
    subtitle: "Connecting people with their local community.",
    period: "2024 — Present",
    role: "Founder & Full-Stack Developer",
    company: "Independent project · Greater Toronto Area",
    description:
      "A bilingual mobile platform for discovering local businesses, promotions, events, and community services across the GTA.",
    result: "From mobile experience to backend",
    tags: ["React Native", "Expo", "Next.js", "MongoDB"],
    image: "/images/uphub.svg",
    imageAlt:
      "UpHub system overview: a bilingual React Native app connects to authentication, business profiles, maps, and cloud media.",
    challenge:
      "Local discovery needs a coherent experience for two audiences: people looking for nearby services and businesses managing their presence.",
    approach: [
      "Designed and developed a bilingual mobile experience with React Native and Expo.",
      "Built phone-based OTP authentication, role-based flows, and onboarding.",
      "Implemented business profiles, working hours, service management, maps, and cloud media uploads.",
      "Developed the backend with Next.js, MongoDB, Mongoose, NextAuth, Zod, AWS S3, and CloudFront.",
    ],
    outcomes: [
      { value: "2", label: "Languages in one experience" },
      { value: "End to end", label: "Mobile application and backend" },
    ],
    takeaway:
      "Building a product end to end means keeping the customer journey, the data model, and the operational details aligned.",
  },
];
export const experience = [
  {
    dates: "2024 — Present",
    title: "Founder & Full-Stack Developer",
    company: "UpHub",
    detail:
      "Building a bilingual mobile platform for local discovery in the Greater Toronto Area.",
    tags: ["React Native", "Expo", "Next.js"],
  },
  {
    dates: "2020 — 2023",
    title: "Frontend Developer",
    company: "Editools",
    detail:
      "Developed a browser-based design platform, embedded SVG editing, and faster asset delivery.",
    tags: ["React", "Next.js", "Node.js"],
  },
  {
    dates: "2014 — 2020",
    title: "Full-Stack Developer",
    company: "Mosaferan Aseman Hashtom",
    detail:
      "Built travel booking systems and automated ticketing, refunds, and support workflows.",
    tags: ["Vue.js", "Laravel", "REST APIs"],
  },
  {
    dates: "2010 — 2014",
    title: "Frontend Developer",
    company: "Aftab Saheli Toos",
    detail:
      "Helped build an online airline-ticket platform, integrate booking APIs, and improve cross-device performance.",
    tags: ["JavaScript", "PHP", "Laravel"],
  },
];
export const skillGroups = [
  {
    title: "Interfaces",
    items: [
      "React",
      "Next.js",
      "Vue",
      "Nuxt",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML & CSS",
    ],
  },
  { title: "Mobile", items: ["React Native", "Expo", "NativeWind"] },
  {
    title: "Backend & data",
    items: ["Node.js", "Express", "Laravel", "REST APIs", "MongoDB", "MySQL"],
  },
  {
    title: "Delivery & architecture",
    items: [
      "Git",
      "Redux Toolkit",
      "RTK Query",
      "AWS S3",
      "CloudFront",
      "Caching",
      "Queues",
      "Unit testing",
    ],
  },
];
