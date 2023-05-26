import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import SearchBar from "../../pages/SearchBar";
import "./Home.css";
import SuccessStoryCarousel from "./SuccessStoryCarousel";

function Home() {
  return (
    <div className="cardContainer">
      <SearchBar query_params={new URLSearchParams()} base_url="/search?" />
      <Container fluid className="modelCard">
        <Container fluid className="modelCardAlert">
          <Container fluid className="modelCardContent">
            <h1 className="alertSubtitle">Are you in danger of</h1>
            <h1 className="alertTitle">contamination?</h1>
            <p style={{ marginTop: "1rem" }}>
              <a
                href={"https://www.epa.gov/p2"}
                style={{ textDecoration: "none" }}
              >
                Prevent pollution
              </a>{" "}
              in your community
            </p>
          </Container>
        </Container>
      </Container>
      <Container className="modelCardCarousel">
        <h1 style={{ fontWeight: "bold", paddingBottom: "1rem" }}>
          Superfund Success Stories
        </h1>
        <SuccessStoryCarousel />
      </Container>
      <Container fluid className="modelCard">
        <Link to="/superfunds" className="link">
          <Container fluid className="modelCardSuperfundSite">
            <Container fluid className="modelCardContent">
              <h1 className="modelCardTitle">Superfund Sites</h1>
              <p className="modelCardText">
                Superfund sites are locations labelled as particularly hazardous
                by the EPA. Cleanup efforts are mandated by the US government,
                but often it is difficult to repair the environmental and health
                damage caused by contaminants.
              </p>
            </Container>
          </Container>
        </Link>
      </Container>
      <Container fluid className="modelCard">
        <Link to="/chemicals" className="link">
          <Container fluid className="modelCardContaminant">
            <Container fluid className="modelCardContent">
              <h1 className="modelCardTitle">Contaminants</h1>
              <p className="modelCardText">
                TSCA chemicals are substances tracked by the EPA, including
                hings like lead and biphenyl. Many of these are dangerous when
                released into the environment and pose both environmental and
                health risks.
              </p>
            </Container>
          </Container>
        </Link>
      </Container>
      <Container fluid className="modelCard">
        <Link to="/cities" className="link">
          <Container fluid className="modelCardCity">
            <Container fluid className="modelCardContent">
              <h1 className="modelCardTitle">Cities</h1>
              <p className="modelCardText">
                Cities and towns can be particularly vulnerable to contaminants
                released by Superfund sites, as the high population density
                leads to a greater risk of collateral damage from toxic sites.
              </p>
            </Container>
          </Container>
        </Link>
      </Container>
    </div>
  );
}

export default Home;
