import {currentProfile} from "../../../../../../../lib/current-profile";
import {redirectToSignIn} from "@clerk/nextjs";
import {db} from "../../../../../../../lib/db";
import {redirect} from "next/navigation";
import {ChatHeader} from "../../../../../../../components/chat/chat-header";
import {ChatInput} from "../../../../../../../components/chat/chat-input";
import {ChatMessages} from "../../../../../../../components/chat/chat-messages";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIdPage = async ({params}: ChannelIdPageProps) => {

    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    });

    if (!channel || !member) redirect('/');

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
            serverId={params.serverId}
            name={channel?.name}
            type={"channel"}
            />
            <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type={"channel"}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
                serverId: params.serverId,
                channelId: params.channelId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
            />
            <ChatInput
            type="channel"
            name={channel.name}
            apiUrl="/api/socket/messages"
            query={{
                serverId: params.serverId,
                channelId: params.channelId,
            }}
            />
        </div>
    )
}

export default ChannelIdPage