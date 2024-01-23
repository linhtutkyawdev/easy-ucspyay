"use client";
import Slider from "react-slick";
import Navbar from "@/app/client/navbar";
import ContestantCard from "./contestant-card";
import { useAppSelector } from "@/lib/hooks";
import Couple_card from "./couple-card";
import { useSearchParams } from "next/navigation";
import VerifyInfo from "./verify-info";

export default function Voting() {
  const contestants = useAppSelector((state) => state.event.contestants);
  const user = useAppSelector((state) => state.user.user);
  const params = useSearchParams();
  const contestant_groups = useAppSelector(
    (state) => state.event.contestant_groups
  );

  if (!user) return <VerifyInfo />;

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    initialSlide: Number.parseInt(params.get("cno") || "1") - 1,
  };

  return (
    <main className="bg-blue-gray-50">
      <Navbar white voting />
      {contestants &&
        (contestant_groups[0] == "male" || contestant_groups[0] == "female" ? (
          <div className="container h-[90vh] sm:pt-[5.95rem] flex flex-col">
            <Slider
              {...settings}
              className="w-[320px] m-auto scale-110v text-black"
            >
              {contestants
                .filter((c) => {
                  return c.gender == contestant_groups[0];
                })
                .map((c) => (
                  <ContestantCard
                    {...c}
                    allowed_contestant_group={c.gender}
                    key={c.id}
                  />
                ))}
            </Slider>
          </div>
        ) : (
          <Slider
            {...settings}
            className="couple-card-body lg:!w-[60vw] lg:!h-[100vh] !w-[86vw] !h-[96vh]  md:pt-32 pt-20 mx-auto lg:-mt-8"
          >
            {contestants
              .filter((c) => c.gender == "male")
              .map((male) => {
                const female = contestants.find(
                  (c) =>
                    c.contestant_no == male.contestant_no &&
                    c.gender == "female"
                );
                if (male && female)
                  return (
                    <Couple_card
                      key={"c-" + male.contestant_no}
                      male={male}
                      female={female}
                    />
                  );
              })}
          </Slider>
        ))}
    </main>
  );
}
