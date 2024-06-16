import Logo from "../../../assets/Logo.png";
import { Link } from "react-router-dom";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import ProfileModal from "./profile-modal";
import DefaultProfileAvataar from "../../../assets/images/profile-avataar.png";
import { useEchospace } from "../../../controllers/store";

const Header = () => {
  const [{ user }, { updateCurrentUser }] = useEchospace();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        updateCurrentUser({ email: user.email, name: user.displayName });
      } else {
        updateCurrentUser(null);
      }
    });
    return () => {
      unsubcribe();
    };
  }, [updateCurrentUser]);

  return (
    <header
      className="fixed py-3 px-8 w-full z-50 h-[3.56rem] text-white border-b-[0.5px] border-[#5f5f5f]"
      style={{
        background:
          "linear-gradient(90deg, rgba(0, 7, 35, 0.9) 0%, rgba(0, 24, 57, 0.85) 100%)",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* navbar container */}
      <div className="relative flex justify-between items-center w-full">
        {/* logo container */}
        <Link to={"/"}>
          <div className="w-[9rem]">
            <img
              src={Logo}
              alt="EyeViz Logo"
              className="h-4/5 w-3/5 object-contain"
              draggable="false"
            ></img>
          </div>
        </Link>
        {/* logo container */}
        {/* right navbar elements */}
        <div className="flex justify-between items-center relative gap-14 px-2 font-mons font-medium">
          <div className="flex items-center gap-x-2">
            <Link to="/search/posts">
              <div className="cursor-pointer">Search Posts</div>
            </Link>
          </div>
          <div className="flex items-center gap-x-2">
            <Link to="/search/users">
              <div className="cursor-pointer">Search Users</div>
            </Link>
          </div>
          <Link to="/signIn">
            <div className="cursor-pointer">{!user ? "Log In" : ""}</div>
          </Link>

          <div>
            {user ? (
              <div
                className="w-10 cursor-pointer"
                onClick={() => {
                  setShowModal(!showModal);
                }}
              >
                <img
                  src={DefaultProfileAvataar}
                  alt="Profile Pic"
                  style={{ borderRadius: "50%" }}
                />
              </div>
            ) : (
              <Link to="/signUp">
                <div
                  style={{
                    backgroundImage:
                      "conic-gradient(from 180deg at 50% 50%, #09F9FC -141.38deg, #F704FB 31.12deg, #09F9FC 218.62deg, #F704FB 391.12deg)",
                  }}
                  className="px-[3px] py-[3px] rounded-xl cursor-pointer"
                >
                  <div className="bg-[#001236] px-2 py-1 rounded-xl">
                    Get Started
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
        {showModal ? (
          <div className="absolute top-14 right-4">
            <ProfileModal showModal={showModal} setShowModal={setShowModal} />
          </div>
        ) : (
          <></>
        )}
        {/* right navbar elements */}
      </div>
      {/* navbar container */}
    </header>
  );
};

export default Header;
