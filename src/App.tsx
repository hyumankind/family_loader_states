import "./styles.css";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";

type State = "safe" | "analyzing" | "warning";

const STATES: State[] = ["safe", "analyzing", "warning", "analyzing"];
const BG: Record<State, string> = {
  safe: "#DAF4E2",
  analyzing: "#DDF1FF",
  warning: "#FFE2DE",
};
const FG: Record<State, string> = {
  safe: "#43C479",
  analyzing: "#00A8F8",
  warning: "#FF003E",
};

export default function App() {
  const [state, cycleState] = useCycle(STATES);
  const [cycled, setCycled] = useState(false);

  useEffect(() => {
    const onClick = () => {
      cycleState();
      if (!cycled) setCycled(true);
    };
    const onMouseDown = (event: MouseEvent) => {
      // Prevent selection of text:
      // https://stackoverflow.com/a/43321596
      if (event.detail > 1) {
        event.preventDefault();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mousedown", onMouseDown);
    };
  });

  return (
    <MotionConfig
      transition={{
        scale: {
          duration: 0.6,
          type: "spring",
          bounce: 0.3,
        },
        opacity: {
          duration: 0.3,
        },
        layout: { duration: 0.7, bounce: 0.3, type: "spring" },
      }}
    >
      <motion.div
        layout
        className="will-transform"
        style={{
          borderRadius: 999,
          height: "3.5rem",
          overflow: "clip",
          display: "flex",
          alignItems: "center",
          fontSize: "1.25rem",
          padding: "0 1.75rem 0 1.333rem",
          isolation: "isolate",
          letterSpacing: "-.025em",
          fontFamily: "Open Runde",
          fontWeight: 600,
          backgroundColor: BG[STATES[0]],
          color: FG[STATES[0]],
        }}
        animate={{
          backgroundColor: BG[state],
          color: FG[state],
        }}
      >
        <motion.div
          layout="position"
          className="will-transform"
          style={{ marginRight: "0.66rem", position: "relative", zIndex: 50 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {state === "analyzing" ? (
              <motion.div
                key="analyzing"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <svg
                  className="animate-spin"
                  style={{ height: "1.5rem", display: "block" }}
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34C27.732 34 34 27.732 34 20C34 12.268 27.732 6 20 6ZM0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
                    fill="#B0DEF9"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20 6C12.268 6 6 12.268 6 20C6 21.6569 4.65685 23 3 23C1.34315 23 0 21.6569 0 20C0 8.95431 8.95431 0 20 0C21.6569 0 23 1.34315 23 3C23 4.65685 21.6569 6 20 6Z"
                    fill="#25AAF6"
                  />
                </svg>
              </motion.div>
            ) : state === "safe" ? (
              <motion.div
                key="safe"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <svg
                  style={{ height: "1.5rem", display: "block" }}
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="20" cy="20" r="20" fill={FG["safe"]} />
                  <path
                    d="M11.75 21.25L16.75 26.25L28.25 14.75"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="warning"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <motion.div
                  animate={{ x: [0, 4, -4, 2, -2, 0] }}
                  transition={{
                    duration: 0.25,
                    delay: 0.5,
                  }}
                >
                  <svg
                    style={{ height: "1.5rem", display: "block" }}
                    viewBox="0 0 37 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.1699 4.49999C16.0944 1.16666 20.9056 1.16667 22.8301 4.5L35.3875 26.25C37.312 29.5833 34.9064 33.75 31.0574 33.75H5.94262C2.09362 33.75 -0.311997 29.5833 1.6125 26.25L14.1699 4.49999Z"
                      fill={FG["warning"]}
                    />
                    <circle cx="18.5" cy="27.5" r="2.5" fill="white" />
                    <rect
                      x="16"
                      y="9"
                      width="5"
                      height="12"
                      rx="2.5"
                      fill="white"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.span
          layout="position"
          className="will-transform"
          initial={false}
          animate={{
            opacity: state === "analyzing" ? 1 : 0,
            transition: {
              duration: state === "warning" ? 0.125 : 0.175,
              delay: state === "analyzing" ? 0.1 : 0,
            },
          }}
          // @ts-expect-error React doesn't know inert yet
          inert={state === "analyzing" ? undefined : ""}
          style={{
            display: "inline-flex",
            justifyContent: "flex-end",
            width: state === "analyzing" ? "auto" : 0,
          }}
        >
          <motion.span
            layout="position"
            className="will-transform"
            style={{ display: "inline-block" }}
          >
            Analyzing&nbsp;
          </motion.span>
        </motion.span>
        <motion.span
          layout="position"
          className="will-transform"
          style={{ display: "inline-block" }}
        >
          Transaction
        </motion.span>
        <motion.span
          layout="position"
          className="will-transform"
          initial={false}
          animate={{
            opacity: state === "safe" ? 1 : 0,
            transition: {
              duration: 0.175,
              delay: state === "safe" ? 0.05 : 0,
            },
          }}
          // @ts-expect-error React doesn't know inert yet
          inert={state === "safe" ? undefined : ""}
          style={{
            display: "inline-flex",
            justifyContent: "flex-start",
            width: state === "safe" ? "auto" : 0,
          }}
        >
          <motion.span
            layout="position"
            className="will-transform"
            style={{ display: "inline-block" }}
          >
            &nbsp;Safe
          </motion.span>
        </motion.span>
        <motion.span
          layout="position"
          className="will-transform"
          initial={false}
          animate={{
            opacity: state === "warning" ? 1 : 0,
            transition: {
              duration: 0.175,
              delay: state === "warning" ? 0.05 : 0,
            },
          }}
          // @ts-expect-error React doesn't know inert yet
          inert={state === "warning" ? undefined : ""}
          style={{
            display: "inline-flex",
            justifyContent: "flex-start",
            width: state === "warning" ? "auto" : 0,
          }}
        >
          <motion.span
            layout="position"
            className="will-transform"
            style={{ display: "inline-block" }}
          >
            &nbsp;Warning
          </motion.span>
        </motion.span>
      </motion.div>
      <AnimatePresence initial={false}>
        {!cycled && (
          <motion.span
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              bottom: "1rem",
              width: "100%",
              left: 0,
              padding: "1.5rem",
              textAlign: "center",
              fontSize: "0.75rem",
              opacity: 0.4,
            }}
          >
            Click anywhere to cycle states
          </motion.span>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function useCycle<T>(options: Array<T>) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % options.length);

  return [options[index], next] as const;
}
