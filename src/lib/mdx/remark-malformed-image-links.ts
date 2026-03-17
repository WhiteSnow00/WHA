const IMAGE_LABEL_PATTERN = /^Image(?:\s*:\s*(.+))?$/i;
const IMAGE_URL_PATTERN =
  /\.(?:avif|gif|jpe?g|png|svg|webp)(?:$|[?#])/i;

type MarkdownNode = {
  alt?: string;
  children?: MarkdownNode[];
  title?: string | null;
  type?: string;
  url?: string;
  value?: string;
};

function isLikelyImageUrl(url: string) {
  try {
    const parsedUrl = new URL(url, "https://example.com");

    return IMAGE_URL_PATTERN.test(parsedUrl.pathname + parsedUrl.search);
  } catch {
    return IMAGE_URL_PATTERN.test(url);
  }
}

function getImageAlt(children: MarkdownNode[] | undefined) {
  if (!children || children.length !== 1) {
    return null;
  }

  const [child] = children;

  if (child.type !== "text" || typeof child.value !== "string") {
    return null;
  }

  const label = child.value.trim();
  const labelMatch = label.match(IMAGE_LABEL_PATTERN);

  if (!labelMatch) {
    return null;
  }

  return labelMatch[1]?.trim() || label;
}

function visitNode(node: MarkdownNode) {
  if (!node.children) {
    return;
  }

  node.children = node.children.map((child) => {
    if (child.type === "link" && typeof child.url === "string") {
      const alt = getImageAlt(child.children);

      if (alt && isLikelyImageUrl(child.url)) {
        return {
          alt,
          title: child.title ?? null,
          type: "image",
          url: child.url,
        };
      }
    }

    visitNode(child);

    return child;
  });
}

export function remarkMalformedImageLinks() {
  return (tree: MarkdownNode) => {
    visitNode(tree);
  };
}
