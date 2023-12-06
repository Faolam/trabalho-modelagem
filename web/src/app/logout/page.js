"use client"

import { AuthContext } from "@/contexts/auth";
import { server } from "@/server";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const { token, setUser, setToken } = useContext(AuthContext);
  useEffect(() => {
    if (token) {
      server.post('/user/logout', {}, { headers: { authorization: token } })
        .finally(() => {
          setToken(null);
          setUser(null);
        });
    }
    else {
      router.push('/login');
    }
  });
  return (<></>);
}