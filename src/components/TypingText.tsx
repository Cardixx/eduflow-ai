import { useEffect, useState } from "react";

export function TypingText({ text, speed = 18, className }: { text: string; speed?: number; className?: string }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <p className={className}>
      {out}
      <span className="inline-block w-[2px] h-[1em] align-middle bg-primary ml-0.5 animate-pulse" />
    </p>
  );
}
