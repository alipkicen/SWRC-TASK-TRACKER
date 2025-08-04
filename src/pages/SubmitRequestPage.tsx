"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const samplingRequestSchema = z.object({
  productType: z.enum(["SSD", "Module"], { message: "Product Type is required" }),
  lotId: z.string().min(1, "Lot ID is required"),
  testType: z.string().min(1, "Test Type is required"),
  requestorName: z.string().min(1, "Requestor Name is required"),
  dateRequired: z.date({ required_error: "Date Required is required" }),
  comments: z.string().optional(),
  // Conditional fields for SSD
  qawrNumberSSD: z.string().optional(),
  qaProcessTypeSSD: z.string().optional(),
  marketSegmentSSD: z.string().optional(),
  asicNameSSD: z.string().optional(),
  formFactorSSD: z.string().optional(),
  assemblySiteSSD: z.string().optional(),
  densitySSD: z.string().optional(),
  pcbIdSSD: z.string().optional(),
  pcbRevSSD: z.string().optional(),
  sampleEtaSSD: z.string().optional(),
  qrDateSSD: z.string().optional(),
  // Conditional fields for Module
  qawrNumberModule: z.string().optional(),
  qaProcessTypeModule: z.string().optional(),
  designIdModule: z.string().optional(),
  dipModule: z.string().optional(),
  moduleSpeedModule: z.string().optional(),
  technodeModule: z.string().optional(),
  formFactorModule: z.string().optional(),
  densityModule: z.string().optional(),
  pcbIdModule: z.string().optional(),
  pcbRevModule: z.string().optional(),
  asmSiteModule: z.string().optional(),
  sampleEtaModule: z.string().optional(),
  qrDateModule: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.productType === "SSD") {
    if (!data.qawrNumberSSD) ctx.addIssue({ path: ["qawrNumberSSD"], message: "QAWR Number is required for SSD" });
    if (!data.qaProcessTypeSSD) ctx.addIssue({ path: ["qaProcessTypeSSD"], message: "QA Process Type is required for SSD" });
    // Add more SSD specific validations here as needed
  } else if (data.productType === "Module") {
    if (!data.qawrNumberModule) ctx.addIssue({ path: ["qawrNumberModule"], message: "QAWR Number is required for Module" });
    if (!data.qaProcessTypeModule) ctx.addIssue({ path: ["qaProcessTypeModule"], message: "QA Process Type is required for Module" });
    // Add more Module specific validations here as needed
  }
});

const SubmitRequestPage = () => {
  const form = useForm<z.infer<typeof samplingRequestSchema>>({
    resolver: zodResolver(samplingRequestSchema),
    defaultValues: {
      productType: undefined,
      lotId: "",
      testType: "",
      requestorName: "",
      comments: "",
    },
  });

  const productType = form.watch("productType");

  const onSubmit = (values: z.infer<typeof samplingRequestSchema>) => {
    console.log("Sampling Request Submitted:", values);
    toast.success("Sampling request submitted successfully!");
    form.reset(); // Reset form after submission
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Submit Sampling Request</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SSD">SSD</SelectItem>
                          <SelectItem value="Module">Module</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Lot ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="testType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Test Type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requestorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requestor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Requestor Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Required</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {productType === "SSD" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                  <h3 className="col-span-full text-lg font-semibold mb-2">SSD Specific Fields</h3>
                  <FormField
                    control={form.control}
                    name="qawrNumberSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QAWR Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter QAWR Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="qaProcessTypeSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QA Process Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter QA Process Type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marketSegmentSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Segment</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Market Segment" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="asicNameSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ASIC Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ASIC Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="formFactorSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Factor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Form Factor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assemblySiteSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assembly Site</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Assembly Site" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="densitySSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Density</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Density" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pcbIdSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PCB ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PCB ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pcbRevSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PCB Rev</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PCB Rev" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sampleEtaSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sample ETA</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Sample ETA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="qrDateSSD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QR Date</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter QR Date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {productType === "Module" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                  <h3 className="col-span-full text-lg font-semibold mb-2">Module Specific Fields</h3>
                  <FormField
                    control={form.control}
                    name="qawrNumberModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QAWR Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter QAWR Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="qaProcessTypeModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QA Process Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter QA Process Type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="designIdModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Design ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dipModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DIP</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter DIP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="moduleSpeedModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module Speed</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Module Speed" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="technodeModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technode</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Technode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="formFactorModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Factor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Form Factor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="densityModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Density</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Density" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pcbIdModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PCB ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PCB ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pcbRevModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PCB Rev</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PCB Rev" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="asmSiteModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ASM Site</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ASM Site" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sampleEtaModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sample ETA</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Sample ETA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="qrDateModule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QR Date</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter QR Date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any comments here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitRequestPage;