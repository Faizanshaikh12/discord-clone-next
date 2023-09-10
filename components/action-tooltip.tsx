"use client"

import React from "react";
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from "./ui/tooltip";

interface ActionTooltipProps {
    label: string;
    children: React.ReactNode,
    side?: "top" | "right" | "left" | "bottom";
    align?: "start" | "center" | "end";
}

export const ActionTooltip = (props: ActionTooltipProps) => {
    const {label, children, side, align} = props;
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">{label.toLowerCase()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
