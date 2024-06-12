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
import { pollSchema, storypointsSchema } from "../_validation/pollSchema";
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
import { Expandable } from "@/app/_components/expandable";

interface SettingsInputProps {
  type: PollType;
  onTypeChange: (value: PollType) => void;
  form: UseFormReturn<
    z.infer<typeof pollSchema> | z.infer<typeof storypointsSchema>
  >;
}

const SettingsInput = ({ type, onTypeChange, form }: SettingsInputProps) => {
  const { control, setValue } = form;

  const blindVoting = useWatch({ control, name: "blindVoting" });
  const allowMultiChoice = useWatch({ control, name: "allowMultiChoice" });
  const allowChoiceCreation = useWatch({
    control,
    name: "allowChoiceCreation",
  });

  const handleTypeChange = useCallback(onTypeChange, [onTypeChange]);
  const toggleBlindVoting = useCallback(
    () => setValue("blindVoting", !blindVoting),
    [blindVoting, setValue],
  );
  const toggleMultiChoice = useCallback(
    () => setValue("allowMultiChoice", !allowMultiChoice),
    [allowMultiChoice, setValue],
  );
  const toggleChoiceCreation = useCallback(
    () => setValue("allowChoiceCreation", !allowChoiceCreation),
    [allowChoiceCreation, setValue],
  );

  const { formType, formDescription } = formSummary(type, form.getValues());
  return (
    <Accordion
      type="single"
      collapsible
      className="flex flex-col gap-3 rounded-md border border-input bg-card-background px-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex flex-col items-start justify-center text-left transition-all">
            <p>{formType}</p>
            {formDescription.length > 0 &&
              formDescription.map((desc, index) => (
                <p
                  key={index}
                  className="h-auto max-h-10 text-sm text-muted-foreground transition-all empty:max-h-0"
                >
                  {desc}
                </p>
              ))}
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
                  <SelectItem value="storypoints">Storypoints</SelectItem>
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

          <Expandable expanded={type === "poll"}>
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
            <FormItem className="flex flex-row items-center justify-between px-1 py-2">
              <div>
                <FormLabel className="text-base">Blind voting</FormLabel>
                <FormDescription>
                  Don&apos;t display votes until after poll has closed.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={blindVoting}
                  onCheckedChange={toggleBlindVoting}
                />
              </FormControl>
            </FormItem>
          </Expandable>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsInput;
