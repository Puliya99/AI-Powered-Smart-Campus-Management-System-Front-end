import React from 'react';
import { Info, Lightbulb } from 'lucide-react';

interface RiskDetailsCardProps {
  reasons: string[];
  recommendation: string;
  showReasons?: boolean;
}

const RiskDetailsCard: React.FC<RiskDetailsCardProps> = ({ 
  reasons, 
  recommendation,
  showReasons = true
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {showReasons && reasons && reasons.length > 0 && (
        <div className="p-4 border-b border-gray-50 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-3 text-gray-700 dark:text-gray-300 font-semibold">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Risk Factors Identified</span>
          </div>
          <ul className="space-y-2">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0"></span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="p-4 bg-primary-50 dark:bg-primary-900/20">
        <div className="flex items-center space-x-2 mb-2 text-primary-700 dark:text-primary-400 font-semibold text-sm">
          <Lightbulb className="w-4 h-4" />
          <span>Recommended Action</span>
        </div>
        <p className="text-sm text-primary-800 dark:text-primary-300 leading-relaxed">
          {recommendation}
        </p>
      </div>
    </div>
  );
};

export default RiskDetailsCard;
