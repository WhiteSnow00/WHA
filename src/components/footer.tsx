import { WHAStylized } from "./wha-stylized";

export function Footer() {
  return (
    <footer className="relative w-full max-w-full mx-auto overflow-hidden border-t border-border">
      {/* Keep only the stylized bottom branding */}
      <div className="relative w-full min-h-[30vh] md:min-h-[45vh] lg:min-h-[55vh]">
        <WHAStylized
          aria-hidden="true"
          className="hidden md:block w-full absolute inset-x-0 bottom-0"
        />
      </div>
    </footer>
  );
}
