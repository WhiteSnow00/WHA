import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (

  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  isDisabled?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  isDisabled,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      isDisabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  isDisabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    isDisabled={isDisabled}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  isDisabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    isDisabled={isDisabled}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  onPageChange?: (page: number) => void;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLast = true,
}) => {
  const getPageRange = () => {
    const range: (number | string)[] = [];
    const showEllipsisStart = currentPage > maxVisiblePages - 2;
    const showEllipsisEnd = currentPage < totalPages - (maxVisiblePages - 3);

    if (showEllipsisStart) {
      range.push(1);
      if (currentPage > maxVisiblePages - 1) range.push('...');
    }

    for (let i = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
         i <= Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));
         i++) {
      range.push(i);
    }

    if (showEllipsisEnd) {
      if (currentPage < totalPages - (maxVisiblePages - 2)) range.push('...');
      range.push(totalPages);
    }

    return range;
  };

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}${page}`;
  };

  const handleKeyboardNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      onPageChange?.(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    } else if (e.key === 'Home') {
      onPageChange?.(1);
    } else if (e.key === 'End') {
      onPageChange?.(totalPages);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        onPageChange?.(currentPage > 1 ? currentPage - 1 : currentPage);
      } else if (e.altKey && e.key === 'n') {
        onPageChange?.(currentPage < totalPages ? currentPage + 1 : currentPage);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onPageChange]);

  return (
    <Pagination>
      <PaginationContent 
        className="flex-wrap"
        onKeyDown={handleKeyboardNavigation}
        role="navigation"
        aria-label="Pagination Navigation"
      >
        {showFirstLast && (
          <PaginationItem>
            <PaginationLink
              href={getPageUrl(1)}
              isDisabled={currentPage === 1}
              aria-label="Go to first page"
            >
              First
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? getPageUrl(currentPage - 1) : undefined}
            isDisabled={currentPage === 1}
            onClick={(e) => {
              if (currentPage > 1) {
                e.preventDefault();
                onPageChange?.(currentPage - 1);
              }
            }}
          />
        </PaginationItem>

        {getPageRange().map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {typeof page === 'number' ? (
              <PaginationLink
                href={getPageUrl(page)}
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange?.(page);
                }}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? getPageUrl(currentPage + 1) : undefined}
            isDisabled={currentPage === totalPages}
            onClick={(e) => {
              if (currentPage < totalPages) {
                e.preventDefault();
                onPageChange?.(currentPage + 1);
              }
            }}
          />
        </PaginationItem>

        {showFirstLast && (
          <PaginationItem>
            <PaginationLink
              href={getPageUrl(totalPages)}
              isDisabled={currentPage === totalPages}
              aria-label="Go to last page"
            >
              Last
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>

      <div className="mt-2 text-center text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
    </Pagination>
  );
};

export default PaginationComponent;