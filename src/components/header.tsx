"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HomeIcon,
  UserIcon,
  GridIcon,
  BookIcon,
  ImageIcon,
  MapPinIcon,
} from "lucide-react";

const routes = {
  "/": { label: "Home", icon: HomeIcon },
  "/about": { label: "About", icon: UserIcon },
  "/work": { label: "Work", icon: GridIcon },
  "/blog": { label: "Blog", icon: BookIcon },
  "/gallery": { label: "Gallery", icon: ImageIcon },
};

interface TimeDisplayProps {
  timeZone: string;
  locale?: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timeZone,
  locale = "pl-PL",
}) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <span className="text-sm font-medium">{currentTime}</span>;
};

export const Header = () => {
  const pathname = usePathname();
  const location = "Warsaw, Poland"; // Example location

  return (
    <header className="fixed top-0 w-full p-4 flex justify-between items-center z-10 bg-transparent">
      <div className="hidden sm:flex items-center space-x-2">
        <MapPinIcon className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium ">{location}</span>
      </div>
      <Card className="flex space-x-4 p-2 border rounded-lg shadow-lg">
        {Object.entries(routes).map(([path, { label, icon: Icon }]) => (
          <Button
            key={path}
            variant={pathname === path ? "default" : "ghost"}
            className="flex items-center space-x-2"
            asChild
          >
            <a href={path}>
              <Icon className="h-5 w-5" />
              <span className="hidden sm:inline">{label}</span>
            </a>
          </Button>
        ))}
      </Card>
      <div className="hidden sm:block">
        <TimeDisplay timeZone="Europe/Warsaw" />
      </div>
    </header>
  );
};

export default Header;
