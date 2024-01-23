import {
  ClipboardDocumentCheckIcon,
  QrCodeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  Collapse as Clp,
  Typography,
  Progress,
  Button,
} from "@material-tailwind/react";
import { useAppSelector } from "@/lib/hooks";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}
function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Typography
        placeholder={""}
        as="a"
        href={href || "#"}
        variant="paragraph"
        className="flex items-center gap-2 font-medium"
      >
        {children}
      </Typography>
    </li>
  );
}

const Collapse = ({ open, relative }: { open: boolean; relative: boolean }) => {
  const events = useAppSelector((state) => state.event.events);
  const user = useAppSelector((state) => state.user.user);
  const contestants = useAppSelector((state) => state.event.contestants);
  const votesLeft = useAppSelector((state) => state.user.votesLeft);
  let NAV_MENU = [
    {
      name: "Share QR code",
      icon: QrCodeIcon,
      href: "verify",
    },
    {
      name: "Scan QR",
      icon: () => (
        <svg
          fill="currentColor"
          strokeWidth="0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          height="1.25rem"
          width="1.25rem"
          style={{ overflow: "visible", color: "currentcolor" }}
        >
          <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z"></path>
          <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z"></path>
          <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z"></path>
          <path d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z"></path>
          <path d="M12 9h2V8h-2v1Z"></path>
        </svg>
      ),
      href: "scan_qr",
    },
    {
      name: "Votes Histories",
      icon: ClipboardDocumentCheckIcon,
      href: "histories",
    },
  ];
  if (user?.is_admin)
    NAV_MENU = [
      ...NAV_MENU,
      {
        name: "Almighty",
        icon: UserIcon,
        href: "admin",
      },
    ];
  if (contestants?.find((c) => c.id == user?.id))
    NAV_MENU = [
      ...NAV_MENU,
      {
        name: "Contestant QR",
        icon: QrCodeIcon,
        href: "contestant_qr",
      },
    ];
  if (!events) return;
  return (
    <Clp open={open} className={`${relative ? "fixed" : ""}`}>
      <div
        className={`container mx-auto mt-4 rounded-lg bg-white px-6 py-5 ${
          open ? "rounded-none shadow-md" : ""
        } border-t-[1px]`}
      >
        <Button className="mb-6" placeholder="" key="conttestantButton">
          {events ? events[0].event_name : "no event"}
        </Button>

        {user && [
          <Typography
            placeholder={""}
            variant="paragraph"
            className="flex items-center gap-2 font-medium text-gray-900"
            key="vl-tp"
          >
            Votes Left : {(votesLeft && votesLeft.length) || 0}{" "}
            <span className="hidden md:block capitalize">
              {votesLeft &&
                votesLeft.length > 0 &&
                "=> " + votesLeft?.join(", ")}
            </span>
          </Typography>,
          <Progress
            key="vl-pg"
            value={(votesLeft && (votesLeft.length / 8) * 100) || 0}
            placeholder={""}
            color="teal"
            className="my-4"
          />,
        ]}
        <ul className="flex flex-col gap-4 text-gray-900">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <Icon className="h-5 w-5" />
              {name}
            </NavItem>
          ))}
        </ul>
      </div>
    </Clp>
  );
};

export default Collapse;
