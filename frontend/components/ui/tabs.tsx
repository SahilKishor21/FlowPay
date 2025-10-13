import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import type { ElementRef, ComponentPropsWithoutRef } from "react"

const Tabs = TabsPrimitive.Root

type TabsListRef = ElementRef<typeof TabsPrimitive.List>
type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>
const TabsList = React.forwardRef(function TabsList(
  { className, ...props }: TabsListProps,
  ref: React.Ref<TabsListRef>
) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

type TabsTriggerRef = ElementRef<typeof TabsPrimitive.Trigger>
type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
const TabsTrigger = React.forwardRef(function TabsTrigger(
  { className, ...props }: TabsTriggerProps,
  ref: React.Ref<TabsTriggerRef>
) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

type TabsContentRef = ElementRef<typeof TabsPrimitive.Content>
type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
const TabsContent = React.forwardRef(function TabsContent(
  { className, ...props }: TabsContentProps,
  ref: React.Ref<TabsContentRef>
) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }