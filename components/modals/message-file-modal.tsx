"use client"
import * as z from "zod"
import qs from "query-string"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form"
import {Button} from "../ui/button";
import {FileUpload} from "../file-upload";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useModal} from "../../hooks/use-modal-store";

const formSchema = z.object({
    fileUrl: z.string().min(1, {message: 'Server image is required.'})
})

export const MessageFileModal = () => {
    const {type, isOpen, data, onClose} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "messageFile";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ''
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: data.apiUrl || "",
                query: data.query
            })
            await axios.post(url, {...values, content: values.fileUrl});
            form.reset();
            router.refresh();
            handleClose()
        } catch (err) {
            console.log("Server Submit Error: ", err)
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add a attachment
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-center">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}