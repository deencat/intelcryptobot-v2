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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { toast } from "sonner"

const uiFormSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
  dashboardLayout: z.enum(["default", "compact", "expanded"]),
  showPerformanceWidget: z.boolean().default(true),
  showActivePositionsWidget: z.boolean().default(true),
  showRiskMetricsWidget: z.boolean().default(true),
  showSystemStatusWidget: z.boolean().default(true),
  showRecentAlertsWidget: z.boolean().default(true),
  enableAnimations: z.boolean().default(true),
})

type UiFormValues = z.infer<typeof uiFormSchema>

// This simulates saved data
const defaultValues: Partial<UiFormValues> = {
  theme: "system",
  dashboardLayout: "default",
  showPerformanceWidget: true,
  showActivePositionsWidget: true,
  showRiskMetricsWidget: true,
  showSystemStatusWidget: true,
  showRecentAlertsWidget: true,
  enableAnimations: true,
}

export function UiPreferencesForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UiFormValues>({
    resolver: zodResolver(uiFormSchema),
    defaultValues,
  })

  function onSubmit(data: UiFormValues) {
    setIsLoading(true)
    
    // Simulate API request
    setTimeout(() => {
      console.log(data)
      toast.success("UI preferences updated successfully")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select your preferred theme mode
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dashboardLayout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dashboard Layout</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="expanded">Expanded</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your dashboard layout style
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Dashboard Widgets</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="showPerformanceWidget"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Performance Chart</FormLabel>
                    <FormDescription>
                      Show performance chart on dashboard
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="showActivePositionsWidget"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Positions</FormLabel>
                    <FormDescription>
                      Show active positions on dashboard
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="showRiskMetricsWidget"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Risk Metrics</FormLabel>
                    <FormDescription>
                      Show risk metrics on dashboard
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="showSystemStatusWidget"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>System Status</FormLabel>
                    <FormDescription>
                      Show system status on dashboard
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="showRecentAlertsWidget"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Recent Alerts</FormLabel>
                    <FormDescription>
                      Show recent alerts on dashboard
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="enableAnimations"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Enable Animations</FormLabel>
                <FormDescription>
                  Enable UI animations and transitions
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save UI Preferences"}
        </Button>
      </form>
    </Form>
  )
} 