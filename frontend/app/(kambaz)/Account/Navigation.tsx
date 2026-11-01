// app/(kambaz)/Account/Navigation.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const pathname = usePathname();

  return (
    <Nav variant="pills" className="flex-column">
      
      {links.map((link) => {
        const isActive = pathname.endsWith(link.toLowerCase());
        return (
          <NavItem key={link}>
            <NavLink
              as={Link}
              href={link}
              active={isActive}
              className={`d-flex align-items-center fw-${isActive ? "bold" : "medium"} 
                text-${isActive ? "dark" : "danger"} ps-2`}
            >
              {isActive && (
                <span
                  className="me-2 bg-dark"
                  style={{
                    width: "2px",
                    height: "1.2em",
                    display: "inline-block",
                  }}
                />
              )}
              {link}
            </NavLink>
            
          </NavItem>
        );
      })}

{currentUser && currentUser.role === "ADMIN" && (
       <NavLink as={Link} href={`/Account/Users`}  active={pathname.endsWith('Users')}> Users </NavLink> )}

    </Nav>
  );
}
