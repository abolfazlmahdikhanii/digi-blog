import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const staffPicks = [
    { id: "sp1", title: "My Conversation with Marc Maron", author: "Barack Obama", authorAvatar: "" },
    { id: "sp2", title: "Go Deeper With What You Already Have", author: "Kim Witten, PhD", authorAvatar:"" },
    { id: "sp3", title: "Returning Home", author: "Roman Newell", authorAvatar:"" },
]

const recommendedTopics = ["Data Science", "Self Improvement", "Writing", "Relationships", "Politics", "Cryptocurrency", "Productivity"];

const whoToFollow = [
    { id: "wf1", name: "Amit Kumar", bio: "Amit Kumar is a frontend developer who love...", avatar: "" },
    { id: "wf2", name: "ProAndroidDev", bio: "The latest posts from Android Professionals an...", avatar:"" },
    { id: "wf3", name: "Mehekk Bassi", bio: "Product Designer | Mentor", avatar:"" },
]

export function RightSidebar() {
    return (
        <aside className="hidden lg:block w-[370px] border-l pl-9 pr-4 py-8 space-y-8">
            <section>
                <h3 className="font-bold mb-4 font-headline">Staff Picks</h3>
                <div className="space-y-7">
                    {staffPicks.map(pick => (
                        <div key={pick.id}>
                            <div className="flex items-center gap-2 mb-2.5">
                                <Avatar className="h-5.5 w-5.5">
                                    <AvatarImage src={pick.authorAvatar.imageUrl} alt={pick.author} data-ai-hint={pick.authorAvatar.imageHint} />
                                    <AvatarFallback>{pick.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-300">{pick.author}</p>
                            </div>
                            <Link href="#" className="font-bold hover:text-primary transition-colors text-sm">{pick.title}</Link>
                        </div>
                    ))}
                    <Link href="#" className="text-sm text-green-600 hover:text-green-700">See the full list</Link>
                </div>
            </section>

            <section className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-md relative">
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6">
                    <X className="h-4 w-4" />
                </Button>
                <h3 className="font-bold font-headline mb-2">Writing on DigiBlog</h3>
                <ul className="space-y-2 text-sm">
                    <li>Join our Writing 101 Webinar</li>
                    <li>Read tips & tricks</li>
                    <li>Get practical writing advice</li>
                </ul>
                <Button size="sm" className="rounded-full mt-4 bg-foreground text-background hover:bg-foreground/80">Start writing</Button>
            </section>

             <section>
                <h3 className="font-bold mb-4 font-headline">Recommended topics</h3>
                <div className="flex flex-wrap gap-2">
                    {recommendedTopics.map(topic => (
                        <Badge key={topic} variant="secondary" className="bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer py-2 px-2 rounded-full">{topic}</Badge>
                    ))}
                </div>
             </section>
             <section>
                <h3 className="font-bold mb-4 font-headline">Who to follow</h3>
                <div className="space-y-4.5">
                    {whoToFollow.map(user => (
                        <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                     <AvatarImage src={user.avatar.imageUrl} alt={user.name} data-ai-hint={user.avatar.imageHint}/>
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-sm mb-1">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate max-w-36">{user.bio}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full">Follow</Button>
                        </div>
                    ))}
                     <Link href="#" className="text-sm text-green-600 hover:text-green-700">See more suggestions</Link>
                </div>
             </section>
        </aside>
    )
}
