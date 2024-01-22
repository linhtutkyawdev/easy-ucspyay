"use client";
import React from "react";
import { Spinner } from "@material-tailwind/react";

const loading = () => {
  return (
    <div className="w-full h-[90vh] flex items-center">
      <Spinner className="h-16 w-16 text-gray-900/50 mx-auto my-auto" />
    </div>
  );
};

export default loading;
