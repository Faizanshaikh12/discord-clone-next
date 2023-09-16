"use client"

import * as React from "react"
import {ThemeProvider as NextThemesProvider} from "next-themes"
import {ThemeProviderProps} from "next-themes/dist/types"
import {useEffect, useState} from "react";
import {CreateServerModal} from "../modals/create-server-modal";
import {InviteModal} from "../modals/invite-modal";

export function ModalProvider() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <>
            <CreateServerModal/>
            <InviteModal/>
        </>
    )
}
