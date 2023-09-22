import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog"
import {useModal} from "../../hooks/use-modal-store";
import {Button} from "../ui/button";
import {useState} from "react";
import axios from "axios";
import {router} from "next/client";
import {useRouter} from "next/navigation";

export const DeleteServerModal = () => {
    const {type, isOpen, onClose, data} = useModal();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === 'deleteServer'
    const {server} = data;

    const onDeleteServer = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            onClose();
            router.refresh();
            router.push('/');
        } catch (e) {
            console.log("error", e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <span
                        className="text-indigo-500 font-semibold">{server?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            variant="ghost"
                            onClick={onClose}
                        >Cancel</Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onDeleteServer}
                        >Confirm</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}