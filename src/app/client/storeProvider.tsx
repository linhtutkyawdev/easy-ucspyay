"use client";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import useSWR from "swr";
import { makeStore, AppStore } from "@/lib/store";
import { setContestants, setEvents } from "@/lib/features/event/eventSlice";
import { setUsers, setUser, setVotesLeft } from "@/lib/features/user/userSlice";
import { useUser } from "@clerk/nextjs";
import { addUser, updateContestant } from "../api/server";
import { updateUser } from "../server";
import { useSearchParams } from "next/navigation";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  const searchParams = useSearchParams()
  const event_name = searchParams.get('event_name')
  const { user: currentUser } = useUser();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  let { data: events } = useSWR<
    {
      event_name: string;
      event_day: Date;
    }[]
  >("/api/events", fetcher);

  if (event_name && events) {
    events = events.filter((e) => e.event_name === event_name).concat(
      events.filter((e) => e.event_name !== event_name)
    )
  }

  const { data: user, isLoading: isUserLoading } = useSWR<{
    id: string;
    full_name: string;
    image_url: string;
    ucspyay_mail: string;
    is_admin: boolean;
  }>(currentUser?.id ? `/api/users/${currentUser.id}` : null, fetcher);

  const { data: users } = useSWR<
    {
      id: string;
      full_name: string;
      image_url: string;
      ucspyay_mail: string;
      is_admin: boolean;
    }[]
  >("/api/users", fetcher);

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

  const { data: contestant, isLoading: isContestantLoading } = useSWR<{
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
    if (user && storeRef.current) {
      storeRef.current.dispatch(setUser(user));
    }
  }, [user]);

  useEffect(() => {
    if (users && storeRef.current) {
      storeRef.current.dispatch(setUsers(users));
    }
  }, [users]);

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

  useEffect(() => {
    (async () => {
      if (currentUser && !isUserLoading) {
        const ucspyay_mail = currentUser.emailAddresses.find((email) => {
          const pattern = new RegExp(
            `@${process.env.NEXT_PUBLIC_VALID_EMAIL_DOMAIN}$`,
            "i"
          );
          return pattern.test(email.emailAddress);
        })?.emailAddress;
        if (!user) {
          if (!ucspyay_mail) return;
          const newUser = {
            id: currentUser.id,
            full_name: currentUser.fullName || "Name Not Found!",
            image_url: currentUser.imageUrl,
            ucspyay_mail,
            is_admin: false,
          };

          if (!storeRef.current) return;
          return (
            (await addUser(newUser)) &&
            storeRef.current.dispatch(setUser(newUser))
          );
        }
        if (currentUser.imageUrl != user.image_url) {
          (await updateUser(
            currentUser.id,
            "image_url",
            currentUser.imageUrl
          )) && console.log("updated img");
        }

        if (currentUser.fullName && currentUser.fullName != user.full_name)
          (await updateUser(
            currentUser.id,
            "full_name",
            currentUser.fullName
          )) && console.log("updated fullname");

        if (
          ucspyay_mail &&
          user.ucspyay_mail &&
          ucspyay_mail != user.ucspyay_mail
        )
          await updateUser(currentUser.id, "ucspyay_mail", ucspyay_mail);
        console.log("updated mail");

        if (isContestantLoading) return;
        if (!contestant) return;

        if (
          contestant.image_url &&
          currentUser.imageUrl != contestant.image_url &&
          events &&
          events[0]
        )
          await updateContestant(
            events[0].event_name,
            currentUser.id,
            "image_url",
            currentUser.imageUrl
          );

        if (
          currentUser.fullName &&
          currentUser.fullName != contestant.full_name &&
          events &&
          events[0]
        )
          await updateContestant(
            events[0].event_name,
            currentUser.id,
            "full_name",
            currentUser.fullName
          );

        return storeRef.current?.dispatch(
          setUser({
            id: currentUser.id,
            full_name: currentUser.fullName || "Name Not Found!",
            image_url: currentUser.imageUrl,
            ucspyay_mail: ucspyay_mail || "",
            is_admin: user.is_admin || false,
          })
        );
      }
    })();
  }, [
    currentUser,
    isUserLoading,
    user,
    isContestantLoading,
    contestant,
    events,
  ]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
