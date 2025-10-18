
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, Clapperboard, MessageCircle, MoreHorizontal, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const post = {
    id: "1",
    title: "I Cut React Component Re-Renders by 40%—Here’s the Surprising Fixes That Worked",
    author: "Jane Doe",
    authorAvatar: "",
    date: "May 20, 2024",
    readTime: 7,
    image: "",
    snippet: "From profiling nightmares to smooth, snappy UIs—a practical journey packed with real-world optimizations you can apply to...",
    comments: 118,
    likes: 6,
    category: "JavaScript"
  };

export default function PostPage({ params }) {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <article className="prose dark:prose-invert lg:prose-xl mx-auto">
                <h1 className="font-headline font-bold">{post.title}</h1>

                <div className="flex items-center gap-4 my-8">
                    <Link href={`/profile/${post.author.toLowerCase().replace(" ", "")}`} className="flex items-center gap-3">
                         <Avatar className="h-12 w-12">
                            <AvatarImage src={post.authorAvatar.imageUrl} alt={post.author} data-ai-hint={post.authorAvatar.imageHint} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-lg not-prose">{post.author}</p>
                            <p className="text-sm text-muted-foreground not-prose">
                                {post.readTime} min read · {post.date}
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-4 border-y py-4 my-8">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                            <ThumbsUp className="h-5 w-5" />
                        </Button>
                        <span className="font-bold">{post.likes}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                            <MessageCircle className="h-5 w-5" />
                        </Button>
                        <span className="font-bold">{post.comments}</span>
                    </div>
                     <div className="flex-grow" />
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                        <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </div>


                <div className="relative aspect-[16/9] w-full my-12">
                    <Image src={post.image.imageUrl} alt={post.image.description} layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint={post.image.imageHint} />
                </div>
                
                <p>{post.snippet}</p>
                
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                <h2>The Journey Begins</h2>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>

                <blockquote>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</blockquote>

                <h2>A Surprising Discovery</h2>
                <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>

                <div className="relative aspect-[16/9] w-full my-12">
                    <Image src="https://picsum.photos/seed/15/800/450" alt="Code on a screen" layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint="code screen" />
                </div>
                
                <h2>Conclusion</h2>
                <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
            </article>
        </div>
    )
}

    