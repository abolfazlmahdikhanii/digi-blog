
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { UserPlus } from "lucide-react";



export function UserListItem({ id, name, bio, avatar }) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={avatar.imageUrl} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-bold text-lg">{name}</h3>
                    <p className="text-sm text-muted-foreground">{bio}</p>
                </div>
            </div>
            <Button variant="outline"><UserPlus className="mr-2 h-4 w-4"/>Follow</Button>
        </div>
    )
}

    