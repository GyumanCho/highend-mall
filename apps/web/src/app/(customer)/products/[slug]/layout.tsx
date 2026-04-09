import type { Metadata } from "next";
import { getProductBySlug, formatPrice } from "@/lib/mock-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.titleDisplay,
    description: product.descriptionHero,
    openGraph: {
      title: `${product.titleDisplay} | Maison`,
      description: product.descriptionHero,
      type: "website",
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
