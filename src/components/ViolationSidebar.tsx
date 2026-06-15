import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTeaMatStore } from '@/store/useTeaMatStore';
import { MIN_CENTER_DISTANCE, MAIN_AREA_MAX_TOP } from '@/types';

export const ViolationSidebar: React.FC = () => {
  const { violations, isAllCompliant } = useTeaMatStore();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'distance':
        return '📏';
      case 'boundary':
        return '🚧';
      case 'mainArea':
        return '🎯';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="w-72 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-5 py-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          违规清单
        </h3>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto">
        {isAllCompliant ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
            <p className="text-green-700 font-medium">全部合规！</p>
            <p className="text-sm text-stone-500 mt-1">
              布局符合茶席规范要求
            </p>
          </div>
        ) : violations.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            <p>暂无违规项</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-stone-600 mb-3">
              共 <span className="font-bold text-red-600">{violations.length}</span> 项违规
            </div>
            {violations.map((violation, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{getTypeIcon(violation.type)}</span>
                  <div className="flex-1">
                    <div className="font-bold text-red-800 text-sm">
                      {violation.seatId} 号席
                    </div>
                    <div className="text-xs text-red-700 mt-1">
                      {violation.reason}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-stone-200 p-4 bg-stone-50">
        <h4 className="text-sm font-bold text-stone-700 mb-2">布局规则</h4>
        <ul className="text-xs text-stone-600 space-y-1.5">
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600">•</span>
            席位中心距 ≥ {MIN_CENTER_DISTANCE}px
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600">•</span>
            席位不得超出茶席边界
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600">•</span>
            1 号席（主泡）须距上边 ≤ {MAIN_AREA_MAX_TOP}px
          </li>
        </ul>
      </div>
    </div>
  );
};
