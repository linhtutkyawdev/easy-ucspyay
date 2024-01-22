"use client";
import { Badge, Button } from "@material-tailwind/react";
import React from "react";

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
  return (
    // <div className="couple-card-body">
    <div className="container2 flex-col">
      <div className="text-lg font-black mt-4 font-sans">Couple - {3}</div>
      <div className="flex flex-col lg:flex-row mb-2">
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
        <div className="box reverse">
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
        <Button placeholder={""} variant="gradient" color="teal" size="md">
          Vote -&gt;
        </Button>
      </div>
    </div>
    // </div>
  );
};

export default Couple_card;
