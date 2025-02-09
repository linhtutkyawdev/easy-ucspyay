"use client";
import { useAppSelector } from "@/lib/hooks";
import { Button, Typography } from "@material-tailwind/react";
import {
  createEvent,
  addResult,
  getUnrevealedTitles,
  addContestantSecret,
} from "../server";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Navbar from "@/app/client/navbar";
import GenerateQR from "@/app/verify/client/generate-qr";
import Loading from "@/app/loading";
import DialogSelect from "@/app/client/dialogSelect";

const Admin = () => {
  const events = useAppSelector((state) => state.event.events);
  const user = useAppSelector((state) => state.user.user);
  const contestants = useAppSelector((state) => state.event.contestants);
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const [titles, setTitles] = useState<string[] | null>(null);
  const [revealTitle, setRevealTitle] = useState("");
  const [secret, setSecret] = useState("");

  let { data: secrets, isLoading } = useSWR<
    {
      key: string;
    }[]
  >(user?.is_admin ? "/api/contestant_secrets" : null, fetcher);

  const { data: results, isLoading: isResultLoading } = useSWR<
    | {
      title: string;
      winner: string;
    }[]
    | null
  >(
    user?.id && events
      ? `/api/events/${events[0].event_name}/votes/results`
      : null,
    fetcher
  );

  useEffect(() => {
    (async () => {
      if (!isLoading && events && events[0] && secrets && secrets.filter((s) => s.key.startsWith(events[0].event_name)).length > 0) {
        setSecret(secrets[0].key);
      } else if (!isLoading && !secrets && events && events[0] && !secret) {
        setSecret(await addContestantSecret(events[0].event_name));
      }
    })();
  }, [secrets, isLoading, events]);

  useEffect(() => {
    (async () => {
      if (revealTitle && events && events[0] && contestants && results)
        (await addResult(
          events[0].event_name,
          revealTitle,
          results.find((r) => r.title == revealTitle)?.winner || ""
        )) && alert(revealTitle + " : Revealed");
      setRevealTitle("");
    })();
  }, [revealTitle, events, contestants, results]);

  if (
    !events ||
    events.length == 0 ||
    !user ||
    !secrets ||
    isResultLoading ||
    !contestants
  )
    return <Loading />;
  if (!user) return "not authorized";
  if (!user.is_admin) return "Not Admin";
  // if (!results || results.length == 0) return "No Result Found!";

  const handleCreateEvent = async () => {
    let event_name: string | null = null;
    while (event_name == null) {
      event_name = prompt("Enter your event name.")?.toLowerCase() || null;
      if (event_name == "default") {
        let event_day: string | null = null;
        while (event_day == null) {
          event_day = prompt("Enter your event date. (Month-Day-Year)");
          if (event_day == "exit") return;
          if (!event_day) {
            alert("Invalid event_day!!!");
            event_day = null;
          }
        }
        event_name = new Date(event_day).getFullYear() + "_welcome";
        const titles = [
          { name: "king", type: "male" },
          { name: "smart", type: "male" },
          { name: "handsome", type: "male" },
          { name: "queen", type: "female" },
          { name: "glory", type: "female" },
          { name: "smile", type: "female" },
          { name: "attraction", type: "female" },
          { name: "best_couple", type: "couple" },
        ];
        if (
          !confirm(
            "You are about to create an event on " +
            event_day +
            " with name: " +
            event_name +
            ".\nWith the following titles.\n" +
            titles.map((t) => t.name + ":" + t.type).join("\n")
          )
        )
          return;
        return createEvent(event_name, new Date(event_day), titles);
      }
      if (event_name == "exit") return;
      if (!event_name) {
        alert("Invalid event_name!!!");
        event_name = null;
      }
    }
    let event_day: string | null = null;
    while (event_day == null) {
      event_day = prompt("Enter your event date. (Month-Day-Year)");
      if (event_day == "exit") return;
      if (!event_day) {
        alert("Invalid event_day!!!");
        event_day = null;
      }
    }
    let titles = new Array<{ name: string; type: string }>();
    while (
      confirm("Do you want to add a title for the " + event_name + "?") ||
      titles.length == 0
    ) {
      let title_name: string | null = null;
      while (title_name == null) {
        title_name =
          prompt("How should we call the title.")?.toLowerCase() || null;
        if (title_name == "exit") return;
        if (!title_name) {
          alert("Invalid title_name!!!");
          title_name = null;
        }
      }
      const title_types = ["male", "female", "couple", "all"];
      let title_type: string | null = null;
      while (title_type == null) {
        title_type =
          prompt(
            "What is the type of the title: " +
            title_name +
            ".\n" +
            title_types.join(" || ")
          )?.toLowerCase() || null;
        if (title_type == "exit") return;
        if (!title_type || !title_types.includes(title_type)) {
          alert("Invalid title_type!!!");
          title_type = null;
        }
      }
      titles.push({
        name: title_name,
        type: title_type,
      });
    }
    if (
      !confirm(
        "You are about to create an event on " +
        event_day +
        " with name: " +
        event_name +
        ".\nWith the following titles.\n" +
        titles.map((t) => t.name + ":" + t.type).join("\n")
      )
    )
      return;
    await createEvent(event_name, new Date(event_day), titles);
  };

  return (
    <main className="bg-blue-gray-50">
      <Navbar white />
      <div className="flex items-center flex-col justify-center gap-4 h-[100vh] ">
        <Typography placeholder="" variant="h5">
          Scan Contestant QR
        </Typography>
        {secret && <GenerateQR secret={secret} />}
        <div className="flex space-x-4">
          <Button
            variant="gradient"
            onClick={handleCreateEvent}
            placeholder="createEvent"
            className="w-40"
          >
            Create an event!
          </Button>
          <Button
            variant="gradient"
            onClick={async () => {
              if (!events) return alert("No Event Detected!");
              setTitles(await getUnrevealedTitles(events[0]?.event_name));
            }}
            placeholder="createEvent"
            className="w-40"
          >
            Reveal a result!
          </Button>
        </div>
      </div>
      {titles && (
        <DialogSelect
          open={titles ? true : false}
          close={() => {
            setTitles(null);
          }}
          label="Choose the title to reveal!"
          options={titles}
          setValue={(v: string) => {
            setRevealTitle(v);
            setTitles(null);
          }}
          sm
        />
      )}
    </main>
  );
};

export default Admin;
