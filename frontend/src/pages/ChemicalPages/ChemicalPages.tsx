import React from "react";
import { Card, CardGroup, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';


function ContaminantPages() {
  return (
    <div>
      <Container>
        <h1>Chemicals</h1>
        <p style={{ fontSize: "medium" }}><b>Count: 3</b></p>
        <CardGroup>
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src="/images/Dichloroethane.png" />
            <Card.Body>
              <Card.Title>1,2-Dichloroethane</Card.Title>
              <p>GHS Classification: Corrosive, Irritant, Health Hazard</p>
              <p>Molecular Weight: 228.29</p>
              <p>Boiling Point: 428 °F at 4 mm Hg</p>
              <p>Melting Point: 307 to 313 °F</p>
              <Link to="/chemicals/1,2-Dichloroethane">
                <Button variant="primary">See more</Button>
              </Link>
            </Card.Body>
          </Card>

          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src="/images/Butadiene.png" />
            <Card.Body>
              <Card.Title>1,3-Butadiene</Card.Title>
              <p>GHS Classification: Flammable, Health Hazard</p>
              <p>Molecular Weight: 54.09</p>
              <p>Boiling Point: 24.1 °F at 760 mm Hg</p>
              <p>Melting Point: -164 °F</p>
              <Link to="/chemicals/1,3-Butadiene">
                <Button variant="primary">See more</Button>
              </Link>
            </Card.Body>
          </Card>

          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src="./images/Dimethylphenol.png" />
            <Card.Body>
              <Card.Title>2,4-Dimethylphenol</Card.Title>
              <p>GHS Classification: Corrosive, Acute Toxic, Irritant, Environmental Hazard</p>
              <p>Molecular Weight: 98.96</p>
              <p>Boiling Point: 182.3 °F at 760 mm Hg</p>
              <p>Melting Point: -31.5 °F</p>
              <Link to="/chemicals/2,4-Dimethylphenol">
                <Button variant="primary">See more</Button>
              </Link>
            </Card.Body>
          </Card>
        </CardGroup>
      </Container>
    </div>
  );
}

export default ContaminantPages;
//https://enviro.epa.gov/triexplorer/release_chem?p_view=USCH&trilib=TRIQ1&sort=_VIEW_&sort_fmt=1&state=All+states&county=All+counties&chemical=All+chemicals&industry=ALL&year=2019&tab_rpt=1&fld=RELLBY&fld=TSFDSP
