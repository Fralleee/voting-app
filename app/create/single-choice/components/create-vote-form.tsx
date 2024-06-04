"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { database } from "@/lib/firebase";
import { ref, push } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIdentity } from "@/app/vote/[id]/hooks/useIdentity";
import { VoteOption } from "@/types/vote";

const formSchema = z.object({
  voteDescription: z.string().min(2, {
    message: "You need to enter a vote description.",
  }),
  options: z.array(
    z.object({
      value: z.string().min(1, {
        message: "You need to enter an option.",
      }),
    })
  ),
});

const CreateVoteForm = () => {
  const router = useRouter();
  const deviceId = useIdentity();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voteDescription: "",
      options: [{ value: "" }, { value: "" }],
    },
  });
  const { fields, append } = useFieldArray({
    control: form.control,
    name: "options",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { voteDescription, options } = values;
    const filteredOptions = options.filter(option => option.value.trim() !== "") as VoteOption[];
    const newVoteRef = ref(database, "votes");
    const newVote = await push(newVoteRef, {
      name: voteDescription,
      options: filteredOptions,
      admin: deviceId,
      status: "open",
    });
    router.push(`/vote/${newVote.key}`);
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-3 w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mt-4">Create a New Vote</h1>
        <FormField
          control={form.control}
          name="voteDescription"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="What do you want to vote about?" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="mt-4">Options</h2>
        {fields.map((item, index) => (
          <FormField
            key={item.id}
            control={form.control}
            name={`options.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={index === 0 ? "Yes" : index === 1 ? "No" : ""} autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex gap-6 justify-end">
          <Button type="button" onClick={() => append({ value: "" })}>
            Add option
          </Button>
        </div>

        <Button className="mt-4" type="submit">
          Done
        </Button>
      </form>
    </Form>
  );
};

export default CreateVoteForm;
