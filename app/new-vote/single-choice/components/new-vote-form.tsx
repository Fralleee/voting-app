"use client";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { database } from "@/lib/firebase";
import { ref, push } from "firebase/database";

interface Option {
  value: string;
}

interface FormValues {
  id: string;
  voteName: string;
  options: Option[];
}

const placeholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a Javascript method to reverse a string",
  "How to assemble your own PC?",
];

const NewVoteForm = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      voteName: "",
      options: [{ value: "" }],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "options",
  });

  const createVote: SubmitHandler<FormValues> = async data => {
    const { voteName, options } = data;
    const filteredOptions = options.filter(option => option.value.trim() !== "");

    const newVoteRef = ref(database, "votes");
    const newVote = await push(newVoteRef, {
      name: voteName,
      options: filteredOptions,
    });
    router.push(`/vote/${newVote.key}`);
  };

  return (
    <form className="flex flex-col gap-2 max-w-96 p-12" onSubmit={handleSubmit(createVote)}>
      <h1>Create a New Vote</h1>
      <input {...register("voteName")} className="text-red-500" placeholder="Vote Name" />

      <h2>Options</h2>
      {fields.map((item, index) => (
        <input key={item.id} {...register(`options.${index}.value` as const)} className="text-red-500" placeholder="Option Name" />
      ))}
      <button className="block mt-2 p-1 rounded-sm bg-slate-700" type="button" onClick={() => append({ value: "" })}>
        Add Option
      </button>
      <button className="block mt-2 p-2 rounded-sm bg-green-700" type="submit">
        Create Vote
      </button>
    </form>
  );
};

export default NewVoteForm;
