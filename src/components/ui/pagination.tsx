import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (


  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center transition-opacity duration-200", className)}
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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
  onClick,
  ...props
}: React.ComponentProps<"span"> & { onClick?: () => void }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center cursor-pointer hover:bg-accent hover:text-accent-foreground", className)}
    onClick={onClick}
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
  const [showInput, setShowInput] = React.useState<number | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleEllipsisClick = (index: number) => {
    setShowInput(index);
    setInputValue('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const page = parseInt(inputValue);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        // Create a link element that matches our PaginationLink structure
        const link = document.createElement('a');
        link.href = getPageUrl(page);
        link.className = buttonVariants({ variant: 'ghost' });
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Update the state
        onPageChange?.(page);
        setShowInput(null);
        setInputValue('');
      }
    } else if (e.key === 'Escape') {
      setShowInput(null);
      setInputValue('');
    }
  };




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
    // Ensure baseUrl ends with a slash if it doesn't already
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    if (page === 1) return normalizedBaseUrl;
    return `${normalizedBaseUrl}${page}`;
  };

  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, page: number) => {
    if (page === currentPage) {
      e.preventDefault();
      return;
    }
    
    // Call onPageChange callback if provided
    onPageChange?.(page);
    
    // Let the native link and Astro's view transitions handle the navigation
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
      className="flex-wrap transition-all duration-200 ease-in-out"

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
                  onClick={(e) => handlePageClick(e, 1)}

            >
              First
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
            <PaginationPrevious
            href={currentPage > 1 ? getPageUrl(currentPage - 1) : undefined}
            isDisabled={currentPage === 1}
            onClick={(e) => handlePageClick(e, currentPage - 1)}

            />
        </PaginationItem>

        {getPageRange().map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {typeof page === 'number' ? (
              <PaginationLink
              href={getPageUrl(page)}
              isActive={page === currentPage}
              onClick={(e) => handlePageClick(e, page)}
              aria-current={page === currentPage ? 'page' : undefined}
              >
              {page}
              </PaginationLink>
            ) : (
              showInput === index ? (
                <input
                ref={inputRef}
                type="number"
                min={1}
                max={totalPages}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputSubmit}
                onBlur={() => setShowInput(null)}
                className="w-16 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

              ) : (
              <PaginationEllipsis onClick={() => handleEllipsisClick(index)} />
              )
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
            <PaginationNext
            href={currentPage < totalPages ? getPageUrl(currentPage + 1) : undefined}
            isDisabled={currentPage === totalPages}
            onClick={(e) => handlePageClick(e, currentPage + 1)}

            />
        </PaginationItem>

        {showFirstLast && (
          <PaginationItem>
            <PaginationLink
              href={getPageUrl(totalPages)}
              isDisabled={currentPage === totalPages}
              aria-label="Go to last page"
                  onClick={(e) => handlePageClick(e, totalPages)}

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