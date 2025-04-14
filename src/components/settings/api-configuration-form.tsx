"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { toast } from "sonner"

const apiFormSchema = z.object({
  brokerApiKey: z.string().min(10, {
    message: "API key must be at least 10 characters.",
  }),
  brokerSecretKey: z.string().min(20, {
    message: "Secret key must be at least 20 characters.",
  }),
  deepseekApiKey: z.string().min(10, {
    message: "API key must be at least 10 characters.",
  }),
  isTestnet: z.boolean().default(true),
})

type ApiFormValues = z.infer<typeof apiFormSchema>

// This simulates saved data
const defaultValues: ApiFormValues = {
  brokerApiKey: "xxxxxxxxxxxxxxxxxxxxxxxxx",
  brokerSecretKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  deepseekApiKey: "xxxxxxxxxxxxxxxxxxxxxxxxx",
  isTestnet: true,
}

export function ApiConfigurationForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ApiFormValues>({
    resolver: zodResolver(apiFormSchema),
    defaultValues,
  })

  function onSubmit(data: ApiFormValues) {
    setIsLoading(true)
    
    // Simulate API request
    setTimeout(() => {
      console.log(data)
      toast.success("API settings updated successfully")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="brokerApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broker API Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter API key" {...field} />
              </FormControl>
              <FormDescription>
                Your exchange API key with trade permissions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="brokerSecretKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broker Secret Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter secret key" type="password" {...field} />
              </FormControl>
              <FormDescription>
                Your exchange API secret
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deepseekApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DeepSeek API Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter DeepSeek API key" {...field} />
              </FormControl>
              <FormDescription>
                API key for DeepSeek AI analysis
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isTestnet"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use Testnet</FormLabel>
                <FormDescription>
                  Trade on testnet for paper trading (recommended)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save API Settings"}
        </Button>
      </form>
    </Form>
  )
} 