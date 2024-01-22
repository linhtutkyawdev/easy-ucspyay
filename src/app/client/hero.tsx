"use client";

import { IconButton, Button, Typography } from "@material-tailwind/react";
import { QrCodeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-[url('/event.jpeg')] bg-cover bg-no-repeat">
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
      <div className="grid min-h-screen px-8">
        <div className="sm:container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <Typography
            placeholder={""}
            variant="h3"
            color="white"
            className="mb-2 xs:text-2xl 2xs:text-xl"
          >
            King/Queen Selection Voting Website
          </Typography>
          <Typography
            placeholder={""}
            variant="h1"
            color="white"
            className="lg:max-w-3xl xs:text-5xl 2xs:text-4xl"
          >
            University of Computer Studies <br />( PYAY )
          </Typography>
          <Typography
            placeholder={""}
            variant="lead"
            color="white"
            className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl xs:text-md 2xs:text-base"
          >
            Scan the selection users&apos; QR to vote him/her.
          </Typography>
          <div className="flex items-center gap-4">
            <Link href="/voting">
              <Button
                placeholder={""}
                variant="gradient"
                color="white"
                className="3xs:p-2"
              >
                Go to voting page
              </Button>
            </Link>
            <span className="text-white text-3xl">||</span>
            <Link href={"scan_qr"}>
              <IconButton
                placeholder={""}
                className="rounded-full bg-white p-6"
              >
                <QrCodeIcon className="h-4 w-4 text-gray-900" />
              </IconButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
