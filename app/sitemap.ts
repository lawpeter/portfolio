import type { MetadataRoute } from "next";
import { getProjects, getDevlogEntries, projectPath } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/devlog", ...getProjects().map(projectPath), ...getDevlogEntries().map(e => `/devlog/${e.slug}`)].map(path => ({ url: `https://peterlaw.dev${path}` }));
}
