
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/post-card";
import { Mail, UserPlus, MoreHorizontal, Bookmark } from "lucide-react";
import Link from "next/link";
import { UserListItem } from "@/components/user-list-item";

const author = {
  name: "Emily White",
  avatar: "",
  coverImage: { id: "cover-1", imageUrl: "https://picsum.photos/seed/201/1600/400", description: "Abstract background", imageHint: "abstract background" },
  bio: "Designer, writer, and lifelong learner. Crafting stories that connect and inspire. Believer in the power of simplicity and thoughtful design.",
  followers: "23K",
  following: 450,
  posts: [
    {
      id: "3",
      title: "Mastering the Art of Modern Web Design",
      author: "Emily White",
      authorAvatar: "",
      date: "May 15, 2024",
      readTime: 12,
      image: "",
      snippet: "A comprehensive guide to the principles of contemporary web design, focusing on user experience, minimalism, and performance...",
      comments: 371,
      likes: 10,
      category: "Web Design"
    },
    {
      id: "7",
      title: "The Illusion of Choice in UI",
      author: "Emily White",
      authorAvatar: "",
      date: "Apr 28, 2024",
      readTime: 8,
      image: { id: "7-img", imageUrl: "https://picsum.photos/seed/107/600/400", description: "UI design sketch", imageHint: "design sketch" },
      snippet: "Exploring how designers guide user decisions through subtle cues and structured layouts. Are users ever truly in control?...",
      comments: 212,
      likes: 15,
      category: "UI/UX"
    },
  ],
  followersList: [
    { id: "f1", name: "Jane Doe", bio: "Frontend Developer", avatar:"" },
    { id: "f2", name: "John Appleseed", bio: "React Enthusiast", avatar:"" },
    { id: "f3", name: "Alex Johnson", bio: "Tech Lead @ Innovate Inc.", avatar:"" },
  ],
  followingList: [
    { id: "f4", name: "Samantha Green", bio: "UX Designer & Researcher", avatar:"" },
    { id: "f5", name: "Ben Carter", bio: "Full-Stack Developer", avatar: "" },
  ]
};

export default function AuthorProfilePage({ params }) {
  return (
    <div>
      <div className="relative h-48 md:h-64 w-full">
        <Image
          src={author.coverImage.imageUrl}
          alt={author.coverImage.description}
          layout="fill"
          objectFit="cover"
          data-ai-hint={author.coverImage.imageHint}
        />
      </div>
      <div className="container mx-auto px-4 -mt-16">
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
                <div className="flex items-end gap-4 mb-4">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background ring-2 ring-primary">
                        <AvatarImage src={author.avatar.imageUrl} alt={author.name} data-ai-hint={author.avatar.imageHint} />
                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div>
                        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">{author.name}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground my-1">
                            <Link href="#followers" className="hover:underline">{author.followers} Followers</Link>
                            <span>·</span>
                            <Link href="#following" className="hover:underline">{author.following} Following</Link>
                        </div>
                    </div>
                </div>

                 <Tabs defaultValue="home" className="mt-8">
                    <div className="flex justify-between items-center border-b">
                        <TabsList>
                            <TabsTrigger value="home">Home</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="followers">Followers</TabsTrigger>
                            <TabsTrigger value="following">Following</TabsTrigger>
                        </TabsList>
                        <div className="flex items-center gap-2">
                             <Button variant="outline"><Mail className="mr-2 h-4 w-4" />Message</Button>
                             <Button><UserPlus className="mr-2 h-4 w-4" />Follow</Button>
                        </div>
                    </div>
                    <TabsContent value="home" className="mt-6">
                    <div className="space-y-8">
                        {author.posts.map((post) => (
                        <PostCard key={post.id} {...post} />
                        ))}
                    </div>
                    </TabsContent>
                    <TabsContent value="about" id="about" className="mt-6">
                    <div className="prose prose-lg dark:prose-invert max-w-none bg-card p-8 rounded-lg">
                        <h2 className="font-headline">About {author.name}</h2>
                        <p>
                        {author.bio} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        </p>
                        <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                    </TabsContent>
                    <TabsContent value="followers" id="followers" className="mt-6">
                         <div className="space-y-4">
                            {author.followersList.map(user => (
                                <UserListItem key={user.id} {...user} />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="following" id="following" className="mt-6">
                        <div className="space-y-4">
                            {author.followingList.map(user => (
                                <UserListItem key={user.id} {...user} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <aside className="hidden lg:block col-span-4 space-y-8 pt-24">
                 <div className="p-4 rounded-lg bg-card border">
                     <Avatar className="w-16 h-16 mb-4">
                        <AvatarImage src={author.avatar.imageUrl} alt={author.name} data-ai-hint={author.avatar.imageHint} />
                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="font-bold text-lg font-headline">{author.name}</h2>
                    <p className="text-sm text-muted-foreground">{author.followers} Followers</p>
                    <p className="text-sm text-foreground/80 mt-4 mb-4">{author.bio}</p>
                     <div className="flex items-center gap-2">
                        <Button className="w-full"><UserPlus className="mr-2 h-4 w-4" />Follow</Button>
                        <Button variant="outline" size="icon"><Mail className="h-4 w-4" /></Button>
                    </div>
                </div>

                <section>
                    <h3 className="font-bold mb-4 font-headline">Reading list</h3>
                    <div className="space-y-4">
                        {[...author.posts].slice(0, 2).map(post => (
                             <div key={`rl-${post.id}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={post.authorAvatar.imageUrl} alt={post.author} data-ai-hint={post.authorAvatar.imageHint} />
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-semibold">{post.author}</p>
                                </div>
                                <Link href={`/post/${post.id}`} className="font-bold hover:text-primary transition-colors text-sm">{post.title}</Link>
                            </div>
                        ))}
                    </div>
                </section>
            </aside>
        </div>
      </div>
    </div>
  );
}

    