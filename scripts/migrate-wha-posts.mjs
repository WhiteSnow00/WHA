import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { getFrontmatter } from "next-mdx-remote-client/utils";

function slugify(input) {
  return String(input ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function normalizeDate(input) {
  if (!input) return undefined;

  if (input instanceof Date && !Number.isNaN(input.valueOf())) {
    return input.toISOString().slice(0, 10);
  }

  const raw = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.valueOf())) return parsed.toISOString().slice(0, 10);

  return undefined;
}

function escapeYamlString(input) {
  return String(input ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function convertAbbrHtmlToTextOnly(markdown) {
  return markdown.replace(
    /<abbr\s+[^>]*title="([^"]+)"[^>]*>([\s\S]*?)<\/abbr>/gi,
    (_match, title, inner) => {
      const label = String(inner ?? "").trim();
      const expanded = String(title ?? "").trim();
      if (!expanded) return label;
      if (!label) return expanded;
      if (expanded.toLowerCase() === label.toLowerCase()) return label;
      return `${label} (${expanded})`;
    },
  );
}

function convertImgHtmlToTextOnly(markdown) {
  return markdown.replace(/<img\s+[^>]*>/gi, (imgTag) => {
    const srcMatch = imgTag.match(/\bsrc="([^"]+)"/i);
    const altMatch = imgTag.match(/\balt="([^"]+)"/i);
    const src = srcMatch?.[1]?.trim();
    const alt = altMatch?.[1]?.trim();
    if (!src) return "";
    const label = alt ? `Image: ${alt}` : "Image";
    return `[${label}](${src})`;
  });
}

function convertFigureHtmlToTextOnly(markdown) {
  return markdown.replace(/<figure[\s\S]*?<\/figure>/gi, (figureTag) => {
    const imgMatch = figureTag.match(/<img\s+[^>]*>/i);
    const imgTag = imgMatch?.[0];

    const srcMatch = imgTag?.match(/\bsrc="([^"]+)"/i);
    const altMatch = imgTag?.match(/\balt="([^"]+)"/i);
    const src = srcMatch?.[1]?.trim();
    const alt = altMatch?.[1]?.trim();

    const withoutImg = imgTag ? figureTag.replace(imgTag, "") : figureTag;
    const caption = withoutImg
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?figure[^>]*>/gi, "")
      .replace(/<\/?[^>]+>/g, "")
      .trim();

    const parts = [];
    if (src) parts.push(`[${alt ? `Image: ${alt}` : "Image"}](${src})`);
    if (caption) parts.push(caption);
    return parts.join("\n\n");
  });
}

function convertMarkdownImagesToTextOnly(markdown) {
  return markdown.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, url) => {
    const label = String(alt ?? "").trim();
    return `[${label ? `Image: ${label}` : "Image"}](${String(url).trim()})`;
  });
}

function normalizeContentToRealm(markdown) {
  let out = String(markdown ?? "");

  out = convertFigureHtmlToTextOnly(out);
  out = convertImgHtmlToTextOnly(out);
  out = convertAbbrHtmlToTextOnly(out);
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = convertMarkdownImagesToTextOnly(out);
  out = out.replace(/&nbsp;/gi, " ");
  out = out.replace(/\r\n/g, "\n");

  return out.trim() + "\n";
}

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
    overwrite: argv.includes("--overwrite"),
  };
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const { dryRun, overwrite } = parseArgs(process.argv.slice(2));

  const repoRoot = process.cwd();
  const whaBlogDir = path.join(repoRoot, "WHA", "src", "content", "blog");
  const realmPostsDir = path.join(repoRoot, "posts");

  const dirents = await fs.readdir(whaBlogDir, { withFileTypes: true });
  const blogDirs = dirents
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));

  const results = [];

  for (const dirName of blogDirs) {
    const inPath = path.join(whaBlogDir, dirName, "index.mdx");
    const input = await fs.readFile(inPath, "utf8");

    const { frontmatter, strippedSource } = getFrontmatter(input);

    if (frontmatter?.draft) continue;

    const title = frontmatter?.title ?? dirName;
    const description = frontmatter?.description ?? "";
    const date = normalizeDate(frontmatter?.date);
    const tags = Array.isArray(frontmatter?.tags) ? frontmatter.tags : [];

    const createdAt = date ?? "1970-01-01";
    const updatedAt = date ?? createdAt;

    const slug = slugify(frontmatter?.slug ?? title ?? dirName);
    if (!slug) continue;

    const outPath = path.join(realmPostsDir, `${slug}.mdx`);
    const alreadyExists = await fileExists(outPath);
    if (alreadyExists && !overwrite) {
      results.push({ slug, status: "skipped_exists", outPath });
      continue;
    }

    const normalized = normalizeContentToRealm(strippedSource);

    const frontmatterBlock = [
      "---",
      `title: "${escapeYamlString(title)}"`,
      `createdAt: "${escapeYamlString(createdAt)}"`,
      `updatedAt: "${escapeYamlString(updatedAt)}"`,
      `description: "${escapeYamlString(description)}"`,
      ...(tags.length
        ? ["tags:", ...tags.map((t) => `  - "${escapeYamlString(t)}"`)]
        : ["tags: []"]),
      "---",
      "",
    ].join("\n");

    const output = frontmatterBlock + normalized;

    if (!dryRun) await fs.writeFile(outPath, output, "utf8");

    results.push({ slug, status: alreadyExists ? "updated" : "created", outPath });
  }

  const created = results.filter((r) => r.status === "created").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const skipped = results.filter((r) => r.status === "skipped_exists").length;

  // eslint-disable-next-line no-console
  console.log(
    `WHA -> Realm posts: ${created} created, ${updated} updated, ${skipped} skipped${dryRun ? " (dry-run)" : ""}.`,
  );
  for (const r of results) {
    // eslint-disable-next-line no-console
    console.log(`- ${r.status}: ${r.slug} -> ${path.relative(repoRoot, r.outPath)}`);
  }
}

await main();
