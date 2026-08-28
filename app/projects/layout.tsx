import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Portfolio | Ocean Lighting Solutions Negombo",
  description:
    "Explore our portfolio of completed LED lighting and luxury bathware installations in hotels, commercial developments, and luxury residences across Sri Lanka.",
  keywords: [
    "lighting projects Sri Lanka",
    "commercial lighting projects Negombo",
    "hotel lighting design Sri Lanka",
    "luxury villa bathware projects",
    "Ocean Lighting portfolio",
  ],
  alternates: { canonical: "https://www.oceanlighting.lk/projects" },
  openGraph: {
    title: "Projects & Portfolio | Ocean Lighting Solutions Negombo",
    description: "View our showcase of hotel, commercial, and luxury residential projects across Sri Lanka.",
    url: "https://www.oceanlighting.lk/projects",
    siteName: "Ocean Lighting Solutions",
    images: [{ url: "https://www.oceanlighting.lk/og-image.jpg", alt: "Ocean Lighting Projects Portfolio" }],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
