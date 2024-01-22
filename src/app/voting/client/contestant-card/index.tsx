"use client";
import { getApplicableTitles, vote } from "@/app/server";
import { useAppSelector } from "@/lib/hooks";

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

  const handleVote = async () => {
    if (!events) return;
    if (!user) return alert("unauthorized");
    const applicableTitles = (
      await getApplicableTitles(
        events[0].event_name,
        allowed_contestant_group,
        user.id
      )
    )?.sort();
    if (!applicableTitles || !(applicableTitles.length > 0))
      return alert("No title is applicable!");
    let title: string | null = null;
    while (title == null) {
      title =
        prompt(
          "Enter your event name." + ".\n" + applicableTitles.join(" || ")
        )?.toLowerCase() || null;
      if (title == "exit") return;
      if (!title || !applicableTitles.includes(title)) {
        alert("Invalid title!!!");
        title = null;
      }
    }
    (await vote(events[0].event_name, title, user.id, id)) && alert("Voted");
  };

  return (
    <div className="body">
      <link rel="stylesheet" href="https://use.typekit.net/mbt4tna.css" />
      <link rel="stylesheet" href="https://use.typekit.net/kid2tin.css" />

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
