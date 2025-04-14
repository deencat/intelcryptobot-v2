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

const alertFormSchema = z.object({
  emailAlerts: z.boolean().default(true),
  emailAddress: z.string().email().optional().or(z.literal("")),
  tradingAlerts: z.boolean().default(true),
  riskAlerts: z.boolean().default(true),
  systemAlerts: z.boolean().default(true),
  marketAlerts: z.boolean().default(false),
  drawdownThreshold: z.coerce.number().min(1).max(50).optional(),
})

type AlertFormValues = z.infer<typeof alertFormSchema>

// This simulates saved data
const defaultValues: Partial<AlertFormValues> = {
  emailAlerts: true,
  emailAddress: "user@example.com",
  tradingAlerts: true,
  riskAlerts: true,
  systemAlerts: true,
  marketAlerts: false,
  drawdownThreshold: 15,
}

export function AlertPreferencesForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues,
  })

  // Watch the emailAlerts field to conditionally show/hide the email address input
  const emailAlertsEnabled = form.watch("emailAlerts")

  function onSubmit(data: AlertFormValues) {
    setIsLoading(true)
    
    // Simulate API request
    setTimeout(() => {
      console.log(data)
      toast.success("Alert preferences updated successfully")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Channels</h3>
          
          <FormField
            control={form.control}
            name="emailAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Email Alerts</FormLabel>
                  <FormDescription>
                    Receive alerts via email
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {emailAlertsEnabled && (
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Email address to receive alerts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Alert Types</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tradingAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Trading Alerts</FormLabel>
                    <FormDescription>
                      Position openings, closings and adjustments
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="riskAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Risk Alerts</FormLabel>
                    <FormDescription>
                      Risk level warnings and exposure alerts
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="systemAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>System Alerts</FormLabel>
                    <FormDescription>
                      System status and connection issues
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="marketAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Market Alerts</FormLabel>
                    <FormDescription>
                      Major market movements and events
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="drawdownThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drawdown Alert Threshold (%)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Send alert when drawdown exceeds this percentage
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Alert Preferences"}
        </Button>
      </form>
    </Form>
  )
} 