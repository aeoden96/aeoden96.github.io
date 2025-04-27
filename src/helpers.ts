import replace from "lodash/replace";
import toString from "lodash/toString";

/**
 * Remove the .html extension from a pathname and return a canonical URL
 * @param path - The pathname to convert to a canonical URL
 * @param site - The site URL to use for the canonical URL
 * @returns The canonical URL
 */
export const toCanonicalUrl = (path: string, site?: URL) => {
  let cleanPathname = path.endsWith(".html") ? path.slice(0, -5) : path;
  const canonicalUrl = site ? new URL(cleanPathname, site) : cleanPathname;

  return replace(toString(canonicalUrl), /\/$/, "");
};
