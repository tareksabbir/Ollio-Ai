// Type definition for projects
export type Project = {
  id: string; // Changed from number to string
  title: string;
  category: string;
  image: string;
  htmlPath?: string; // Optional: for external HTML files
  htmlContent?: string; // Optional: for inline HTML
};
