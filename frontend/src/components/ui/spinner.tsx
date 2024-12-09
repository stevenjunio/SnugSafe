import "./spinner.css"; // Import the CSS file for animation

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={`waving-bar  w-[90%] bg-gradient-to-r from-purple-50 via-[#C586A1]  to-purple-50 ${className || ""}`}
    ></div>
  );
}
