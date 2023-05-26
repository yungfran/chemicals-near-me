import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Highlighter from "react-highlight-words";
import { ContaminantInstanceJSON } from "../contaminants/ContaminantJSON";

interface IProps {
  key: number
  instance: ContaminantInstanceJSON
  search_terms: Array<string>
}

class ContaminantInstance extends React.Component<IProps, {}> {
  render() {
    return (
      <Card style={{width: "18rem"}}>
        <Card.Body>
          <Card.Title><Highlighter
              searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
              textToHighlight={this.props.instance.name}
          /></Card.Title>
          <p><Highlighter
            searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
            textToHighlight={this.props.instance.cas_num}
          /></p>
          <p><Highlighter
            searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
            textToHighlight={`${this.props.instance.molecular_weight}`}
          /></p>
          <p><Highlighter
            searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
            textToHighlight={this.props.instance.chemical_formula}
          /></p>
          <p><Highlighter
            searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
            textToHighlight={this.props.instance.boiling_point}
          /></p>
          <p><Highlighter
            searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
            textToHighlight={`${this.props.instance.melting_point}`}
          /></p>
          <Link to={`/contaminants/${this.props.instance.id}`}>
            <Button variant="primary">See more</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

export default ContaminantInstance;
