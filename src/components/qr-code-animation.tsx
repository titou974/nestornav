"use client";

import Lottie from "lottie-react";
import qrCodeAnimation from "@/assets/qrscan.json";

interface QrCodeAnimationProps {
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export function QrCodeAnimation({
  className = "w-80 h-80 mx-auto",
  autoPlay = true,
  loop = false,
}: QrCodeAnimationProps) {
  return (
    <Lottie
      animationData={qrCodeAnimation}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
    />
  );
}
