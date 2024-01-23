"use client";
import DialogSelect from "@/app/client/dialogSelect";
import { getApplicableTitles, vote } from "@/app/server";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";

const ContestantCard = ({
  contestant_no,
  id,
  full_name,
  image_url,
  allowed_contestant_group,
  height,
  nick_name,
}: {
  contestant_no: number;
  id: string;
  full_name: string;
  image_url: string;
  allowed_contestant_group: string;
  height: number;
  nick_name: string;
}) => {
  const events = useAppSelector((state) => state.event.events);
  const user = useAppSelector((state) => state.user.user);
  const [titles, setApplicableTitles] = useState<string[] | null>(null);
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (events && events[0] && title && user && id)
        (await vote(events[0].event_name, title, user.id, id)) &&
          alert("Voted");
    })();
  }, [events, title, user, id]);

  const handleVote = async () => {
    if (!events) return;
    const event_time = new Date(events[0]?.event_day).getTime();
    const present = new Date().getTime();
    if (event_time > present) {
      var diff = new Date(event_time - present);
      return alert(
        "Time left for the event : " +
          events[0]?.event_name +
          ".\n" +
          diff.getHours() +
          " : " +
          diff.getMinutes() +
          " : " +
          diff.getSeconds()
      );
    }
    if (!user) return alert("unauthorized");
    const applicableTitles = (
      await getApplicableTitles(
        events[0].event_name,
        allowed_contestant_group,
        user.id
      )
    )?.sort();
    if (!applicableTitles || !(applicableTitles.length > 0))
      return alert("No votes left!");
    setApplicableTitles(applicableTitles);
    setOpen(true);
  };

  return (
    <div className="body">
      <link rel="stylesheet" href="https://use.typekit.net/mbt4tna.css" />
      <link rel="stylesheet" href="https://use.typekit.net/kid2tin.css" />

      {titles && (
        <DialogSelect
          open={open}
          close={() => setOpen(false)}
          label="Select title to vote."
          options={titles}
          setValue={(v) => {
            setTitle(v);
            setApplicableTitles(null);
            setOpen(false);
          }}
        />
      )}

      <div className="minip">
        <div className="mg">
          <div className="clr"></div>
          <div className="group">
            <span className="text-nowrap">{nick_name}</span>
          </div>
        </div>
        <div
          className="av"
          style={{
            backgroundImage: `url('${image_url}')`,
          }}
        ></div>
        <div className="info">
          <div>{full_name}</div>
          <div>
            Height › {height}
            <br />
            No. {contestant_no}
          </div>
        </div>
        <a
          onClick={handleVote}
          className="plot cursor-pointer"
          title={"Vote Contestant No. " + contestant_no}
        >
          vote →
        </a>
      </div>
    </div>
  );
};

export default ContestantCard;
