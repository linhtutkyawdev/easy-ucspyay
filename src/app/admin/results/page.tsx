"use client";
import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import Navbar from "@/app/client/navbar";
import useSWR from "swr";
import { useAppSelector } from "@/lib/hooks";
import Loading from "@/app/loading";

const TABLE_HEAD = ["Title", "Winnner", "Contestant No."];

const Histories = () => {
  const user = useAppSelector((state) => state.user.user);
  const events = useAppSelector((state) => state.event.events);
  const contestants = useAppSelector((state) => state.event.contestants);
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: results, isLoading } = useSWR<
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

  if (isLoading || !contestants || !events) return <Loading />;
  if (!user) return "not authorized";
  if (!results || results.length == 0) return "No Result Found!";

  return (
    <div>
      <Navbar white relative />
      <Typography placeholder="" variant="h5" className="text-center m-4">
        Voting Results
      </Typography>
      <Card placeholder="" className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
            {results
              .map((r) => ({
                title: r.title,
                contestant: r.title.includes("couple")
                  ? contestants
                      .filter(
                        (co) =>
                          co.contestant_no ==
                          contestants.find(
                            (c) => c.id == r.winner && c.gender == "male"
                          )?.contestant_no
                      )
                      .map((con) => con.full_name)
                      .join(" & ")
                  : contestants.find((c) => c.id == r.winner)?.full_name,
                contestant_no: contestants.find((c) => c.id == r.winner)
                  ?.contestant_no,
              }))
              .map(({ title, contestant, contestant_no }) => (
                <tr key={title} className="even:bg-blue-gray-50/50">
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
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {contestant_no}
                    </Typography>
                  </td>
                  {/* <td className="p-4">
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
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Histories;
