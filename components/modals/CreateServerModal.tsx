"use client";

import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { FileUpload } from "@/components/FileUpload";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { primary, bold } from "@/app/fonts";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalStore";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().min(1, { message: "Server Thumbnail is required." }),
});

export const CreateServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "createServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`bg-primary rounded-lg overflow-hidden ${primary.className}`}
      >
        <DialogHeader className="pt-6 px-6">
          <DialogTitle
            className={`text-3xl text-secondary text-center ${bold.className}`}
          >
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Give your server a personality with a name and an image.It can
            always be changed later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`uppercase text-zinc-400 ${bold.className}`}
                    >
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50  border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className={`${bold.className} uppercase tracking-wide`}
                    />
                  </FormItem>
                )}
              />
            </div>
            <hr />
            <DialogFooter>
              <Button disabled={isLoading}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
