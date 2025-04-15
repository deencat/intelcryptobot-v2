"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleWidgetProps {
  title: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
  onExpandChanged?: (expanded: boolean) => void;
}

export function CollapsibleWidget({
  title,
  children,
  defaultCollapsed = false,
  className = "",
  onExpandChanged,
}: CollapsibleWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    if (onExpandChanged) {
      onExpandChanged(!newCollapsedState);
    }
  };

  return (
    <Card className={className} data-testid={`widget-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <button
            onClick={toggleCollapsed}
            className="rounded-full p-1 hover:bg-muted"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
            data-testid={isCollapsed ? "expand-button" : "collapse-button"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      {!isCollapsed && <CardContent data-testid="widget-content">{children}</CardContent>}
    </Card>
  );
} 