
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";

interface DashboardHeaderProps {
  currentPage: number;
  componentCount: number;
  themeColors: any;
  onExport: (format: string) => void;
}

const DashboardHeader = ({ currentPage, componentCount, themeColors, onExport }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: themeColors.textPrimary }}>
          Page {currentPage + 1}
        </h1>
        <p className="text-sm" style={{ color: themeColors.textSecondary }}>
          {componentCount} component{componentCount !== 1 ? 's' : ''} configured
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
