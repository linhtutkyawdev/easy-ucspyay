"use client";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { addContestant, addUser, getCount, verifySecret } from "../server";
import Navbar from "@/app/client/navbar";
import { updateUser } from "@/app/server";
import DialogSelect from "@/app/client/dialogSelect";
import DialogInput from "@/app/client/dialogInput";

const Scanner = () => {
  const [data, setData] = useState<string | null>(null);
  const [gender, setGender] = useState("");
  const [nickName, setNickName] = useState("");
  const [height, setHeight] = useState("");
  const [key, setKey] = useState("");
  const [gopen, setgOpen] = useState(false);
  const [nopen, setnOpen] = useState(false);
  const [hopen, sethOpen] = useState(false);
  const user = useUser();
  useEffect(() => {
    (async () => {
      if (!user.user || !gender || !nickName || !height || !key) return;

      const contestant_no = await getCount(key, "gender", gender);
      confirm(
        `Contestant Verification for :${key}: No. ${contestant_no + 1}\nName: ${
          user.user.firstName + " " + user.user.lastName
        }\nGender: ${gender}\nNick Name: ${nickName}\nHeight: ${height}\n\nPLEASE CONFIRM THAT THE INFORMATION IS CORRECT!!`
      ) &&
        (await addContestant(
          {
            id: user.user.id,
            full_name: user.user.firstName + " " + user.user.lastName,
            image_url: user.user.imageUrl,
            gender,
            contestant_no: contestant_no + 1,
            nick_name: nickName,
            height,
          },
          key
        )) &&
        setData("Noice");
      setKey("");
    })();
  }, [user, key, gender, nickName, height]);

  return (
    <>
      <Navbar white />
      <div className="flex flex-col items-center justify-center h-screen max-w-[400px] mx-auto">
        {data ||
          (user.user?.id && !key && (
            <>
              <QrScanner
                // onDecode={(result) => console.log(result)}
                tracker
                onError={(error) => console.log(error?.message)}
                onResult={async (result) => {
                  const keyword = result.getText().split(":")[0];

                  if (keyword == "http" || keyword == "https")
                    return window.location.assign(result.getText());

                  if (keyword == "user")
                    return (
                      (await verifySecret(
                        result.getText(),
                        "user_verifications"
                      )) &&
                      (await addUser({
                        id: user.user.id,
                        full_name:
                          user.user.firstName + " " + user.user.lastName,
                        image_url: user.user.imageUrl,
                      })) &&
                      setData("Noice")
                    );

                  if (keyword == "almighty")
                    return (
                      result
                        .getText()
                        .slice(result.getText().indexOf(":") + 1) ==
                        'Lin Htut Kyaw says, "YOU ARE ADMIN!!!"' &&
                      (await updateUser(user.user.id, "is_admin", "1")) &&
                      setData("Noice!!! You are an admin, now!")
                    );

                  if (keyword.includes("_contestant")) {
                    if (
                      !(await verifySecret(
                        result.getText(),
                        "contestant_verifications"
                      ))
                    )
                      return setData("Verification is no longer valid!!!");
                    setKey(keyword);
                    setgOpen(true);
                  } else
                    alert(
                      `INVALID TYPE OF QR READ!!!\nQR: ${result.getText()}\n`
                    );
                }}
                stopDecoding={data ? true : false}
              />
              <span className="text-lg m-4">Place The QR inside the frame</span>
            </>
          ))}
      </div>
      <DialogSelect
        open={gopen}
        toggleOpen={() => {
          setgOpen(false);
        }}
        label="Choose your gender!"
        options={["male", "female"]}
        setValue={(v: string) => {
          setGender(v);
          setnOpen(true);
        }}
      />
      <DialogInput
        open={nopen}
        toggleOpen={() => {
          nickName && setnOpen(false);
        }}
        label="Enter your nick name!"
        setValue={(v: string) => {
          setNickName(v);
          sethOpen(true);
        }}
      />
      <DialogInput
        open={hopen}
        toggleOpen={() => {
          height && sethOpen(false);
        }}
        label="Enter your height!"
        setValue={(v: string) => {
          setHeight(v);
        }}
      />
    </>
  );
};
export default Scanner;
