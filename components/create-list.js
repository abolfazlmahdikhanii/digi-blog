import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Label } from "./ui/label";
const CreateList = ({ children, listRefetch }) => {
  const user = useAuth();
  const [isPrivate, setIsPrivate] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAddDescription, setIsAddDescription] = useState(false);
  const [dis, setDis] = useState("");
  const [listName, setListName] = useState("");
  const handleCreateNewList = async (e) => {
    e.preventDefault();
    try {
      if (!user){
         toast.warning("You Should Signin!")
         return
      };
      if (!listName) {
        toast.warning("You Should Fill Name!");
        return;
      }
      const res = await fetch(`/api/save-lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: listName,
          description: dis,
          isPrivate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add list");
      }
      listRefetch();
      setListName("");
      setIsPrivate(false);
      setDis("");
      setIsOpenModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            Create new list
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-6">
          <Input
            placeholder="List name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="text-lg font-semibold"
            max={60}
          />
          <div className="mt-7 mb-7">
            {!isAddDescription ? (
              <button
                className="text-blue-500"
                onClick={() => setIsAddDescription(true)}
              >
                Add a description
              </button>
            ) : (
              <Textarea
                placeholder="Description"
                className=" min-h-[20px] shadow-none  w-full  resize-none  leading-[1.6] text-lg font-semibold"
                value={dis}
                onChange={(e) => setDis(e.target.value)}
                max={200}
              />
            )}
          </div>
          <div className="flex items-center space-x-2 ">
            <Checkbox
              id="private"
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked)}
            />
            <Label htmlFor="private">Make it private</Label>
          </div>
        </div>
        <DialogFooter className="justify-end gap-2 py-5">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleCreateNewList}
              className="rounded-full bg-green-600 hover:bg-green-700 text-white"
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateList;
