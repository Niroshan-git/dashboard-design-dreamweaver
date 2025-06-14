
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataTableProps {
  title: string;
  headers: string[];
  rows: string[][];
  themeColors: any;
  showBadges?: boolean;
}

const DataTable = ({ title, headers, rows, themeColors, showBadges = true }: DataTableProps) => {
  const getBadgeVariant = (value: string) => {
    if (value.includes('+') || value.toLowerCase().includes('completed') || value.toLowerCase().includes('good') || value.toLowerCase().includes('excellent')) {
      return 'default';
    } else if (value.includes('-') || value.toLowerCase().includes('failed') || value.toLowerCase().includes('high') && value.toLowerCase().includes('risk')) {
      return 'destructive';
    } else if (value.toLowerCase().includes('pending') || value.toLowerCase().includes('medium')) {
      return 'secondary';
    }
    return 'outline';
  };

  const shouldShowAsBadge = (value: string, columnIndex: number) => {
    if (!showBadges) return false;
    
    // Show badges for status columns, risk levels, and percentage changes
    return (
      value.includes('%') ||
      ['completed', 'pending', 'failed', 'good', 'excellent', 'fair', 'low', 'medium', 'high'].some(
        keyword => value.toLowerCase().includes(keyword)
      ) ||
      columnIndex === headers.length - 1 // Last column is often status/action
    );
  };

  return (
    <Card 
      className="w-full"
      style={{ 
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.borderColor,
        color: themeColors.textPrimary
      }}
    >
      <CardHeader>
        <CardTitle style={{ color: themeColors.textPrimary }}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border" style={{ borderColor: themeColors.borderColor }}>
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: themeColors.borderColor }}>
                {headers.map((header, index) => (
                  <TableHead 
                    key={index}
                    style={{ color: themeColors.textSecondary }}
                    className="font-semibold"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  style={{ borderColor: themeColors.borderColor }}
                  className="hover:bg-opacity-50"
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell 
                      key={cellIndex}
                      style={{ color: themeColors.textPrimary }}
                    >
                      {shouldShowAsBadge(cell, cellIndex) ? (
                        <Badge variant={getBadgeVariant(cell)} className="text-xs">
                          {cell}
                        </Badge>
                      ) : (
                        <span className={cellIndex === 0 ? 'font-medium' : ''}>
                          {cell}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
