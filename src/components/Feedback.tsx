import React from 'react';

export const Feedback: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-white text-[10px] leading-[1.4] text-center max-w-[520px]">
        Synthesized analysis of user sentiment (late 2023 - mid-2025) from G2, Capterra, TrustRadius, and Reddit.
        Numbers represent &quot;negative&quot; and &quot;positive&quot; mentions by users. It is reflecting the volume and intensity of
        feedback, not a literal count of every comment. Done by Gemini 2.5 Pro
      </p>
      
      <div className="flex gap-4">
        <div className="rotate-180 scale-y-[-100%]">
          <ThumbIcon />
        </div>
        <ThumbIcon />
      </div>
    </div>
  );
};

const ThumbIcon: React.FC = () => (
  <svg
    width="24"
    height="31"
    viewBox="0 0 24 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.1502 14.265L14.8558 10.1852C15.032 9.16621 14.2484 8.2342 13.2154 8.2342H8.03429C7.52079 8.2342 7.12976 7.77328 7.21288 7.26598L7.87556 3.22142C7.98321 2.56435 7.95247 1.892 7.78529 1.24752C7.6468 0.713641 7.23488 0.28495 6.69317 0.110925L6.5482 0.0643541C6.22081 -0.0408204 5.86347 -0.0163461 5.55481 0.132393C5.21505 0.296111 4.9665 0.594735 4.87437 0.949889L4.39866 2.78374C4.2473 3.36723 4.02682 3.93045 3.74256 4.46262C3.3272 5.24017 2.68502 5.86246 2.01749 6.43769L0.578746 7.67749C0.17309 8.02705 -0.0399471 8.55056 0.00621338 9.0844L0.818378 18.4771C0.892873 19.3386 1.61317 20 2.47695 20H7.12557C10.6069 20 13.5779 17.5744 14.1502 14.265Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.717665 0.00070903C1.11893 -0.0166069 1.46261 0.285257 1.49721 0.685402L2.46881 11.9219C2.53122 12.6437 1.96268 13.2658 1.23671 13.2658C0.55289 13.2658 0 12.7111 0 12.0286V0.750012C0 0.348374 0.316401 0.018025 0.717665 0.00070903Z"
      fill="white"
    />
  </svg>
); 