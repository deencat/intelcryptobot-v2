"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'

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
import { freqtradeConfig } from "@/lib/env"

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
  useFreqtrade: z.boolean().default(false),
  freqtradeUrl: z.string().optional(),
  freqtradeUsername: z.string().optional(),
  freqtradePassword: z.string().optional(),
})

type ApiFormValues = z.infer<typeof apiFormSchema>

// This simulates saved data
const defaultValues: Partial<ApiFormValues> = {
  brokerApiKey: "xxxxxxxxxxxxxxxxxxxxxxxxx",
  brokerSecretKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  deepseekApiKey: "xxxxxxxxxxxxxxxxxxxxxxxxx",
  isTestnet: true,
  useFreqtrade: true,
  freqtradeUrl: freqtradeConfig.apiUrl,
  freqtradeUsername: freqtradeConfig.username,
  freqtradePassword: freqtradeConfig.password,
}

// Mock saved settings for Freqtrade - would be stored in a DB or localStorage in a real app
let savedFreqtradeSettings = {
  url: freqtradeConfig.apiUrl,
  username: freqtradeConfig.username,
  password: freqtradeConfig.password,
  enabled: true
}

export function ApiConfigurationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<ApiFormValues>({
    resolver: zodResolver(apiFormSchema),
    defaultValues,
  })

  function onSubmit(data: ApiFormValues) {
    setIsLoading(true)
    
    // Save Freqtrade settings
    const freqtradeChanged = 
      data.useFreqtrade !== savedFreqtradeSettings.enabled ||
      data.freqtradeUrl !== savedFreqtradeSettings.url ||
      data.freqtradeUsername !== savedFreqtradeSettings.username ||
      data.freqtradePassword !== savedFreqtradeSettings.password;
    
    if (freqtradeChanged) {
      savedFreqtradeSettings = {
        url: data.freqtradeUrl || "",
        username: data.freqtradeUsername || "",
        password: data.freqtradePassword || "",
        enabled: data.useFreqtrade || false
      };
      
      // In a real app, we would update environment variables or a settings store
      // For now, we'll just reload the page to reinitialize the freqtradeService
      setTimeout(() => {
        toast.success("API settings updated successfully");
        toast.info("Reconnecting to Freqtrade...");
        router.refresh(); // Refresh the page to reinitialize the service
      }, 1000);
    } else {
      // Simulate API request
      setTimeout(() => {
        toast.success("API settings updated successfully");
        setIsLoading(false);
      }, 1000);
    }
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
        
        <FormField
          control={form.control}
          name="useFreqtrade"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use Freqtrade</FormLabel>
                <FormDescription>
                  Connect to Freqtrade for advanced trading features
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        {form.watch("useFreqtrade") && (
          <>
            <FormField
              control={form.control}
              name="freqtradeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freqtrade API URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Freqtrade API URL" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    The URL to your Freqtrade API (e.g., http://localhost:8080/api/v1)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="freqtradeUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freqtrade Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Freqtrade username" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Username for Freqtrade API authentication
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="freqtradePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freqtrade Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Freqtrade password" type="password" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Password for Freqtrade API authentication
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save API Settings"}
        </Button>
      </form>
    </Form>
  )
} 