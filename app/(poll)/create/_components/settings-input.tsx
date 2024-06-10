"use client";

import React, { useCallback } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { pollSchema } from "../_validation/pollSchema";
import { z } from "zod";
import { formSummary } from "../_utils/formSummary";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PollType } from "@/types/pollTypes";

interface SettingsInputProps {
  form: UseFormReturn<z.infer<typeof pollSchema>>;
}

const SettingsInput = ({ form }: SettingsInputProps) => {
  const { control, setValue } = form;

  const type = useWatch({ control, name: "type" });
  const allowMultiChoice = useWatch({ control, name: "allowMultiChoice" });
  const allowChoiceCreation = useWatch({
    control,
    name: "allowChoiceCreation",
  });

  const handleTypeChange = useCallback(
    (value: PollType) => setValue("type", value),
    [setValue],
  );
  const toggleMultiChoice = useCallback(
    () => setValue("allowMultiChoice", !allowMultiChoice),
    [allowMultiChoice, setValue],
  );
  const toggleChoiceCreation = useCallback(
    () => setValue("allowChoiceCreation", !allowChoiceCreation),
    [allowChoiceCreation, setValue],
  );

  const { formType, formDescription } = formSummary(form.getValues());
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-card-background flex flex-col gap-3 rounded-md border border-input px-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex flex-col items-start justify-center text-left transition-all">
            <p>{formType}</p>
            <p className="h-auto max-h-10 text-sm text-muted-foreground transition-all empty:max-h-0">
              {formDescription.join(",")}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <FormItem className="flex flex-row items-center justify-between px-1 py-2">
            <div>
              <FormLabel className="text-base">Type</FormLabel>
              <FormDescription>Type of vote to create.</FormDescription>
            </div>
            <Select onValueChange={handleTypeChange} defaultValue={type}>
              <FormControl>
                <SelectTrigger className="max-w-48">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="poll">Poll</SelectItem>
                  <SelectItem value="storypoints" disabled>
                    Storypoints
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="flex flex-row items-center justify-between px-1 py-2">
            <div>
              <FormLabel className="text-base">Allow multi-choice</FormLabel>
              <FormDescription>
                Let users select multiple options.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={allowMultiChoice}
                onCheckedChange={toggleMultiChoice}
              />
            </FormControl>
          </FormItem>

          <FormItem className="flex flex-row items-center justify-between px-1 py-2">
            <div>
              <FormLabel className="text-base">
                Allow users to create options
              </FormLabel>
              <FormDescription>
                Let users create options if nothing fits
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={allowChoiceCreation}
                onCheckedChange={toggleChoiceCreation}
              />
            </FormControl>
          </FormItem>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsInput;
