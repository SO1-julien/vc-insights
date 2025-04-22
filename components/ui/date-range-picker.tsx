"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  // Create a local state to handle date selection safely
  const [localDate, setLocalDate] = useState<DateRange | undefined>(date)

  // Sync local state with props
  useEffect(() => {
    setLocalDate(date)
  }, [date])

  // Safe handler for date changes
  const handleDateChange = (newDate: DateRange | undefined) => {
    // Always update local state first to reflect user's selection
    setLocalDate(newDate)

    // Only update parent state when we have a complete range with both from and to
    if (newDate?.from && newDate.to) {
      setDate(newDate)
    }
  }

  // Format the display text for the date range
  const formatDisplayText = () => {
    if (!localDate?.from) {
      return "Pick a date range"
    }

    if (localDate.to) {
      return `${format(localDate.from, "MMM d, yyyy")} - ${format(localDate.to, "MMM d, yyyy")}`
    }

    return `${format(localDate.from, "MMM d, yyyy")} - Pick end date`
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "h-9 w-[240px] justify-start text-left font-normal",
              !localDate?.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={localDate?.from}
            selected={localDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
            className="date-range-calendar" // Add a custom class for styling
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
