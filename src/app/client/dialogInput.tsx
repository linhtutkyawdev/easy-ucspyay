import { Button, Dialog, DialogBody, Input } from "@material-tailwind/react";
import React from "react";

const DialogInput = ({
  open,
  toggleOpen,
  label,
  setValue,
}: {
  open: boolean;
  toggleOpen: () => void;
  label: string;
  setValue: (v: string) => void;
}) => {
  return (
    <Dialog
      placeholder=""
      open={open}
      className="bg-white text-white rounded-none p-8"
      handler={toggleOpen}
    >
      <DialogBody placeholder="">
        <Input
          id={"id-" + label}
          crossOrigin=""
          variant="static"
          label={label}
          size="lg"
          className="text-xl"
          onBlur={(e) => {
            setValue(e.target.value);
          }}
        />
        <br />
        IMPORTANT: Closing the model will confirm te value.
      </DialogBody>
    </Dialog>
  );
};

export default DialogInput;
