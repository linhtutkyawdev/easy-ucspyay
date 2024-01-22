"use client";
import { useRouter } from "next/navigation";

const RedirectBack = () => {
  const router = useRouter();
  router.back();
  return <>redirecting</>;
};

export default RedirectBack;
