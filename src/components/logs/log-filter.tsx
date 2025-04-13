"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface LogFilterProps {
  onFilterChange: (filters: {
    type: string[];
    search: string;
    timeRange: string;
  }) => void;
}

const typeOptions = [
  { value: "TradeExecution", label: "Trade Execution" },
  { value: "SystemEvent", label: "System Event" },
  { value: "Error", label: "Error" },
];

const timeRangeOptions = [
  { value: "1h", label: "Last Hour" },
  { value: "6h", label: "Last 6 Hours" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "all", label: "All Time" },
];

export function LogFilter({ onFilterChange }: LogFilterProps) {
  const [typeOpen, setTypeOpen] = useState(false);
  const [timeRangeOpen, setTimeRangeOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTypeSelect = (value: string) => {
    setSelectedTypes((current) => {
      const updated = current.includes(value)
        ? current.filter((type) => type !== value)
        : [...current, value];
      
      onFilterChange({
        type: updated,
        search: searchQuery,
        timeRange: selectedTimeRange,
      });
      
      return updated;
    });
  };

  const handleTimeRangeSelect = (value: string) => {
    setSelectedTimeRange(value);
    setTimeRangeOpen(false);
    
    onFilterChange({
      type: selectedTypes,
      search: searchQuery,
      timeRange: value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    onFilterChange({
      type: selectedTypes,
      search: e.target.value,
      timeRange: selectedTimeRange,
    });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedTimeRange("all");
    setSearchQuery("");
    
    onFilterChange({
      type: [],
      search: "",
      timeRange: "all",
    });
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>
      
      <Popover open={typeOpen} onOpenChange={setTypeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={typeOpen}
            className="w-full sm:w-[200px] justify-between"
          >
            {selectedTypes.length > 0
              ? `${selectedTypes.length} types selected`
              : "Log Type"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search log type..." />
            <CommandEmpty>No log type found.</CommandEmpty>
            <CommandGroup>
              {typeOptions.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={() => handleTypeSelect(type.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTypes.includes(type.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {type.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      <Popover open={timeRangeOpen} onOpenChange={setTimeRangeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={timeRangeOpen}
            className="w-full sm:w-[200px] justify-between"
          >
            {timeRangeOptions.find((t) => t.value === selectedTimeRange)?.label || "Time Range"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search time range..." />
            <CommandEmpty>No time range found.</CommandEmpty>
            <CommandGroup>
              {timeRangeOptions.map((timeRange) => (
                <CommandItem
                  key={timeRange.value}
                  value={timeRange.value}
                  onSelect={() => handleTimeRangeSelect(timeRange.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTimeRange === timeRange.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {timeRange.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {(selectedTypes.length > 0 || selectedTimeRange !== "all" || searchQuery) && (
        <Button variant="ghost" onClick={clearFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 