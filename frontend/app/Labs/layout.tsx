"use client"
import { ReactNode } from "react";
import TOC from "./TOC";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function LabsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="container mt-4">

      <div className="mb-4"><TOC /></div>
      

      <div>
        {children}
      </div>
    </div>
  );
}
