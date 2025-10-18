
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h1 className="text-4xl font-bold font-headline mb-8">Notifications</h1>
      <Tabs defaultValue="all">
        <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none">
          <TabsTrigger
            value="all"
            className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 border-foreground"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="responses"
            className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 border-foreground"
          >
            Responses
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <p className="text-muted-foreground">You're all caught up.</p>
        </TabsContent>
        <TabsContent value="responses" className="mt-6">
          <p className="text-muted-foreground">You have no responses yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
