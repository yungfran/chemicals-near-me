import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Card, Row, Col, Table } from "react-bootstrap";
import { numberWithCommas } from "../Utility";

function City_instance() {
  const path = window.location.pathname;

  const CityEndpoint = "https://api.chemicalsnear.me/" + path;
  const [City, SetCity] = useState(null);
  const [IsLoading, SetLoading] = useState(true);

  const axiosAbsolute = axios.create({ baseURL: CityEndpoint });

  useEffect(() => {
    axiosAbsolute(CityEndpoint).then(
      (response) => {
        SetCity(response.data);
        SetLoading(false);
      },
      (error) => {
        console.error("Error has occurred: " + error);
      }
    );
  });

  if (IsLoading) return <div> Loading </div>;

  return (
    //<div> hi</div>
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
                <Card.Title>
                  {City.name}, {City.state}
                </Card.Title>
                <iframe
                  title="map"
                  width="95%"
                  height="80%"
                  frameBorder="0"
                  style={{ border: "0" }}
                  src={
                    "https://www.google.com/maps/embed/v1/place?key=AIzaSyDD2Ci1KLR9BRr8_15X4sZ4WS5Yy6z5Ibo&q=" +
                    City.latitude +
                    "," +
                    City.longitude
                  }
                ></iframe>
              </Card.Header>
              <Card.Img variant="top" src={City.image_url} />
            </Card>
          </Col>
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
            <Table className="w-50" striped bordered>
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Population</td>
                  <td>{numberWithCommas(City.population)}</td>
                </tr>
                {/* <tr>
                  <td>Elevation</td>
                  <td>16.4'</td>
                </tr>
                <tr>
                  <td>Land area</td>
                  <td>13.9 sq mi</td>
                </tr> */}
                <tr>
                  <td>Percentage of people on Disability</td>
                  <td>{City.disability}</td>
                </tr>
                <tr>
                  <td>Percentage of people without health insurance</td>
                  <td>{City.no_health_insurance}</td>
                </tr>
                <tr>
                  <td>Median Household Income</td>
                  <td>${numberWithCommas(City.median_household_income)}</td>
                </tr>
                <tr>
                  <td>Map Location</td>
                  <td>
                    {City.latitude.toFixed(3)} {City.longitude.toFixed(3)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
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
                  <th>Superfund(s)</th>
                </tr>
              </thead>
              <tbody>
                {City.superfund_sites.map((superfund: any) => (
                  <tr>
                    {" "}
                    <td>
                      {" "}
                      <Link to={"/superfunds/" + superfund.id}>
                        {" "}
                        {superfund.name}{" "}
                      </Link>{" "}
                    </td>{" "}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
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
                {City.contaminants.map((contam: any) => (
                  <tr>
                    {" "}
                    <td>
                      <Link to={"/contaminants/" + contam.id}>
                        {" "}
                        {contam.name}{" "}
                      </Link>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default City_instance;
