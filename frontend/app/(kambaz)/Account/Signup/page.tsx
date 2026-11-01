// app/(kambaz)/Account/Signup/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const dispatch = useDispatch();


  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault(); 
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    router.push("/Account/Profile");
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h1 className="mb-4">Signup</h1>
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3" controlId="wd-username">
              <FormControl
                placeholder="username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="wd-password">
              <FormControl
                placeholder="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="wd-verify-password">
              <FormControl placeholder="verify password" type="password" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="wd-role">
              <Form.Select
                value={user.role || "STUDENT"}
                onChange={(e) =>
                  setUser({ ...user, role: e.target.value })
                }
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
              </Form.Select>
            </Form.Group>

            <Button
              id="wd-signup-btn"
              variant="primary"
              type="submit"
              className="w-100"
            >
              Signup
            </Button>
          </Form>
          <Link
            id="wd-signin-link"
            href="/Account/Signin"
            className="d-block mt-3"
          >
            Signin
          </Link>
        </Col>
      </Row>
    </Container>
  );
}