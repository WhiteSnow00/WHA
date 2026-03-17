import type { CSSProperties, ImgHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type MdxImageProps = ImgHTMLAttributes<HTMLImageElement>;

function getDimension(value: number | string | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number.parseInt(value, 10);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return undefined;
}

export function MdxImage({
  alt = "",
  className,
  decoding,
  height,
  loading,
  style,
  width,
  ...props
}: MdxImageProps) {
  const parsedWidth = getDimension(width);
  const parsedHeight = getDimension(height);
  const imageStyle: CSSProperties = {
    ...style,
    ...(parsedWidth && parsedHeight
      ? { aspectRatio: `${parsedWidth} / ${parsedHeight}` }
      : {}),
  };

  return (
    <img
      {...props}
      alt={alt}
      className={cn(
        "my-8 max-h-[70vh] w-full max-w-full rounded-xl border border-border/50 bg-muted/20 object-contain shadow-sm",
        className,
      )}
      decoding={decoding ?? "async"}
      height={height}
      loading={loading ?? "lazy"}
      style={imageStyle}
      width={width}
    />
  );
}
