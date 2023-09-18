"use client"

import {Server, Member, Profile, MemberRole, Channel} from "@prisma/client"
import {ServerWithMemberWithProfile} from "../../types";
import {Edit, Hash, Lock, Mic, Plus, ShieldAlert, ShieldCheck, Trash, Video} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {cn} from "../../lib/utils";
import {ActionTooltip} from "../action-tooltip";
import {UserAvatar} from "../user-avatar";

interface ServerMemberProps {
    member: Member & { profile: Profile },
    server: Server,
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>,
}

export const ServerMember = ({server, member}: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    return (
        <button
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full" ,
                "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar src={member.profile.imageUrl} className="h-8 w-8 md:h-8 md:w-8"/>
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600",
                "dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params.memberId === member.id && "text-primary dark:group-hover:text-white dark:bg-zinc-200"
            )}>
                {member.profile.name}
            </p>
            {icon}
        </button>
    )
}