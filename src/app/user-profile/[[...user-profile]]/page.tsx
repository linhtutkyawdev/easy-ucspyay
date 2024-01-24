import { getUser } from "@/app/server";
import RedirectBack from "./client/redirect";
import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = async () => {
  if ((await getUser())?.ucspyay_mail) return <RedirectBack />;
  return (
    <div className="my-4 flex items-end justify-center">
      <UserProfile path="/user-profile" routing="path" />
      {/* <RedirectBack /> */}
    </div>
  );
};
export default UserProfilePage;
