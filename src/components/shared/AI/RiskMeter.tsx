import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  size?: 'sm' | 'md' | 'lg';
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score, level, size = 'md' }) => {
  const getColors = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          bar: 'bg-green-500',
          icon: <CheckCircle className="text-green-500" />
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          bar: 'bg-yellow-500',
          icon: <AlertCircle className="text-yellow-500" />
        };
      case 'HIGH':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          bar: 'bg-red-500',
          icon: <AlertTriangle className="text-red-500" />
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          bar: 'bg-gray-500',
          icon: null
        };
    }
  };

  const colors = getColors();
  
  const sizeClasses = {
    sm: { h: 'h-1.5', text: 'text-xs', iconSize: 'w-4 h-4' },
    md: { h: 'h-2.5', text: 'text-sm', iconSize: 'w-5 h-5' },
    lg: { h: 'h-4', text: 'text-base', iconSize: 'w-6 h-6' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {React.cloneElement(colors.icon as React.ReactElement, { className: currentSize.iconSize })}
          <span className={`font-bold ${currentSize.text} ${colors.text}`}>
            {level} RISK
          </span>
        </div>
        <span className={`font-medium ${currentSize.text} text-gray-600`}>
          {Math.round(score)}%
        </span>
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${currentSize.h} overflow-hidden`}>
        <div 
          className={`${colors.bar} ${currentSize.h} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RiskMeter;
