import MeteorRainLoading from "./meteorRain";
import { useEchospace } from "../../../controllers/store";

export const Loader = ({ children }) => {
  const [{ isLoading }] = useEchospace();

  return (
    <>
      {isLoading ? (
        <div>
          <div className="fixed z-[100] h-full w-full">
            <MeteorRainLoading color="#e83a00fc" />
          </div>
          <div
            className="opacity-40"
            style={{ filter: "blur(10px)", WebkitFilter: "blur(10px)" }}
          >
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};
