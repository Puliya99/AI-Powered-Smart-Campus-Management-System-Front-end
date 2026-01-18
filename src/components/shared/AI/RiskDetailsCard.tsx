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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {showReasons && reasons && reasons.length > 0 && (
        <div className="p-4 border-b border-gray-50">
          <div className="flex items-center space-x-2 mb-3 text-gray-700 font-semibold">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Risk Factors Identified</span>
          </div>
          <ul className="space-y-2">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="p-4 bg-primary-50">
        <div className="flex items-center space-x-2 mb-2 text-primary-700 font-semibold text-sm">
          <Lightbulb className="w-4 h-4" />
          <span>Recommended Action</span>
        </div>
        <p className="text-sm text-primary-800 leading-relaxed">
          {recommendation}
        </p>
      </div>
    </div>
  );
};

export default RiskDetailsCard;
