import { useEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { searchByDate as HN_searchByDate } from "../services/HackerNewsAPI";
import { HN_SearchResponse } from "../services/HackerNewsAPI.types";
import Pagination from "../components/Pagination";

const SearchPage = () => {
  const [error, setError] = useState<string | false>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<HN_SearchResponse | null>(null);
  const queryRef = useRef("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maxPages = useRef(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchHackerNews = async (searchQuery: string) => {
    // reset state + set loading to true
    setError(false);
    setIsLoading(true);
    setSearchResult(null);

    // save searchQuery to queryRef
    queryRef.current = searchQuery;

    // get search results from API
    try {
      const data = await HN_searchByDate(searchQuery);
      console.log("data: ", data);
      if (data.nbPages) {
        maxPages.current = data.nbPages;
      }

      // update state with search results
      setSearchResult(data);
    } catch (err) {
      // handle any errors
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Aouch, stop throwing things that are not Errors at me");
      }
    }

    // set loading to false
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🧹
    const trimmedSearchInput = searchInput.trim();

    // prevent smol haxx0rs
    if (trimmedSearchInput.length < 2) {
      // slap user in face
      return;
    }

    // search HN
    searchHackerNews(trimmedSearchInput);
  };

  function updateView(newSearchResult: HN_SearchResponse) {
    setIsLoading(false);
    setSearchResult(newSearchResult);
  }

  return (
    <>
      <h1>🔎🔦👀</h1>

      <Form className="mb-4" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="searchQuery">
          <Form.Label>Search Query</Form.Label>
          <Form.Control
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter your search query"
            required
            type="text"
            value={searchInput}
            ref={inputRef}
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button disabled={searchInput.trim().length < 2} type="submit" variant="success">
            Search
          </Button>
        </div>
      </Form>

      {error && <Alert variant="warning">{error}</Alert>}

      {isLoading && <p>🤔 Loading...</p>}

      {searchResult && (
        <div id="search-result">
          <p>
            Showing {searchResult.nbHits} search results for "{queryRef.current}"...
          </p>

          {searchResult.hits.length > 0 && (
            <ListGroup className="mb-3">
              {searchResult.hits.map((hit) => (
                <ListGroup.Item action href={hit.url} key={hit.objectID}>
                  <h2 className="h3">{hit.title}</h2>
                  <p className="text-muted small mb-0">
                    {hit.points} points by {hit.author} at {hit.created_at}
                  </p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Pagination
            searchResult={searchResult}
            searchInput={searchInput}
            maxPages={maxPages}
            updateView={updateView}
          />
        </div>
      )}
    </>
  );
};

export default SearchPage;
