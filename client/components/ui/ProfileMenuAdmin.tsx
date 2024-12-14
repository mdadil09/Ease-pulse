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
  BriefcaseMedical,
  CalendarCheck2,
  CircleUserRound,
  LayoutDashboard,
  PowerIcon,
} from "lucide-react";

interface userBadgeType {
  id: any;
  userBadge: string;
  handleLogOut: () => void;
  user: { image: any };
}

const ProfileMenuAdmin = ({
  userBadge,
  id,
  handleLogOut,
  user,
}: userBadgeType) => {
  return (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-green-400 text-16-regular">
              {userBadge}
            </AvatarFallback>
          </Avatar>
        </MenubarTrigger>
        <MenubarContent className="bg-dark-200 border-none">
          <MenubarItem>
            <LayoutDashboard className="text-16-regular mr-4" />{" "}
            <Link
              href={`/admin?id=${id}`}
              className="text-16-regular"
              prefetch={true}
            >
              Dashboard
            </Link>
          </MenubarItem>
          <MenubarItem>
            <CircleUserRound className="text-16-regular mr-4" />
            <Link
              href={`/admin/profile?id=${id}`}
              className="text-16-regular"
              prefetch={true}
            >
              Profile
            </Link>
          </MenubarItem>
          <MenubarItem>
            <BriefcaseMedical className="text-16-regular mr-4" />
            <Link
              href={`/admin/doctors?id=${id}`}
              className="text-16-regular"
              prefetch={true}
            >
              Doctors
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

export default ProfileMenuAdmin;
