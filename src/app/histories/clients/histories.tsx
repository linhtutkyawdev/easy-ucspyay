"use client";
import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import Navbar from "@/app/client/navbar";

const TABLE_HEAD = ["No.", "Title", "Contestant", ""];

const TABLE_ROWS = [
  {
    no: "1",
    title: "King",
    contestant: "San Min Aung",
  },
  {
    no: "2",
    title: "Handsome",
    contestant: "San Min Aung",
  },
  {
    no: "3",
    title: "Smart",
    contestant: "San Min Aung",
  },
  {
    no: "4",
    title: "Queen",
    contestant: "San Min Aung",
  },
  {
    no: "5",
    title: "Glory",
    contestant: "San Min Aung",
  },
];

const Histories = () => {
  return (
    <div>
      <Navbar white relative />
      <Typography placeholder="" variant="h5" className="text-center m-4">
        Votes Histories
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
            {TABLE_ROWS.map(({ no, title, contestant }, index) => (
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
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
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
