"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { UseFormReturn, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { pollSchema } from "../_validation/pollSchema";

interface OptionsInputProps {
  form: UseFormReturn<z.infer<typeof pollSchema>>;
}

export const OptionsInput = ({ form }: OptionsInputProps) => {
  const { control } = form;
  const { fields, append } = useFieldArray({
    control,
    name: "options",
  });
  const options = useWatch({ control, name: "options" });

  useEffect(() => {
    if (
      options &&
      options.length > 0 &&
      options[options.length - 1]?.value !== ""
    ) {
      append({ value: "" }, { shouldFocus: false });
    }
  }, [options, append]);

  return fields.map((item, index) => (
    <FormField
      key={item.id}
      control={control}
      name={`options.${index}.value`}
      render={({ field, fieldState: { invalid } }) => (
        <FormItem>
          <FormControl>
            <Input
              placeholder={index === 0 ? "Yes" : index === 1 ? "No" : ""}
              autoComplete="off"
              {...field}
              className={
                invalid
                  ? "border-red-700 focus-visible:border-input focus-visible:ring-red-700"
                  : ""
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ));
};
