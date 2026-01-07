// Type definition for projects
export type Project = {
  id: string; // Changed from number to string
  title: string;
  category: string;
  image: string;
  htmlPath?: string; // Optional: for external HTML files
  htmlContent?: string; // Optional: for inline HTML
};

// Projects array
export const projects: Project[] = [
  {
    id: "1", // Changed to string
    title: "Sora Autimate",
    category: "Landing Pages",
    image: "/asset/sora-light.png",
    htmlPath: "/projects/sora.html",
  },
  {
    id: "2",
    title: "Alpine",
    category: "Landing Pages",
    image: "/asset/alpine.png",
    htmlPath: "/projects/alpine.html",
  },
  {
    id: "3",
    title: "MarketAI",
    category: "Business Tools",
    image: "/asset/market.png",
    htmlPath: "/projects/marketai.html",
  },
  {
    id: "4",
    title: "Viraasat",
    category: "Business Tools",
    image: "/asset/viraasat.png",
    htmlPath: "/projects/viraasat.html",
  },
  {
    id: "5",
    title: "Beset",
    category: "Advanced Apps",
    image: "/asset/beset.png",
    htmlPath: "/projects/besetteam.html",
  },
  {
    id: "6",
    title: "Agency",
    category: "Business Tools",
    image: "/asset/agency.png",
    htmlPath: "/projects/agency.html",
  },
  {
    id: "7",
    title: "Arovel",
    category: "E-Commerce",
    image: "/asset/arovel.png",
    htmlPath: "/projects/arovel.html",
  },
  {
    id: "8",
    title: "Pakit",
    category: "E-Commerce",
    image: "/asset/tactic.png",
    htmlPath: "/projects/tactic.html",
  },
  {
    id: "9",
    title: "Digital",
    category: "Personal Tools",
    image: "/asset/digital.png",
    htmlPath: "/projects/digital.html",
  },
  {
    id: "10",
    title: "Nexsales",
    category: "Personal Tools",
    image: "/asset/nextseles.png",
    htmlPath: "/projects/nextselse.html",
  },
  {
    id: "11",
    title: "Cube 3D",
    category: "Advanced Apps",
    image: "/asset/cube.png",
    htmlPath: "/projects/cube.html",
  },
  {
    id: "12",
    title: "ApexNeural",
    category: "Advanced Apps",
    image: "/asset/apex.png",
    htmlPath: "/projects/apex.html",
  },
];