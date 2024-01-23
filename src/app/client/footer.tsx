import { Typography, Button, IconButton } from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/24/solid";

const CURRENT_YEAR = new Date().getFullYear();
const LINKS = ["Company", "About Us", "Team", "Products", "Blog"];

export function Footer() {
  return (
    <footer className="pb-5 p-10 md:pt-10">
      <div className="sm:container flex flex-col mx-auto">
        <div className="flex !w-full py-10 mb-5 md:mb-20 flex-col justify-center !items-center bg-gray-900 max-w-6xl mx-auto rounded-2xl p-5 ">
          <Typography
            placeholder={""}
            className="text-2xl md:text-3xl text-center font-bold "
            color="white"
          >
            Please Give Us A Star On Github!
          </Typography>
          <Typography
            placeholder={""}
            color="white"
            className=" md:w-7/12 text-center my-3 !text-base flex flex-row items-center justify-center"
          >
            Thank you for giving us stars &nbsp;
            <StarIcon color="yellow" className="w-4 h-4" />
            <StarIcon color="yellow" className="w-4 h-4" />
            <StarIcon color="yellow" className="w-4 h-4" />
          </Typography>
          <div className="flex w-full md:w-fit gap-3 mt-2 flex-col md:flex-row">
            <a href="https://github.com/linhtutkyawdev/easy-ucspyay">
              <Button
                placeholder={""}
                color="white"
                size="md"
                className="capitalize"
              >
                Go to Github repo
              </Button>
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center !justify-between">
          {/* <ul className="flex justify-center my-4 md:my-0 w-max mx-auto items-center gap-4">
            {LINKS.map((link, index) => (
              <li key={index}>
                <Typography
                  placeholder={""}
                  as="a"
                  href="#"
                  variant="small"
                  color="white"
                  className="font-normal !text-gray-700 hover:!text-gray-900 transition-colors"
                >
                  {link}
                </Typography>
              </li>
            ))}
          </ul> */}
          {/* <div className="flex w-fit justify-center gap-2">
            <IconButton placeholder={""} size="sm" color="gray" variant="text">
              <i className="fa-brands fa-twitter text-lg" />
            </IconButton>
            <IconButton placeholder={""} size="sm" color="gray" variant="text">
              <i className="fa-brands fa-youtube text-lg" />
            </IconButton>
            <IconButton placeholder={""} size="sm" color="gray" variant="text">
              <i className="fa-brands fa-instagram text-lg" />
            </IconButton>
            <IconButton placeholder={""} size="sm" color="gray" variant="text">
              <i className="fa-brands fa-github text-lg" />
            </IconButton>
          </div> */}
        </div>
        <Typography
          placeholder={""}
          color="blue-gray"
          className="text-center font-normal !text-gray-700 flex flex-row items-end justify-center text-nowrap container text-xs md:text-base pt-6"
        >
          &copy; {CURRENT_YEAR} crafted by &nbsp;
          <a
            href="https://github.com/ngamae"
            rel="noopener"
            target="_blank"
            className="font-bold text-indigo-400"
          >
            San Min Aung
          </a>
          &nbsp; & &nbsp;
          <a
            href="https://linhtutkyawdev.vercel.app"
            target="_blank"
            className="font-bold text-indigo-400"
            rel="noopener"
          >
            Lin Htut Kyaw
          </a>
          .
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
