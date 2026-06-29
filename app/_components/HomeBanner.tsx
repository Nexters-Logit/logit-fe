"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBanners } from "@/app/_hooks/useBanners";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function HomeBanner() {
  const { data: banners } = useBanners();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!api || !banners || banners.length <= 1) return;
    const timer = setInterval(() => api.scrollNext(), 4000);
    return () => clearInterval(timer);
  }, [api, banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              {banner.link_url ? (
                banner.link_url.startsWith("/") ? (
                  <Link href={banner.link_url}>
                    <img src={banner.image_url} alt="배너" className="w-full h-auto" />
                  </Link>
                ) : (
                  <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                    <img src={banner.image_url} alt="배너" className="w-full h-auto" />
                  </a>
                )
              ) : (
                <img
                  src={banner.image_url}
                  alt="배너"
                  className="w-full h-auto"
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
