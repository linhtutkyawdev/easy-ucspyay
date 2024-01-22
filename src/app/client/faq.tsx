"use client";

import React from "react";
import {
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const FAQS = [
  {
    title: "1. How to vote?",
    desc: (
      <>
        There are two methods to vote the contestants in our system. First way
        is to go to the{" "}
        <a href="voting" className="text-indigo-400 font-bold">
          voting page
        </a>{" "}
        and select a person (male or female) choose the title for him and click
        &quot;Vote&quot;. The second way is to{" "}
        <a href="scanQR" className="text-indigo-400 font-bold">
          scan the QR
        </a>{" "}
        code of the person you want to vote and select the title for him.
      </>
    ),
  },
  {
    title: "2. How can i know that how many votes are left for me?",
    desc: (
      <>
        You can check your{" "}
        <a href="histories" className="text-indigo-400 font-bold">
          &quot;votes&quot; & &quot;vote histories&quot;
        </a>{" "}
        in your profile. If you accidently vote wrong person, you can always
        clear your history and revote your chosen one.
      </>
    ),
  },
  {
    title: "3. How to register for voting?",
    desc: (
      <>
        Normally, you&apos;ll need to have an edu mail at UCSPyay
        (eg:someone@ucspyay.edu.mm) to automagically register as a verified
        account to vote. But even if you don&apos;t possess an edu mail, you can
        still ask for verification from anyone with an edu mail account by{" "}
        <a href="" className="text-indigo-400 font-bold">
          scanning the QR
        </a>{" "}
        from his/her account.
      </>
    ),
  },
];

export function Faq() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="sm:container mx-auto">
        <div className="text-center">
          <Typography
            placeholder={""}
            variant="h1"
            color="blue-gray"
            className="mb-4"
          >
            How To?
          </Typography>
          <Typography
            placeholder={""}
            variant="lead"
            className="mx-auto mb-24 lg:w-3/5 !text-gray-500"
          >
            If you find troubles using our systems, you can always check this
            session. We collected some questions you might ask and give answers
            to those.
          </Typography>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <Accordion
              placeholder={""}
              key={key}
              open={open === key + 1}
              onClick={() => handleOpen(key + 1)}
            >
              <AccordionHeader
                placeholder={""}
                className="text-left text-gray-900 text-lg"
              >
                {title}
              </AccordionHeader>
              <AccordionBody>
                <Typography
                  placeholder={""}
                  color="blue-gray"
                  className="font-normal text-gray-500"
                >
                  {desc}
                </Typography>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
