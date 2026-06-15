import React, { useState } from 'react';
import { RotateCcw, CheckCircle, PartyPopper } from 'lucide-react';
import { useTeaMatStore } from '@/store/useTeaMatStore';

export const ControlPanel: React.FC = () => {
  const { resetToDefault, isAllCompliant } = useTeaMatStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePassClick = () => {
    if (isAllCompliant) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="mt-6">
      {showSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3 animate-pulse">
          <PartyPopper className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-bold text-green-800">恭喜！布局通过验证</p>
            <p className="text-sm text-green-700">茶席席位摆放完全符合规范要求</p>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={resetToDefault}
          className="flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 
                     text-stone-700 font-medium rounded-lg transition-all duration-200
                     border border-stone-300 hover:shadow-md active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          恢复默认布局
        </button>

        <button
          onClick={handlePassClick}
          disabled={!isAllCompliant}
          className={`flex items-center gap-2 px-8 py-3 font-medium rounded-lg transition-all duration-200
            ${isAllCompliant
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl cursor-pointer active:scale-95'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
            }
          `}
        >
          <CheckCircle className="w-5 h-5" />
          布局通过
        </button>
      </div>

      <div className="mt-3 text-xs text-stone-500">
        {isAllCompliant ? (
          <span className="text-green-600 font-medium">
            ✓ 所有规则已满足，可以点击「布局通过」
          </span>
        ) : (
          <span>
            请修正违规项后，「布局通过」按钮才会启用
          </span>
        )}
      </div>
    </div>
  );
};
