"use client";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import useSWR from "swr";
import { makeStore, AppStore } from "@/lib/store";
import { setContestants, setEvents } from "@/lib/features/event/eventSlice";
import { setUsers, setUser, setVotesLeft } from "@/lib/features/user/userSlice";
import { useUser } from "@clerk/nextjs";
import { isEndWithUCSPyayDomain } from "@/lib/utils";
import { addUser, updateContestant, updateUser } from "../api/server";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  const { user: currentUser } = useUser();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: events } = useSWR<
    {
      event_name: string;
      event_day: Date;
    }[]
  >("/api/events", fetcher);

  const { data: users } = useSWR<
    {
      id: string;
      full_name: string;
      image_url: string;
      ucspyay_mail: string;
      is_admin: boolean;
    }[]
  >("/api/users", fetcher);

  const { data: user } = useSWR<{
    id: string;
    full_name: string;
    image_url: string;
    ucspyay_mail: string;
    is_admin: boolean;
  }>(currentUser?.id ? `/api/users/${currentUser.id}` : null, fetcher);

  const { data: contestants } = useSWR<
    {
      contestant_no: number;
      id: string;
      full_name: string;
      image_url: string;
      gender: string;
      nick_name: string;
      height: number;
    }[]
  >(events ? `/api/events/${events[0].event_name}/contestants` : null, fetcher);

  const { data: contestant } = useSWR<{
    contestant_no: number;
    id: string;
    full_name: string;
    image_url: string;
    gender: string;
    nick_name: string;
    height: number;
  }>(
    events && currentUser?.id
      ? `/api/events/${events[0].event_name}/contestants/${currentUser.id}`
      : null,
    fetcher
  );

  const { data: votesLeft } = useSWR<string[]>(
    currentUser?.id && events
      ? `/api/events/${events[0].event_name}/votes/${currentUser.id}/left`
      : null,
    fetcher
  );

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (events && storeRef.current) {
      storeRef.current.dispatch(setEvents(events));
    }
  }, [events]);

  useEffect(() => {
    if (users && storeRef.current) {
      storeRef.current.dispatch(setUsers(users));
    }
  }, [users]);

  useEffect(() => {
    if (user && storeRef.current) {
      storeRef.current.dispatch(setUser(user));
    }
  }, [user]);

  useEffect(() => {
    if (votesLeft && storeRef.current) {
      storeRef.current.dispatch(setVotesLeft(votesLeft));
    }
  }, [votesLeft]);

  useEffect(() => {
    if (contestants && storeRef.current) {
      storeRef.current.dispatch(setContestants(contestants));
    }
  }, [contestants]);

  // useEffect(() => {
  //   (async () => {
  //     if (!events) return console.log("turso-event-error");
  //     if (!users) return console.log("turso-users-error");
  //     if (!currentUser) return console.log("clerk-user-error");
  //     if (!storeRef.current) return console.log("redux-ref-error");

  //     // const exisitingUser = users.find((u) => u.id == user.id);
  //     // const exisitingContestant = contestants.find((u) => u.id == user.id);

  //     const ucspyay_mail = currentUser.emailAddresses.find((email) =>
  //       isEndWithUCSPyayDomain(email.emailAddress)
  //     )?.emailAddress;
  //     if (!ucspyay_mail) return console.log(ucspyay_mail || "");

  //     // if (!users.find((u) => u.id == currentUser.id)) {
  //     //   const newUser = {
  //     //     id: currentUser.id,
  //     //     full_name: currentUser.fullName || "Name Not Found!",
  //     //     image_url: currentUser.imageUrl,
  //     //     ucspyay_mail,
  //     //     is_admin: false,
  //     //   };
  //     //   return (
  //     //     (await addUser(newUser)) &&
  //     //     storeRef.current.dispatch(setUser(newUser))
  //     //   );
  //     // }

  //     // if (!user) return console.log("turso-user-error");

  //     // if (currentUser.imageUrl != user.image_url) {
  //     //   (await updateUser(currentUser.id, "image_url", currentUser.imageUrl)) &&
  //     //     console.log("updated img");
  //     // }
  //     // if (currentUser.fullName && currentUser.fullName != user.full_name)
  //     //   (await updateUser(currentUser.id, "full_name", currentUser.fullName)) &&
  //     //     console.log(user);

  //     // if (ucspyay_mail && ucspyay_mail != user.ucspyay_mail)
  //     //   await updateUser(currentUser.id, "ucspyay_mail", ucspyay_mail);

  //     // if (contestant) {
  //     //   if (currentUser.imageUrl != contestant.image_url)
  //     //     await updateContestant(
  //     //       events[0].event_name,
  //     //       currentUser.id,
  //     //       "image_url",
  //     //       currentUser.imageUrl
  //     //     );

  //     //   if (
  //     //     currentUser.fullName &&
  //     //     currentUser.fullName != contestant.full_name
  //     //   )
  //     //     await updateContestant(
  //     //       events[0].event_name,
  //     //       currentUser.id,
  //     //       "full_name",
  //     //       currentUser.fullName
  //     //     );
  //     // }
  //     return storeRef.current.dispatch(
  //       setUser({
  //         id: currentUser.id,
  //         full_name: currentUser.fullName || "Name Not Found!",
  //         image_url: currentUser.imageUrl,
  //         ucspyay_mail,
  //         is_admin: user?.is_admin || false,
  //       })
  //     );
  //   })();
  // }, [users, user, events, contestant, currentUser]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
