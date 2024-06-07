import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type NewOptionFormData,
  newOptionSchema,
} from "@/app/(vote)/create/_validation/optionSchema";

export const NewOption = ({ onAdd }: { onAdd: (value: string) => void }) => {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewOptionFormData>({
    resolver: zodResolver(newOptionSchema),
  });

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  function handleOnSubmit(data: NewOptionFormData) {
    setOpen(false);
    onAdd(data.value);
    reset();
  }

  return (
    <Drawer noBodyStyles open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add option</Button>
      </DrawerTrigger>
      <DrawerContent>
        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="mx-auto flex w-full max-w-sm flex-col gap-3 pb-16 pt-8"
        >
          <DrawerHeader className="p-0">
            <DrawerTitle>Add option</DrawerTitle>
            <DrawerDescription>
              Nothing tickling your fancy? Throw in your wild card.
            </DrawerDescription>
          </DrawerHeader>
          <Input className="w-full" autoComplete="off" {...register("value")} />
          {errors.value && errors.value.message ? (
            <p className="text-red-500">{errors.value.message}</p>
          ) : null}
          <DrawerFooter className="mt-6 p-0">
            <Button type="submit">Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
