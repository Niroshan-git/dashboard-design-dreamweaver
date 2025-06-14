
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface SmartPageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageSelect: (page: number) => void;
  config: any;
}

const SmartPageNavigation = ({ 
  currentPage, 
  totalPages, 
  onPageSelect, 
  config 
}: SmartPageNavigationProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getPageTitle = (pageIndex: number) => {
    if (pageIndex === 0) return "Overview";
    
    const pageTypes = [
      "Performance", "Analytics", "Insights", "Metrics", 
      "Trends", "Reports", "Details", "Summary"
    ];
    
    return pageTypes[(pageIndex - 1) % pageTypes.length];
  };

  const getPageDescription = (pageIndex: number) => {
    if (pageIndex === 0) return "Main dashboard overview";
    
    const descriptions = [
      "Key performance indicators",
      "Detailed analytics view", 
      "Business insights",
      "Core metrics tracking",
      "Trend analysis",
      "Comprehensive reports",
      "Detailed breakdown",
      "Executive summary"
    ];
    
    return descriptions[(pageIndex - 1) % descriptions.length];
  };

  // Show dropdown for more than 5 pages
  if (totalPages > 5) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageSelect(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="min-w-[120px]">
              {getPageTitle(currentPage)}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-64">
            {Array.from({ length: totalPages }, (_, i) => (
              <DropdownMenuItem
                key={i}
                onClick={() => {
                  onPageSelect(i);
                  setIsDropdownOpen(false);
                }}
                className={`flex items-center justify-between p-3 ${
                  currentPage === i ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{getPageTitle(i)}</span>
                  <span className="text-xs text-gray-500">{getPageDescription(i)}</span>
                </div>
                {currentPage === i && (
                  <Badge variant="secondary" className="text-xs">Current</Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageSelect(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <span className="text-sm text-gray-500">
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>
    );
  }

  // Show regular pagination for 5 or fewer pages
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageSelect(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageSelect(i)}
          className="min-w-[40px]"
        >
          {i + 1}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageSelect(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SmartPageNavigation;
