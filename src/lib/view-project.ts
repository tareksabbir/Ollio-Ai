// Type definition for projects
export type Project = {
  id: number;
  title: string;
  category: string;
  image: string;
  htmlPath?: string; // Optional: for external HTML files
  htmlContent?: string; // Optional: for inline HTML
};

// Projects array
export const projects: Project[] = [
  {
    id: 1,
    title: "Sora Autimate",
    category: "Landing Pages",
    image: "/asset/sora-light.png",
    htmlPath: "/projects/sora.html", // External file
  },
  {
    id: 2,
    title: "Alpine",
    category: "Landing Pages",
    image: "/asset/alpine.png",
    htmlPath: "/projects/alpine.html", // External file
  },
  {
    id: 3,
    title: "MarketAI",
    category: "Business Tools",
    image: "/asset/market.png",
    htmlPath: "/projects/marketai.html", // External file
  },
  {
    id: 4,
    title: "Viraasat",
    category: "Business Tools",
    image: "/asset/viraasat.png",
    htmlPath: "/projects/viraasat.html", // External file
  },
  {
    id: 5,
    title: "Beset",
    category: "Advanced Apps",
    image: "/asset/beset.png",
    htmlPath: "/projects/besetteam.html", // External file
  },
  {
    id: 6,
    title: "Agency",
    category: "Business Tools",
    image: "/asset/agency.png",
    htmlPath: "/projects/agency.html", // External file
  },
  {
    id: 7,
    title: "Arovel",
    category: "E-Commerce",
    image: "/asset/arovel.png",
    htmlPath: "/projects/arovel.html", // External file
  },
  {
    id: 8,
    title: "Pakit",
    category: "E-Commerce",
    image: "/asset/tactic.png",
    htmlPath: "/projects/tactic.html", // External file
  },
  {
    id: 9,
    title: "Digital",
    category: "Personal Tools",
    image: "/asset/digital.png",
    htmlPath: "/projects/digital.html", // External file
  },
];
