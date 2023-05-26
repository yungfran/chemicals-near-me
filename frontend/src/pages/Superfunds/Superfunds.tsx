import axios from "axios";
import React from "react";
import { Row, Col, CardGroup, Container } from "react-bootstrap";
import { SuperfundsJSON } from "./SuperfundJSON";
import SuperfundInstance from "./SuperfundInstance";
import PageBar from "../../PageBar";
import "./Superfunds.css";
import SuperfundsQueryBar from "./SuperfundsQueryBar";

interface IProps {
  location: {
    search: string;
  };
}

interface IState {
  page: string;
  per_page: string;
  api_result: SuperfundsJSON | null;
  query_params: URLSearchParams | null;
}

class Superfunds extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const query_params = new URLSearchParams(props.location.search);

    this.state = {
      page: query_params.get("page") || "1",
      per_page: query_params.get("per_page") || "12",
      api_result: null,
      query_params: query_params,
    };
  }

  componentDidMount() {
    this.getSuperfunds();
  }

  render() {
    if (this.state.api_result) {
      return (
        <div>
          <h1 className="pageTitle">Superfund Sites</h1>
          <Container className="queryBar">
            <SuperfundsQueryBar
              query_params={this.state.query_params}
              num_results={this.state.api_result.num_results}
            />
          </Container>
          <Container>
            <Row>
              <CardGroup>
                {this.state.api_result.superfunds.map((superfund) => {
                  return (
                    <Col>
                      <SuperfundInstance
                        key={superfund.id}
                        instance={superfund}
                        search_terms={
                          this.state.query_params.get("q") == null
                            ? []
                            : this.state.query_params.get("q").split(" ")
                        }
                      />
                    </Col>
                  );
                })}
              </CardGroup>
            </Row>
            <PageBar
              model="superfunds"
              page={parseInt(this.state.page)}
              per_page={parseInt(this.state.per_page)}
              num_pages={this.state.api_result.num_pages}
              query_params={this.state.query_params}
            />
          </Container>
        </div>
      );
    }
    return <div />;
  }

  getSuperfunds() {
    axios
      .get<SuperfundsJSON>(
        `https://api.chemicalsnear.me/superfunds?${this.state.query_params.toString()}`
      )
      .then((res) => {
        this.setState({ api_result: res.data });
      });
  }
}

export default Superfunds;
