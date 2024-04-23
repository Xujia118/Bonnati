import { useState, useEffect } from "react";

function Processing({ setPage }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          return prev;
        }
        return prev - 1;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (countdown === 1) {
      setPage("menu");
    }
  }, [countdown]);

  return (
    <>
      <div className="main-wrapper">
        <div className="message-container">
          <h1>Your order is being processed.</h1>
          <p>Returning to menu in {countdown} seconds...</p>
        </div>
      </div>
    </>
  );
}

export default Processing;
