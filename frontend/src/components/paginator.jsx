import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const Paginator = ({
  onPreviousHandler,
  onNextHandler,
  disableNext,
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={onPreviousHandler} />
        </PaginationItem>
        {disableNext ? null : (
          <PaginationItem>
            <PaginationNext href="#" onClick={onNextHandler} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
