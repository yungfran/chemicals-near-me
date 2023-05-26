import React from "react";
import { Pagination } from "react-bootstrap";
import "./PageBar.css";

interface BarProps {
  model: string;
  page: number;
  per_page: number;
  num_pages: number;
  query_params: URLSearchParams;
}

interface BarState {
  cur_page: number;
  query_params: URLSearchParams;
}

export default class PageBar extends React.Component<BarProps, BarState> {
  max_pages: number;

  constructor(props: BarProps) {
    super(props);
    this.max_pages = 3;
    var query_params = this.props.query_params;
    query_params.delete("page");
    query_params.delete("per_page");
    this.state = {
      cur_page: this.props.page,
      query_params: query_params,
    };
  }

  render() {
    const minimum = Math.max(
      1,
      this.state.cur_page - Math.floor(this.max_pages / 2)
    );
    const maximum = Math.min(
      this.props.num_pages,
      minimum + this.max_pages - 1
    );
    const items = [];
    items.push(
      <Pagination.First
        key={-2}
        href={`/${this.props.model}?page=1&per_page=${
          this.props.per_page
        }&${this.props.query_params.toString()}`}
        disabled={this.state.cur_page === 1}
      />
    );
    items.push(
      <Pagination.Prev
        key={-1}
        href={`/${this.props.model}?page=${this.state.cur_page - 1}&per_page=${
          this.props.per_page
        }&${this.props.query_params.toString()}`}
        disabled={this.state.cur_page === 1}
      />
    );

    for (let i = minimum; i <= maximum; ++i) {
      items.push(
        <Pagination.Item
          key={i}
          href={`/${this.props.model}?page=${i}&per_page=${
            this.props.per_page
          }&${this.props.query_params.toString()}`}
          active={i === this.state.cur_page}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (this.props.page < this.props.num_pages - this.max_pages + 1) {
      items.push(<Pagination.Ellipsis />);
    }

    if (this.props.page < this.props.num_pages - this.max_pages + 2) {
      items.push(
        <Pagination.Item
          key={this.props.num_pages}
          href={`/${this.props.model}?page=${this.props.num_pages}&per_page=${
            this.props.per_page
          }&${this.props.query_params.toString()}`}
        >
          {this.props.num_pages}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key={this.props.num_pages + 1}
        href={`/${this.props.model}?page=${this.state.cur_page + 1}&per_page=${
          this.props.per_page
        }&${this.props.query_params.toString()}`}
        disabled={
          this.state.cur_page === this.props.num_pages ||
          this.props.num_pages === 0
        }
      />
    );
    items.push(
      <Pagination.Last
        key={this.props.num_pages + 2}
        href={`/${this.props.model}?page=${this.props.num_pages}&per_page=${
          this.props.per_page
        }&${this.props.query_params.toString()}`}
        disabled={
          this.state.cur_page === this.props.num_pages ||
          this.props.num_pages === 0
        }
      />
    );
    return (
      <div
        id="page-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
          marginBottom: "1rem",
        }}
      >
        <Pagination>{items}</Pagination>
      </div>
    );
  }
}
