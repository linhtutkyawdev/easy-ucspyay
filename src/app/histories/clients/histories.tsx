"use client";
import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import Navbar from "@/app/client/navbar";
import useSWR from "swr";
import { useAppSelector } from "@/lib/hooks";
import Loading from "@/app/loading";
import { deleteVote } from "../server";
import VerifyInfo from "@/app/voting/client/verify-info";

const TABLE_HEAD = ["No.", "Title", "Contestant", ""];

const Histories = () => {
  const user = useAppSelector((state) => state.user.user);
  const events = useAppSelector((state) => state.event.events);
  const contestants = useAppSelector((state) => state.event.contestants);
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: votes, isLoading } = useSWR<
    | {
        title: string;
        receiver: string;
      }[]
    | null
  >(
    user?.id && events
      ? `/api/events/${events[0].event_name}/votes/${user.id}`
      : null,
    fetcher
  );

  if (!user) return <VerifyInfo />;
  if (isLoading || !contestants || !events) return <Loading />;
  if (!votes || votes.length == 0)
    return (
      <div>
        <Navbar white />
        <div className="w-screen h-screen bg-blue-gray-50 flex flex-row items-center">
          <div className="text-blue-gray-200 text-5xl text-center font-bold px-2 mx-auto">
            You havn&apos;t voted anyone!
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <Navbar white relative />
      <Typography placeholder="" variant="h5" className="text-center m-4">
        Voting Histories
      </Typography>
      <Card placeholder="" className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-100 p-4"
                >
                  <Typography
                    placeholder=""
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {votes
              .map((v, index) => ({
                no: index + 1,
                title: v.title,
                contestant: v.title.includes("couple")
                  ? contestants
                      .filter(
                        (co) =>
                          co.contestant_no ==
                          contestants.find(
                            (c) => c.id == v.receiver && c.gender == "male"
                          )?.contestant_no
                      )
                      .map((con) => con.full_name)
                      .join(" & ")
                  : contestants.find((c) => c.id == v.receiver)?.full_name,
              }))
              .map(({ no, title, contestant }, index) => (
                <tr key={no} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography
                      placeholder=""
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {no}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      placeholder=""
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {title}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      placeholder=""
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {contestant}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      placeholder=""
                      as="a"
                      href=""
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                      onClick={async () => {
                        await deleteVote(events[0]?.event_name, title, user.id);
                      }}
                    >
                      Delete
                    </Typography>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Histories;
