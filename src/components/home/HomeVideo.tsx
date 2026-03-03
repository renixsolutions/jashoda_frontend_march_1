import React from "react";

export default function HomeVideo() {
  return (
    <section className="relative w-full bg-black pt-24 lg:pt-24">
      <div className="w-full overflow-hidden">
        <video
          className="w-full max-h-[400px] lg:max-h-[400px] object-cover"
          src="/hero-video.mp4"
          poster="/luxury-banner-dark.png"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Jashoda Jewels brand video"
        />
      </div>
    </section>
  );
}

