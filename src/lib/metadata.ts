import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type,
      publishedTime,
      modifiedTime,
      siteName: site.name,
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}
