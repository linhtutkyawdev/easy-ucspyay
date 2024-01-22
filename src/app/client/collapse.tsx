import { QrCodeIcon } from "@heroicons/react/24/solid";
import {
  Collapse as Clp,
  Typography,
  Progress,
  Button,
} from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const NAV_MENU = [
  {
    name: "Share QR code",
    icon: QrCodeIcon,
    href: "verify",
  },
];
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

const Collapse = ({ open }: { open: boolean }) => {
  const events = useAppSelector((state) => state.event.events);
  const user = useAppSelector((state) => state.user.user);
  const votesLeft = useAppSelector((state) => state.user.votesLeft);

  const dispatch = useAppDispatch();

  if (!events) return;
  return (
    <Clp open={open}>
      <div
        className={`container mx-auto mt-4 rounded-lg bg-white px-6 py-5 ${
          open ? "rounded-none shadow-md" : ""
        } border-t-[1px]`}
      >
        <Button className="mb-6" placeholder="" key="conttestantButton">
          {events ? events[0].event_name : "no event"}
        </Button>
        {user?.is_admin && (
          <a href="/admin">
            <Button className="mb-6" placeholder="" key="conttestantButton">
              Admin
            </Button>
          </a>
        )}
        <Typography
          placeholder={""}
          variant="paragraph"
          className="flex items-center gap-2 font-medium text-gray-900"
        >
          Votes Left : {(votesLeft && votesLeft.length) || 0}{" "}
          <span className="hidden md:block capitalize">
            ({votesLeft?.join(", ")})
          </span>
        </Typography>
        <Progress
          value={(votesLeft && (votesLeft.length / 8) * 100) || 0}
          placeholder={""}
          color="teal"
          className="my-4"
        />
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
