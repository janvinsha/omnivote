"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Skeleton } from "./ui/skeleton"

export function FilterSelector({
  className,
  useFilter,
  filters,
  ...props
}: Omit<React.ComponentProps<typeof SelectTrigger>, "color"> & {
  useFilter: () => any,
  filters: any
}) {
  const { filter, setFilter, isLoading } = useFilter()
  if (isLoading) {
    return <FilterSkeleton />
  }

  return (
    <Select value={filters} onValueChange={setFilter}>
      <SelectTrigger
        className={cn("h-7 w-auto gap-1.5 rounded-lg pr-2 text-xs", className)}
        {...props}
      >
        <span className="font-medium">Format: </span>
        <span className="font-mono text-xs text-muted-foreground">
          {filter}
        </span>
      </SelectTrigger>
      <SelectContent align="end" className="rounded-xl">
        {Object.entries(filters).map(([format, value]) => (
          <SelectItem
            key={format}
            value={format}
            className="gap-2 rounded-lg [&>span]:flex [&>span]:items-center [&>span]:gap-2"
          >
            <span className="font-medium">{format}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {value as string}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function FilterSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      className={cn("h-7 w-[116px] gap-1.5 rounded-lg", className)}
      {...props}
    />
  )
}
