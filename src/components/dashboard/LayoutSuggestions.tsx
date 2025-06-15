
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface LayoutSuggestionsProps {
  suggestions: string[];
}

const LayoutSuggestions = ({ suggestions }: LayoutSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Layout Suggestions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutSuggestions;
