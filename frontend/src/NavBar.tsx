import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

function NavBar() {
  return (
    <div id="navbar">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img src="./cnme_logo.svg" width="30" height="30" alt="" />
          </Navbar.Brand>
          <Navbar.Brand href="/">Chemicals Near Me</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/superfunds">Superfund Sites</Nav.Link>
              <Nav.Link href="/contaminants">Contaminants</Nav.Link>
              <Nav.Link href="/cities">Cities</Nav.Link>
              <Nav.Link href="/our-visualizations">Our Visualizations</Nav.Link>
              <Nav.Link href="/provider-visualizations">Provider Visualizations</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
