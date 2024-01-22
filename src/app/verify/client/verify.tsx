"use client";

import { useAppSelector } from "@/lib/hooks";

import GenerateQR from "./generate-qr";

import useSWR from "swr";
import { useEffect } from "react";
import { setUserSecret } from "../server";
import { Typography } from "@material-tailwind/react";
import Navbar from "@/app/client/navbar";

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
        await setUserSecret(user.id);
      }
    })();
  }, [secret, isLoading, user]);

  if (!user) return "No User";

  return (
    <main>
      <Navbar white />
      <div className="flex items-center flex-col justify-center gap-4 h-[100vh] ">
        <Typography variant="h5" placeholder="">
          Scan The QR
        </Typography>
        {secret?.key && <GenerateQR secret={secret.key} />}
      </div>
    </main>
  );
};

export default Verify;
