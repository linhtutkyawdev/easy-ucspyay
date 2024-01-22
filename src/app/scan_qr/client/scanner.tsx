"use client";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { addContestant, addUser, getCount, verifySecret } from "../server";
import Navbar from "@/app/client/navbar";
import { updateUser } from "@/app/server";

const Scanner = () => {
  const [data, setData] = useState<string | null>(null);
  const user = useUser();

  return (
    <>
      <Navbar white />
      <div className="flex flex-col items-center justify-center h-screen max-w-[400px] mx-auto">
        {data ||
          (user.user?.id && (
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
                    let gender: string | null = null,
                      nick_name: string | null = null,
                      height: string | null = null;
                    while (gender == null) {
                      gender = prompt("Enter your gender: male  | female");
                      if (gender == "exit") return;
                      if (gender != "male" && gender != "female") {
                        alert("Invalid gender!!!");
                        gender = null;
                      }
                    }
                    while (nick_name == null) {
                      nick_name = prompt(
                        "Enter your nick_name: must be less than 12 letters"
                      );
                      if (!nick_name || (nick_name && nick_name.length >= 12)) {
                        alert("Invalid nick_name!!!");
                        nick_name = null;
                      }
                    }
                    while (!height || (height && height.length >= 10)) {
                      height = prompt("Enter your height: X' Y\"");
                      if (height && height.length >= 12) {
                        alert("Invalid height!!!");
                        height = null;
                      }
                    }

                    const contestant_no = await getCount(
                      keyword,
                      "gender",
                      gender
                    );

                    confirm(
                      `Contestant Verification for :${keyword}: No. ${
                        contestant_no + 1
                      }\nName: ${
                        user.user.firstName + " " + user.user.lastName
                      }\nGender: ${gender}\nNick Name: ${nick_name}\nHeight: ${height}\n\nPLEASE CONFIRM THAT THE INFORMATION IS CORRECT!!`
                    ) &&
                      (await addContestant(
                        {
                          id: user.user.id,
                          full_name:
                            user.user.firstName + " " + user.user.lastName,
                          image_url: user.user.imageUrl,
                          gender,
                          contestant_no: contestant_no + 1,
                          nick_name,
                          height,
                        },
                        keyword
                      )) &&
                      setData("Noice");
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
    </>
  );
};
export default Scanner;
