import {currentProfile} from "../../lib/current-profile";
import {redirect} from "next/navigation";
import {db} from "../../lib/db";
import {Actions} from "./actions";

export const Sidebar = async () => {
    const profile = await currentProfile();

    if (!profile) return redirect('/');

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    return (
        <div className="space-y-4 flex flex-col dark:bg-[#1E1F22] h-full text-primary w-full py-3">
            <Actions/>
        </div>
    )
}
