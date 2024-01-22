"use client";

import { useAppSelector } from "@/lib/hooks";

import GenerateQR from "./generate-qr";

import useSWR from "swr";
import { useEffect } from "react";
import { setUserSecret } from "../server";

const Verify = () => {
  const user = useAppSelector((state) => state.user.user);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: secret, isLoading } = useSWR<{
    id: string;
    key: string;
  }>(user?.id ? `/api/secrets/${user.id}` : null, fetcher);

  useEffect(() => {
    (async () => {
      if (!isLoading && !secret && user) {
        console.log("fuck");
        await setUserSecret(user.id);
      }
    })();
  }, [secret, isLoading]);

  if (!user) return "No User";

  return <main>{secret?.key && <GenerateQR secret={secret.key} />}</main>;
};

export default Verify;
