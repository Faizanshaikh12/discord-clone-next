import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../ui/dialog"
import {useModal} from "../../hooks/use-modal-store";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Check, Copy, RefreshCw} from "lucide-react";
import {useOrigin} from "../../hooks/use-origin";
import {useState} from "react";
import axios from "axios";

export const InviteModal = () => {
    const {type, onOpen, isOpen, onClose, data} = useModal();
    const origin = useOrigin();

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === 'invite'
    const {server} = data;

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => setCopied(false), 1000)
    }

    const onNewInviteCode = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen('invite', {server: response.data});
        } catch (err) {
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/700">Server Invite
                        Link</Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button size="icon" onClick={onCopy} disabled={isLoading}>
                            {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                        </Button>
                    </div>
                    <Button onClick={onNewInviteCode} disabled={isLoading} className="text-xs text-zinc-500 mt-4" variant="link" size="sm">
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}