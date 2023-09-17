import {MemberRole} from "@prisma/client"
import qs from "query-string";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../ui/dialog"
import {useModal} from "../../hooks/use-model-store";
import {
    Check,
    Copy,
    Gavel,
    Loader2,
    MoreVertical,
    RefreshCw,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion
} from "lucide-react";
import {useState} from "react";
import axios from "axios";
import {ServerWithMemberWithProfile} from "../../types";
import {ScrollArea} from "../ui/scroll-area";
import {UserAvatar} from "../user-avatar";
import {DropdownMenu, DropdownMenuPortal, DropdownMenuSub, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "../ui/dropdown-menu";
import {useRouter} from "next/navigation";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500"/>,
}

export const MembersModal = () => {
    const {type, onOpen, isOpen, onClose, data} = useModal();
    const router = useRouter();

    const [loadingId, setLoadingId] = useState('');

    const isModalOpen = isOpen && type === 'members'
    const {server} = data as { server: ServerWithMemberWithProfile };

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {serverId: server?.id}
            });

            const response = await axios.patch(url, {role});

            router.refresh();
            onOpen("members", {server: response.data});
            setLoadingId("")
        } catch (err) {
            console.log("error", err);
            setLoadingId("")
        } finally {
            setLoadingId("")

        }
    }

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            })

            const response = await axios.delete(url);

            router.refresh();
            onOpen("members", {server: response.data});
            setLoadingId("")
        } catch (err) {
            console.log("error", err);
            setLoadingId("")
        } finally {
            setLoadingId("")
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl}/>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId &&
                            loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="w-4 h-4 text-zinc-500"/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <ShieldQuestion className="w-4 h-4 mr-2"/>
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, "GUEST")}>
                                                            <Shield className="w-4 h-4 mr-2"/>
                                                            Guest
                                                            {member.role === "GUEST" && (
                                                                <Check className="w-4 h-4 ml-auto"/>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                                            <ShieldCheck className="w-4 h-4 mr-2"/>
                                                            Moderator
                                                            {member.role === "MODERATOR" && (
                                                                <Check className="w-4 h-4 ml-auto"/>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                <Gavel className='w-4 h-4 mr-2'/>
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="w-4 h-4 animate-spin text-zinc-500 ml-auto"/>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}