import { useState, RefObject } from "react";
import { search } from "../services/HackerNewsAPI";
import { Button } from "react-bootstrap";
import { HN_SearchResponse } from "../services/HackerNewsAPI.types";

interface PaginationControllerProps {
  searchResult: HN_SearchResponse | null;
  searchInput: string;
  maxPages: RefObject<number>;
  updateView: (newPage: HN_SearchResponse) => void;
}

export default function Pagination({ searchResult, searchInput, maxPages, updateView }: PaginationControllerProps) {
  const [isLoading, setIsLoading] = useState(false);

  //? Wtf, är  detta bra TS?!
  if (!searchResult) return;
  if (searchResult.page === null) return;
  if (!searchInput) return;
  if (!maxPages) return;

  async function paginationMinusOne() {
    if (!searchResult || searchResult.page <= 0) {
      console.log("paginationMinusOne | if var sann");
      return;
    }

    setIsLoading(true);
    const newPage = await search(searchInput, searchResult.page - 1);
    updateView(newPage);
    setIsLoading(false);
  }

  async function paginationPlusOne() {
    if (!searchResult || searchResult.page === maxPages.current) {
      return;
    }

    setIsLoading(true);
    const newPage = await search(searchInput, searchResult.page + 1);
    updateView(newPage);
    setIsLoading(false);
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="prev">
        <Button variant="primary" onClick={paginationMinusOne} disabled={isLoading || searchResult.page + 1 === 1}>
          Previous Page
        </Button>
      </div>

      <div className="page">
        {searchResult && searchResult.page + 1} / {maxPages.current}
      </div>

      <div className="next">
        <Button
          variant="primary"
          onClick={paginationPlusOne}
          disabled={isLoading || searchResult.page + 1 === maxPages.current}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
}
