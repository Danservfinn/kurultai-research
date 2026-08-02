import type { PublicPost } from "./content";

export function getStableBuildTimestamp(
  posts: PublicPost[],
  environment: { SOURCE_DATE_EPOCH?: string } = process.env,
): string {
  const epoch = environment.SOURCE_DATE_EPOCH;
  if (epoch && /^\d+$/.test(epoch)) return new Date(Number(epoch) * 1000).toISOString();
  const newestPublicationDate = posts[0]?.date ?? "1970-01-01";
  return new Date(`${newestPublicationDate}T00:00:00Z`).toISOString();
}
