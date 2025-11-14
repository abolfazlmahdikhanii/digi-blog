import { FileText, Rss } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

export function SearchPreview({ query, results }) {
  if (!query) return null;


  return (
    <div className="px-[10px] space-y-2">
      {results&&results?.users.length > 0 && (
        <div>
          <h4 className="text-xs font-light text-muted-foreground uppercase tracking-wider pb-2.5 mb-2 border-b">
            People
          </h4>
          <div className="space-y-2">
            {results&&results?.users.map((person) => (
              <Link
                href={`@${person.username}`}
                key={person._id}
                className="flex items-center gap-3 p-2 -mx-2 rounded-md hover:bg-accent"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={person.profileImage} alt={person.name} />
                  <AvatarFallback className={"text-xs capitalize"}>
                    {person.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{person.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {results&&results?.posts.length > 0 && (
        <div>
          <h4 className="text-xs font-light text-muted-foreground uppercase tracking-wider pb-2.5  mb-2 border-b">
            Stories
          </h4>
          <div className="space-y-0.5">
            {results&&results?.posts.map((post) => (
              <Link
                href="#"
                key={post._id}
                className="flex items-center gap-3 p-2 -mx-2 rounded-md hover:bg-accent"
              >
                <Avatar className="h-6 w-6 rounded-sm">
                  <AvatarImage src={post.postCover} alt={post.title} />
                  <AvatarFallback className={"text-xs"}>
                    {post.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm truncate">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {results&&results?.topics.length > 0 && (
        <div>
          <h4 className="text-xs font-light text-muted-foreground uppercase tracking-wider pb-2.5 mb-2 border-b">
            Topics
          </h4>
          <div className="space-y-0.5">
            {results&&results.topics.map((topic) => (
              <Link
                href="#"
                key={topic._id}
                className="flex items-center gap-3 p-2 -mx-2 rounded-md hover:bg-accent"
              >
                <FileText className="w-4 h-4 text-muted-foreground" />

                <span className="font-medium text-sm capitalize">{topic.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!results||results.users.length === 0 &&
        results.posts.length === 0 &&
        results.topics.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No results for &quot;{query}&quot;
          </p>
        )}
    </div>
  );
}
