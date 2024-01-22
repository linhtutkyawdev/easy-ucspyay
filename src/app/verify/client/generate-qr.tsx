"use client";
import { Button } from "@material-tailwind/react";
import { useQRCode } from "next-qrcode";

function GenerateQR({
  secret,
  onRefresh,
  onDelete,
}: {
  secret: string;
  onRefresh?: () => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const { SVG } = useQRCode();

  return (
    <>
      {secret && (
        <SVG
          text={secret}
          options={{
            margin: 2,
            width: 600,
            // color: {
            //   dark: "#010599FF",
            //   light: "#FFBF60FF",
            // },
          }}
        />
      )}
      {onRefresh && (
        <Button placeholder="" onClick={onRefresh}>
          Refresh
        </Button>
      )}
      {onDelete && (
        <Button placeholder="" onClick={onDelete}>
          Delete
        </Button>
      )}
    </>
  );
}

export default GenerateQR;
