import Link from "next/link";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post-card";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const posts = [
  {
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
  },
  {
    id: "2",
    title: "6 React JS MCP Servers & Frameworks I Use to Build React Apps 5x Faster",
    author: "John Appleseed",
    authorAvatar: "",
    date: "May 18, 2024",
    readTime: 5,
    image: "",
    snippet: "If you are a React developer or an aspiring one, you need to see these MCP servers and frameworks that are gaining traction in...",
    comments: 149,
    likes: 4,
    category: "React"
  },
  {
    id: "3",
    title: "React 19.1: What Really Changes and Why Developers Are Going to Love It",
    author: "Emily White",
    authorAvatar: "",
    date: "May 15, 2024",
    readTime: 12,
    image: "",
    snippet: "You can read the full story for free by clicking here",
    comments: 371,
    likes: 10,
    category: "React"
  },
  {
    id: "4",
    title: "TypeScript 6.0: The Biggest Changes We Have So Far",
    author: "Alex Johnson",
    authorAvatar: "",
    date: "May 12, 2024",
    readTime: 8,
    image: "",
    snippet: "Here are the game-changing features in TypeScript 6.0 that are changing the way we build React, Next.js, and full-stack...",
    comments: 159,
    likes: 7,
    category: "TypeScript"
  },
  {
    id: "5",
    title: "My Go-To Pattern for Clean React Components",
    author: "Samantha Green",
    authorAvatar: "",
    date: "May 10, 2024",
    readTime: 6,
    image: "",
    snippet: "How I Stopped Writing Spaghetti JSX and Started Sleeping Better at Night",
    comments: 380,
    likes: 8,
    category: "React"
  },
];

export default function Home() {
  return (
    <div className="w-11/12 mx-auto px-4">
        <div className="flex justify-center border-b mb-8">
            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <Link href="#" className="text-foreground font-semibold border-b-2 border-foreground pb-3">For you</Link>
                <Link href="#" className="pb-3">Featured</Link>
            </div>
        </div>

      <main>
        <div className="space-y-12">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              author={post.author}
              authorAvatar={post.authorAvatar}
              date={post.date}
              readTime={post.readTime}
              image={post.image}
              title={post.title}
              snippet={post.snippet}
              comments={post.comments}
              likes={post.likes}
              category={post.category}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
