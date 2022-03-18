import React from "react";
import Header from "./Header";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export default function Previleges() {
  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form>
          <Form.Group>
            <Form.Label>Roomname</Form.Label>
            <Form.Control type="text" placeholder="Enter Roomname" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter Room description" />
          </Form.Group>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <Button variant="primary">Create Room</Button>
          </div>
        </Form>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <h2>Your rooms</h2>
      </div>
    </div>
  );
}
