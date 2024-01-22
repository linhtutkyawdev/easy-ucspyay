"use client";
import DialogSelect from "@/app/client/dialogSelect";
import { getApplicableTitles, vote } from "@/app/server";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

const Couple_card = ({
  male,
  female,
}: {
  male: {
    contestant_no: number;
    id: string;
    full_name: string;
    image_url: string;
    gender: string;
    nick_name: string;
    height: number;
  };
  female: {
    contestant_no: number;
    id: string;
    full_name: string;
    image_url: string;
    gender: string;
    nick_name: string;
    height: number;
  };
}) => {
  const events = useAppSelector((state) => state.event.events);
  const user = useAppSelector((state) => state.user.user);
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      if (events && events[0] && title && user && male && confirm)
        (await vote(events[0].event_name, title, user.id, male.id)) &&
          alert("Voted");
    })();
  }, [events, title, user, male, confirm]);
  const handleVote = async () => {
    if (!events) return;
    if (!user) return alert("unauthorized");
    const applicableTitles = await getApplicableTitles(
      events[0].event_name,
      "couple",
      user.id
    );
    if (!applicableTitles || !(applicableTitles.length > 0))
      return alert("No votes left!");
    setTitle(applicableTitles[0]);
    setOpen(true);
  };
  return (
    <div className="container2 flex-col">
      {title && (
        <DialogSelect
          open={open}
          close={() => setOpen(false)}
          label={"Confirm to vote for " + title + "."}
          options={["yes", "no"]}
          setValue={(v) => {
            setConfirm(v == "yes" || false);
            setOpen(false);
          }}
        />
      )}
      <div className="text-lg font-black mt-4 font-sans">
        Couple - {male.contestant_no}
      </div>
      <div className="flex flex-col lg:flex-row -lg:my-6 lg:-mb-14">
        <div className="box">
          <div className="imgBox">
            <img src={male.image_url} alt="" />
          </div>
          <div className="content">
            <h2>
              <span>{male.full_name}</span>
            </h2>
          </div>
        </div>
        <div className="box reverse !mt-20 xs:!mt-12">
          <div className="imgBox">
            <img src={female.image_url} alt="" />
          </div>
          <div className="content">
            <h2>
              <span>{female.full_name}</span>
            </h2>
          </div>
        </div>
      </div>
      <div>
        <Button
          onClick={handleVote}
          placeholder={""}
          variant="gradient"
          size="md"
          className="rounded-none hover:px-14"
        >
          Vote -&gt;
        </Button>
      </div>
    </div>
  );
};

export default Couple_card;
