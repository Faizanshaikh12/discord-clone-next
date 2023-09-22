"use client"

import React, {useEffect, useState} from "react";
import {ChannelType, MemberRole} from "@prisma/client"
import {ServerWithMemberWithProfile} from "../../types";
import {ActionTooltip} from "../action-tooltip";
import {Plus, Settings} from "lucide-react";
import {useModal} from "../../hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: string;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMemberWithProfile;

}

export const ServerSection = ({label, sectionType, channelType, server, role}: ServerSectionProps) => {
    const {onOpen} = useModal();
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
            {role !== MemberRole.GUEST && sectionType === 'channels' && (
                <ActionTooltip label="Create Channel" side="top">
                    <button
                        onClick={() => onOpen("createChannel", {channelType})}
                        className="text-zinc-500 hover:bg-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                        <Plus className="w-4 h-4"/>
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === 'members' && (
                <ActionTooltip label="Manage Members" side="top">
                    <button
                        onClick={() => onOpen("members",  {server})}
                        className="text-zinc-500 hover:bg-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                        <Settings className="w-4 h-4"/>
                    </button>
                </ActionTooltip>
            )}
        </div>
    )
}