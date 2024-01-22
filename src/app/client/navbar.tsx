import React, { useEffect, useState } from "react";
import {
  Navbar as MTNavbar,
  Button,
  IconButton,
  Typography,
  Progress,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  Bars3Icon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Collapse from "./collapse";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  moveContestantGroupToStart,
  setContestants,
  setEvents,
} from "@/lib/features/event/eventSlice";

const CONTESTANT_GROUPS = [
  {
    value: "male",
    placeholder: "Boys",
  },
  {
    value: "female",
    placeholder: "Girls",
  },
  {
    value: "couple",
    placeholder: "Couples",
  },
];
export function Navbar({
  white,
  voting,
}: {
  white?: boolean;
  voting?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(white || false);
  const handleOpen = () => setOpen((cur) => !cur);

  const contestant_groups = useAppSelector(
    (state) => state.event.contestant_groups
  );
  const dispatch = useAppDispatch();

  const user = useUser();

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        white || setIsScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    document.body.addEventListener("click", () => {
      setOpen(false);
    });
  }, [white]);

  return (
    <MTNavbar
      placeholder={""}
      shadow={false}
      fullWidth
      blurred={false}
      color={isScrolling ? "white" : "transparent"}
      className="fixed top-0 z-50 border-0"
    >
      <div className="sm:container mx-auto flex items-center justify-between">
        <Link href="/">
          <Typography
            color={isScrolling ? "blue-gray" : "white"}
            className="sm:text-md font-bold my-auto items-center flex 2xs:text-xs"
            placeholder={""}
          >
            <AcademicCapIcon className="h-8 w-8 my-auto sm:mr-2 float-left min-[320px]:hidden min-[400px]:text-indigo-400 2xs:w-6 3xs:h-6" />
            Easy UCSP
          </Typography>
        </Link>
        {/* <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${
            isScrolling ? "text-gray-900" : "text-white"
          }`}
        >
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <Icon className="h-5 w-5" />
              <span>{name}</span>
            </NavItem>
          ))}
        </ul> */}

        <div className="items-center flex gap-1">
          {voting && (
            <div className="w-[12rem] m-2">
              <Select
                placeholder={""}
                size="md"
                label="Select Contestants' Group"
                onChange={(value) =>
                  dispatch(
                    moveContestantGroupToStart(
                      contestant_groups.findIndex((v) => v == value)
                    )
                  )
                }
                selected={(element) =>
                  element &&
                  React.cloneElement(element, {
                    disabled: true,
                    className:
                      "flex items-center opacity-100 px-0 pointer-events-none",
                  })
                }
                value="male"
              >
                {CONTESTANT_GROUPS.map((c) => (
                  <Option
                    key={c.value}
                    value={c.value}
                    className="flex items-center gap-2"
                  >
                    {c.placeholder}
                  </Option>
                ))}
              </Select>
            </div>
          )}
          {user.user?.id
            ? [
                <UserButton
                  afterSignOutUrl="/"
                  key="userButton"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: isScrolling
                        ? "ring-black ring-1 border-transparent border-2 "
                        : "ring-white ring-1 border-transparent border-2 ",
                    },
                  }}
                />,
                <IconButton
                  placeholder={""}
                  variant="text"
                  color={isScrolling ? "gray" : "white"}
                  onClick={handleOpen}
                  key="IconButton"
                >
                  {open ? (
                    <XMarkIcon strokeWidth={2} className="h-6 w-6" />
                  ) : (
                    <Bars3Icon strokeWidth={2} className="h-6 w-6" />
                  )}
                </IconButton>,
              ]
            : [
                <SignUpButton key="SignUp">
                  <Button
                    color={isScrolling ? "gray" : "white"}
                    variant="text"
                    className="capitalize 2xs:p-2 2xs:rounded-md"
                    placeholder={""}
                  >
                    Create Account
                  </Button>
                </SignUpButton>,
                <SignInButton key="SignIn">
                  <Button
                    className="capitalize 2xs:p-2 2xs:rounded-md"
                    color={isScrolling ? "gray" : "white"}
                    placeholder={""}
                  >
                    Log in
                  </Button>
                </SignInButton>,
              ]}
        </div>
      </div>
      <Collapse open={open} />
    </MTNavbar>
  );
}

export default Navbar;
