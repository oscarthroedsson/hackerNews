import { useState } from "react";
import { search } from "../services/HackerNewsAPI";
import { Button } from "react-bootstrap";
import { HN_SearchResponse } from "../services/HackerNewsAPI.types";

import { RefObject } from "react";

interface PaginationControllerProps {
  searchResult: HN_SearchResponse | null;
  searchInput: string;
  maxPages: RefObject<number>;
  callback: (newPage: HN_SearchResponse) => void;
}

export default function PaginationController({
  searchResult,
  searchInput,
  maxPages,
  callback,
}: PaginationControllerProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!searchResult) return;
  if (searchResult.page === null) return;
  if (!searchInput) return;
  if (!maxPages) return;

  async function paginationMinusOne() {
    if (!searchResult || searchResult.page <= 0) {
      return;
    }

    setIsLoading(true);
    const newPage = await search(searchInput, searchResult.page + 1);
    callback(newPage);
    setIsLoading(false);
  }

  async function paginationPlusOne() {
    if (!searchResult || searchResult.page <= 0) {
      return;
    }

    setIsLoading(true);
    const newPage = await search(searchInput, searchResult.page + 1);
    callback(newPage);
    setIsLoading(false);
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="prev">
        <Button variant="primary" onClick={paginationMinusOne} disabled={isLoading || searchResult.page + 1 === 1}>
          Previous Page
        </Button>
      </div>

      <div className="page">{searchResult && searchResult.page + 1}</div>

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
