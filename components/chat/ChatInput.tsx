"use client";

import { AiOutlinePlus } from "react-icons/ai";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { primary } from "@/app/fonts";
import { useModal } from "@/hooks/useModalStore";
import { EmojiPicker } from "@/components/EmojiPicker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  name: string;
  apiUrl: string;
  type: "conversation" | "channel";
  query: Record<string, any>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ name, apiUrl, type, query }: ChatInputProps) => {
  const router = useRouter();

  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-400 hover:bg-zinc-200 transition rounded-full flex items-center justify-center"
                  >
                    <AiOutlinePlus className="text-primary" />
                  </button>
                  <Input
                    disabled={isLoading}
                    placeholder={`Send a message ${
                      type === "conversation" ? `to ${name}` : `in #${name}`
                    } `}
                    {...field}
                    className={cn(
                      "px-14 py-6 bg-tertiary/40 hover:bg-tertiary/70 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200",
                      primary.className
                    )}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
