"use client"
import {ServerWithMemberWithProfile} from "../../types";
import {MemberRole} from "@prisma/client"
import {DropdownMenu,DropdownMenuTrigger} from "../ui/dropdown-menu";
import {ChevronDown} from "lucide-react";

interface ServerHeaderProps {
    server: ServerWithMemberWithProfile;
    role?: MemberRole;
}

export const ServerHeader = ({server, role}: ServerHeaderProps) => {
    const isAdmin  = role === MemberRole.ADMIN;
    const isModerator  = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200">
                    {server.name}
                </button>
                <ChevronDown className="h-5 w-5 ml-auto"/>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}