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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { toast } from "sonner"

const freqtradeFormSchema = z.object({
  strategy: z.string().min(1, { message: "Strategy is required." }),
  stake_currency: z.string().min(1, { message: "Stake currency is required." }),
  stake_amount: z.number().min(1, { message: "Stake amount must be at least 1." }),
  max_open_trades: z.number().min(1, { message: "Max open trades must be at least 1." }),
  dry_run: z.boolean().default(true),
  enable_protections: z.boolean().default(true),
  timeframe: z.string().min(1, { message: "Timeframe is required." }),
});

type FreqtradeFormValues = z.infer<typeof freqtradeFormSchema>

// Mock data for strategies, currencies and timeframes
const strategies = [
  "SampleStrategy",
  "BollingerBands",
  "MACrossover",
  "DeepSeekAI",
  "RSIDivergence",
  "SupportResistance",
];

const currencies = ["USDT", "USD", "BTC", "ETH"];
const timeframes = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"];

// This simulates saved config
const defaultValues: Partial<FreqtradeFormValues> = {
  strategy: "SampleStrategy",
  stake_currency: "USDT",
  stake_amount: 30,
  max_open_trades: 3,
  dry_run: true,
  enable_protections: true,
  timeframe: "5m",
}

export function FreqtradeConfigForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FreqtradeFormValues>({
    resolver: zodResolver(freqtradeFormSchema),
    defaultValues,
  })

  function onSubmit(data: FreqtradeFormValues) {
    setIsLoading(true)
    
    // Simulate API request
    setTimeout(() => {
      console.log(data)
      toast.success("Freqtrade configuration updated successfully")
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
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the trading strategy for the bot
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stake_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stake Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Base currency for trading
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeframe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeframes.map((timeframe) => (
                      <SelectItem key={timeframe} value={timeframe}>{timeframe}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Candle timeframe for analysis
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stake_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stake Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    step="1"
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  Amount per trade
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="max_open_trades"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Open Trades</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    step="1"
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  Maximum concurrent open positions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dry_run"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Dry Run Mode</FormLabel>
                  <FormDescription>
                    Simulate trades without risking real funds
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="enable_protections"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enable Protections</FormLabel>
                  <FormDescription>
                    Enable trade protections to reduce risk
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Freqtrade Config"}
          </Button>
          
          <Button type="button" variant="outline" disabled={isLoading}>
            Download Config
          </Button>
        </div>
      </form>
    </Form>
  )
} 