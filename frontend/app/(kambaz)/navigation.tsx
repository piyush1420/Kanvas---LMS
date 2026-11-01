/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function KambazNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Get current user from Redux store to check if logged in
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  // Add requireAuth flag to protect certain routes
  const links = [
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard, requireAuth: true },
    { label: "Courses",   path: "/Dashboard", icon: LiaBookSolid, requireAuth: true },
    { label: "Calendar",  path: "/Calendar",  icon: IoCalendarOutline, requireAuth: true },
    { label: "Inbox",     path: "/Inbox",     icon: FaInbox, requireAuth: true },
    { label: "Labs",      path: "/Labs",      icon: LiaCogSolid, requireAuth: false },
  ];

  // Handle click on protected links
  const handleProtectedNavigation = (e: React.MouseEvent, link: any) => {
    if (link.requireAuth && !currentUser) {
      e.preventDefault();
      router.push("/Account"); // Redirect to login page
    }
  };

  return (
    <ListGroup id="wd-kambaz-navigation" style={{width: 120}}
         className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
      <ListGroupItem id="wd-neu-link" target="_blank" href="https://www.northeastern.edu/"
        action className="bg-black border-0 text-center">
        <img src="/images/NEU.png" width="75px" />
      </ListGroupItem>
      
      <ListGroupItem as={Link} href="/Account"
        className={`text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
        <FaRegCircleUser
          className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
        <br />
        Account
      </ListGroupItem>
      
      {links.map((link) => (
        <ListGroupItem 
          key={`${link.path}-${link.label}`} 
          as={Link} 
          href={link.path}
          onClick={(e) => handleProtectedNavigation(e, link)}
          className={`bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}>
          {link.icon({ className: "fs-1 text-danger"})}
          <br />
          {link.label}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}