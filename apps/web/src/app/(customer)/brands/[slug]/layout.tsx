import type { Metadata } from "next";
import { getBrandBySlug } from "@/lib/mock-data";
import { getBrandStory } from "@/lib/brand-stories";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  const story = getBrandStory(slug);

  if (!brand) {
    return { title: "Brand Not Found" };
  }

  return {
    title: brand.name,
    description: story?.subheadline ?? brand.description,
    openGraph: {
      title: `${brand.name} | Maison`,
      description: story?.subheadline ?? brand.description,
      type: "website",
    },
  };
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
