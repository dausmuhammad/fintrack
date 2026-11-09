import Image from "next/image";

export function Brand() {
  return (
    <>
      <Image src="/fintrack-mark.svg" alt="" aria-hidden="true" width={36} height={36} className="brand-mark" unoptimized />
      <span className="brand-wordmark">FinTrack<span className="brand-dot">.</span></span>
    </>
  );
}
