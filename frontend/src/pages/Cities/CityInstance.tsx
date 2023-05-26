import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { CityInstanceJSON } from "./CityJSON";
import Highlighter from "react-highlight-words";
import { numberWithCommas } from "../Utility";

interface IProps {
  key: number;
  instance: CityInstanceJSON;
  search_terms: Array<string>;
}

class CityInstance extends React.Component<IProps, {}> {
  render() {
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Img
          variant="top"
          src={this.props.instance.image_url}
          width="200"
          height="150"
        />
        <Card.Body>
          <Card.Title>
            <Highlighter
              searchWords={
                this.props.search_terms == null ? [] : this.props.search_terms
              }
              textToHighlight={this.props.instance.name}
            />
          </Card.Title>
          <p>
            State:{" "}
            <Highlighter
              searchWords={
                this.props.search_terms == null ? [] : this.props.search_terms
              }
              textToHighlight={this.props.instance.state}
            />
          </p>
          <p>
            Population:{" "}
            <Highlighter
              searchWords={
                this.props.search_terms == null ? [] : this.props.search_terms
              }
              textToHighlight={`${numberWithCommas(
                this.props.instance.population
              )}`}
            />
          </p>
          <p>
            Median Household Income: $
            <Highlighter
              searchWords={
                this.props.search_terms == null ? [] : this.props.search_terms
              }
              textToHighlight={`${numberWithCommas(
                this.props.instance.median_household_income
              )}`}
            />
          </p>
          <p>
            People with disability:{" "}
            <Highlighter
              searchWords={
                this.props.search_terms == null ? [] : this.props.search_terms
              }
              textToHighlight={`${this.props.instance.disability}`}
            />
            %
          </p>
          <p>
            People with no health insurance:{" "}
            <Highlighter
              searchWords={
                this.props.search_terms == null ? [] : this.props.search_terms
              }
              textToHighlight={`${this.props.instance.no_health_insurance}`}
            />
            %
          </p>
          <Link to={`/cities/${this.props.instance.id}`}>
            <Button variant="primary">See more</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

export default CityInstance;
