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

const botFormSchema = z.object({
  maxPositions: z.coerce.number().min(1).max(20),
  maxLeverage: z.coerce.number().min(1).max(100),
  riskPerTrade: z.coerce.number().min(0.1).max(10),
  strategy: z.string({
    required_error: "Please select a strategy",
  }),
  autoRebalance: z.boolean().default(false),
  enableHedging: z.boolean().default(false),
})

type BotFormValues = z.infer<typeof botFormSchema>

// This simulates saved data
const defaultValues: Partial<BotFormValues> = {
  maxPositions: 5,
  maxLeverage: 10,
  riskPerTrade: 1,
  strategy: "momentum",
  autoRebalance: true,
  enableHedging: false,
}

export function BotConfigurationForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BotFormValues>({
    resolver: zodResolver(botFormSchema),
    defaultValues,
  })

  function onSubmit(data: BotFormValues) {
    setIsLoading(true)
    
    // Simulate API request
    setTimeout(() => {
      console.log(data)
      toast.success("Bot settings updated successfully")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="strategy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trading Strategy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                  <SelectItem value="breakout">Breakout</SelectItem>
                  <SelectItem value="trend-following">Trend Following</SelectItem>
                  <SelectItem value="machine-learning">Machine Learning</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The primary strategy the bot will use for trading
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="maxPositions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Positions</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Maximum number of open positions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxLeverage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Leverage</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Maximum leverage per position
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="riskPerTrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Per Trade (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>
                  Maximum risk per trade as % of equity
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="autoRebalance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Auto-Rebalance</FormLabel>
                  <FormDescription>
                    Automatically rebalance portfolio based on risk limits
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="enableHedging"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enable Hedging</FormLabel>
                  <FormDescription>
                    Allow the bot to take hedge positions in volatile markets
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Bot Settings"}
        </Button>
      </form>
    </Form>
  )
} 