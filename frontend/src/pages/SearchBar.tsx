import { useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router";

interface SearchBarProps {
  query_params: URLSearchParams;
  base_url: string;
  num_results?: number;
}

const SearchBar = (props: SearchBarProps) => {
  const history = useHistory();

  const [search_string, setSearchString] = useState(
    props.query_params.get("q") == null ? "" : props.query_params.get("q")
  );

  function onSubmit() {
    var new_query_params = new URLSearchParams(props.query_params.toString());
    new_query_params.delete("page");
    new_query_params.delete("per_page");
    new_query_params.set("q", search_string);
    history.push(props.base_url + new_query_params.toString());
    history.go(0);
  }

  return (
    <Container
      style={{
        display: "flex",
        marginTop: "1.5rem",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <InputGroup style={{ maxWidth: "75%" }}>
        <FormControl
          value={search_string}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <Button variant="primary" type="submit" onClick={onSubmit}>
          Search
        </Button>
      </InputGroup>
      {resultsDisplay(props)}
    </Container>
  );
};

const resultsDisplay = (props: SearchBarProps) => {
  if (props.num_results) {
    return (
      <h5 style={{ marginBottom: "0" }}>
        <b>{props.num_results}</b> result{props.num_results === 1 ? "" : "s"}
      </h5>
    );
  }
};

export default SearchBar;
