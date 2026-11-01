// app/(kambaz)/Account/page.tsx
"use client";
import { useSelector } from "react-redux";
import { redirect } from "next/dist/client/components/navigation";


export default function AccountPage() {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const { currentUser } = useSelector((state: any) => state.accountReducer);
 if (!currentUser) {
   redirect("/Account/Signin");
 } else {
   redirect("/Account/Profile");
 }
}
