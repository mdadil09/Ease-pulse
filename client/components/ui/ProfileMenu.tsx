"use client";

import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Link from "next/link";
import {
  CalendarCheck2,
  CircleUserRound,
  LayoutDashboard,
  PowerIcon,
} from "lucide-react";

interface userBadgeType {
  id: string;
  userBadge: string;
  handleLogOut: () => void;
  user: { profilePicture: any };
}

const ProfileMenu = ({ userBadge, id, handleLogOut, user }: userBadgeType) => {
  return (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="bg-green-400 text-16-regular">
              {userBadge}
            </AvatarFallback>
          </Avatar>
        </MenubarTrigger>
        <MenubarContent className="bg-dark-200 border-none">
          <MenubarItem>
            <LayoutDashboard className="text-16-regular mr-4" />{" "}
            <Link
              href={`/user?id=${id}`}
              className="text-16-regular"
              shallow={true}
            >
              Dashboard
            </Link>
          </MenubarItem>
          <MenubarItem>
            <CircleUserRound className="text-16-regular mr-4" />
            <Link
              href={`/user/profile?id=${id}`}
              className="text-16-regular"
              shallow={true}
            >
              Profile
            </Link>
          </MenubarItem>
          <MenubarItem>
            <CalendarCheck2 className="text-16-regular mr-4" />
            <Link
              href={`/patients/${id}/new-appointment`}
              className="text-16-regular"
              shallow={true}
            >
              Book appointment
            </Link>
          </MenubarItem>
          {/* <MenubarSeparator /> */}
          <MenubarItem className="cursor-pointer">
            <PowerIcon className="text-16-regular mr-4" />{" "}
            <p className="text-16-regular" onClick={handleLogOut}>
              Log out
            </p>{" "}
          </MenubarItem>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default ProfileMenu;
