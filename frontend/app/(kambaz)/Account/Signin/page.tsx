// app/(kambaz)/Account/Signin/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as client from "../client";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  FormControl,
  Button,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter(); 
  const signin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const user = await client.signin(credentials);

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    dispatch(setCurrentUser(user));
    router.push("/Dashboard"); 
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h1 className="mb-4">Signin</h1>
          <Form onSubmit={signin}>
            {" "}
            <Form.Group className="mb-3" controlId="wd-username">
              <FormControl
                value={credentials.username || ""} 
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                placeholder="username"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="wd-password">
              <FormControl
                value={credentials.password || ""} 
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="password"
                type="password"
              /> 
            </Form.Group>
            <Button
              id="wd-signin-btn"
              variant="primary"
              type="submit"
              className="w-100"
            >
              Signin
            </Button>
          </Form>
          <Link
            id="wd-signup-link"
            href="/Account/Signup"
            className="d-block mt-3"
          >
            Signup
          </Link>
        </Col>
      </Row>
    </Container>
  );
}