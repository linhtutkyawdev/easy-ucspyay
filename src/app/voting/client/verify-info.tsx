"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { BellAlertIcon } from "@heroicons/react/24/solid";

const VerifyInfo = () => {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(!open);
  return (
    <>
      <Dialog
        placeholder={""}
        open={open}
        handler={handleOpen}
        size="xxl"
        className="container"
      >
        <DialogHeader placeholder={""} className="flex justify-center">
          <Typography placeholder={""} variant="h4" className="text-[#FF0000]">
            Your attention is required!
          </Typography>
        </DialogHeader>
        <DialogBody placeholder={""}>
          <BellAlertIcon
            width={"5rem"}
            className="mx-auto text-[#FF0000] mb-4 "
          />
          <div className="max-w-xl mx-auto text-justify">
            Your acount is not verified yet. In order to go to be verified, you
            need to either:
            <br />
            1. <b>Scan the QR</b> from your friend&apos;s accoount who has UCSP
            Edu mail. (OR)
            <br />
            2. If you have an edu mail at UCSPyay, You can verify your account
            by adding your mail.
          </div>
        </DialogBody>
        <DialogFooter placeholder={""} className="flex flex-row justify-center">
          <a href="/scan_qr">
            <Button
              placeholder={""}
              variant="gradient"
              color="black"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Scan QR</span>
            </Button>
          </a>
          <a href="user-profile/email-address">
            <Button
              placeholder={""}
              variant="gradient"
              color="black"
              onClick={handleOpen}
            >
              <span>Add UCSP EDU mail</span>
            </Button>
          </a>
        </DialogFooter>
      </Dialog>
      {/* <a href="/verify">click here to verify</a>
      <br />
      or
      <br />
      <a href="user-profile/email-address">click here to add your edu mail</a> */}
    </>
  );
};

export default VerifyInfo;
