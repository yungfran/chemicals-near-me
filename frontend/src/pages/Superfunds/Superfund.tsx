import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { Container, Card, Row, Col, Table } from "react-bootstrap";
import SuperfundJSON from "./SuperfundJSON";
import CityJSON from "../Cities/CityJSON";

interface IProps {
  match: {
    params: {
      id: number;
    };
  };
}

interface IState {
  id: number;
  superfund: SuperfundJSON | null;
  city_img_url: string;
}

class Superfund extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      superfund: null,
      city_img_url: null,
    };
  }

  componentDidMount() {
    this.getSuperfund();
  }

  render() {
    if (this.state.superfund == null) return <div />;

    return (
      <div style={{ backgroundColor: "#f2f3f5" }}>
        <Container style={{ backgroundColor: "white" }}>
          <Row>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <Card style={{ width: "40rem" }}>
                <Card.Header>
                  <Card.Title>{this.state.superfund.name}</Card.Title>
                </Card.Header>
                <Card.Img variant="top" src={this.state.superfund.image_url} />
                <Card.Img
                  src={this.state.city_img_url}
                  style={{ marginTop: "5px" }}
                />
              </Card>
            </Col>
          </Row>

          <Row
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <iframe
              title="map"
              width="70%"
              height="600px"
              frameBorder="0"
              style={{ border: "0" }}
              src={
                "https://www.google.com/maps/embed/v1/place?key=AIzaSyDD2Ci1KLR9BRr8_15X4sZ4WS5Yy6z5Ibo&q=" +
                this.state.superfund.latitude +
                "," +
                this.state.superfund.longitude
              }
            ></iframe>
          </Row>
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <Table className="w-50" striped bordered hover>
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Site Name</td>
                  <td>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://enviro.epa.gov/enviro/SEMSquery.get_report?pgm_sys_id=${this.state.superfund.epa_id}`}
                    >
                      {this.state.superfund.name}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Site ID</td>
                  <td>{this.state.superfund.site_id}</td>
                </tr>
                <tr>
                  <td>EPA ID</td>
                  <td>{this.state.superfund.epa_id}</td>
                </tr>
                <tr>
                  <td>NPL Status</td>
                  <td>{this.state.superfund.npl_status}</td>
                </tr>
                <tr>
                  <td>Number of TSCA Chemicals</td>
                  <td>{this.state.superfund.num_chem}</td>
                </tr>
                <tr>
                  <td>City</td>
                  <td>
                    <Link to={`/cities/${this.state.superfund.city_id}`}>
                      {this.state.superfund.city_name}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>State</td>
                  <td>{this.state.superfund.state}</td>
                </tr>
                <tr>
                  <td>County</td>
                  <td>{this.state.superfund.county}</td>
                </tr>
                <tr>
                  <td>Zip Code</td>
                  <td>{this.state.superfund.zipcode}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <Row>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <Table className="w-25" striped bordered hover>
                <thead>
                  <tr>
                    <th>Contaminant(s)</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.superfund.contaminants.map((contaminant) => {
                    return (
                      <tr>
                        <td>
                          <Link to={`/contaminants/${contaminant.id}`}>
                            {contaminant.name}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  async getSuperfund() {
    const superfund = await axios.get<SuperfundJSON>(
      `https://api.chemicalsnear.me/superfunds/${this.state.id}`
    );
    const city_info = await axios.get<CityJSON>(
      `https://api.chemicalsnear.me/cities/${superfund.data.city_id}`
    );

    this.setState({
      superfund: superfund.data,
      city_img_url: city_info.data.image_url,
    });
  }
}

export default Superfund;
