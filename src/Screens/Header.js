import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="myrooms">Allowed</Nav.Link>
            <Nav.Link href="ownedrooms">Owned</Nav.Link>
            <Nav.Link href="revokepermission">Revoke permissions</Nav.Link>
            <Nav.Link href="transferownership">Transfer Ownership</Nav.Link>
            <Nav.Link href="grantpermission">Grant Permissions</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Navbar.Brand href="/">Dashboard</Navbar.Brand>
    </Navbar>
  );
}
