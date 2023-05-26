import axios from "axios";
import React from "react";
import { Row, Col, CardGroup, Container } from "react-bootstrap";
import { CitiesJSON } from "./CityJSON";
import CityInstance from "./CityInstance";
import PageBar from "../../PageBar";
import "./Cities.css";
import CitiesQueryBar from "./CitiesQueryBar";

interface IProps {
  location: {
    search: string;
  };
}

interface IState {
  page: string;
  per_page: string;
  api_result: CitiesJSON | null;
  query_params: URLSearchParams | null;
}

class City extends React.Component<IProps, IState> {
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
    this.getCities();
  }

  render() {
    if (this.state.api_result) {
      return (
        <div>
          <h1 className="pageTitle">Cities</h1>
          <Container className="queryBar">
            <CitiesQueryBar
              query_params={this.state.query_params}
              num_results={this.state.api_result.num_results}
            />
          </Container>
          <Container>
            <Row>
              <CardGroup>
                {this.state.api_result.cities.map((city) => {
                  return (
                    <Col>
                      <CityInstance
                        key={city.id}
                        instance={city}
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
              model="cities"
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

  getCities() {
    axios
      .get<CitiesJSON>(
        `https://api.chemicalsnear.me/cities?${this.state.query_params.toString()}`
      )
      .then((res) => {
        this.setState({ api_result: res.data });
      });
  }
}

export default City;
