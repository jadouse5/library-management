"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { Input } from "@/components/ui/input";
import { DVD } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  director: z.string().min(1, "Director is required"),
  duration: z.string().refine(
    (val) => {
      const duration = parseInt(val);
      return !isNaN(duration) && duration > 0;
    },
    {
      message: "Please enter a valid duration in minutes",
    }
  ),
  releaseYear: z.string().refine(
    (val) => {
      const year = parseInt(val);
      return !isNaN(year) && year > 1900 && year <= new Date().getFullYear();
    },
    {
      message: "Please enter a valid year",
    }
  ),
});

type AddDVDDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (dvd: DVD) => void;
};

export function AddDVDDialog({ open, onOpenChange, onAdd }: AddDVDDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      director: "",
      duration: "",
      releaseYear: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newDVD = new DVD(
      Date.now().toString(),
      values.title,
      values.director,
      parseInt(values.duration),
      parseInt(values.releaseYear),
      false
    );
    onAdd(newDVD);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New DVD</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter DVD title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="director"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Director</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter director name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter duration in minutes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter release year"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add DVD</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}