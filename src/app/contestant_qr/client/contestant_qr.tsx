"use client";

import Navbar from "@/app/client/navbar";
import Loading from "@/app/loading";
import GenerateQR from "@/app/verify/client/generate-qr";
import VerifyInfo from "@/app/voting/client/verify-info";
import { useAppSelector } from "@/lib/hooks";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
const ContestantQR = () => {
  const user = useAppSelector((state) => state.user.user);
  const contestants = useAppSelector((state) => state.event.contestants);
  if (!contestants) return <Loading />;
  if (!user) return <VerifyInfo />;
  const contestant = contestants.find((c) => c.id == user.id);
  if (contestant)
    return (
      <main>
        <Navbar white />
        <div className="flex items-center flex-col justify-center gap-4 h-[100vh] ">
          <Typography variant="h5" placeholder="">
            {contestant.gender == "male" ? "Mr." : "Ms."} {contestant.full_name}
          </Typography>
          <div className="relative">
            <GenerateQR
              secret={`https://easy-ucspyay.vercel.app/voting?cno=${contestant.contestant_no}&g=${contestant.gender}`}
            />
            <Image
              width={100}
              height={100}
              src={contestant.image_url}
              alt={contestant.full_name}
              className="h-[70px] w-[70px] object-cover rounded-sm absolute top-[calc(50%-35px)] left-[calc(50%-35px)] ring-4 ring-white"
            />
          </div>
        </div>
      </main>
    );
  else return "Not Contestant";
};

export default ContestantQR;
