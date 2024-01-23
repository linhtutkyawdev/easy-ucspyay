import {
  Button,
  ButtonGroup,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import React from "react";

const DialogSelect = ({
  open,
  close,
  label,
  options,
  setValue,
  sm,
}: {
  open: boolean;
  close: () => void;
  label: string;
  options: string[];
  setValue: (v: string) => void;
  sm?: boolean;
}) => {
  return (
    <Dialog
      placeholder=""
      open={open}
      className="bg-transparent text-xl text-white m-2"
      handler={close}
    >
      {label}
      <DialogBody placeholder="" className="p-0 pt-4 bg-transparent">
        <ButtonGroup placeholder="" className="grid grid-cols-1">
          {options.map((o) => (
            <Button
              key={label + o}
              variant="text"
              placeholder=""
              className={`bg-white uppercase hover:scale-110 hover:text-indigo-600 border-none border-t-2 border-b-2 rounded-none text-center ${
                sm ? "text-4xl" : "text-6xl"
              } text-blue-gray-900"`}
              onClick={() => setTimeout(() => setValue(o), 500)}
            >
              {o}
            </Button>
          ))}
        </ButtonGroup>
      </DialogBody>
    </Dialog>
  );
};

export default DialogSelect;
