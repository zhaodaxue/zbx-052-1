import { TeaMat } from '@/components/TeaMat';
import { ViolationSidebar } from '@/components/ViolationSidebar';
import { ControlPanel } from '@/components/ControlPanel';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200">
      <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white py-6 px-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-wide">
            🍵 茶席席位布局合规预览屏
          </h1>
          <p className="text-amber-200 mt-1 text-sm">
            茶艺师培训 · 席位摆放规范训练系统
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex-shrink-0">
            <TeaMat />
            <ControlPanel />
          </div>

          <div className="flex-shrink-0">
            <ViolationSidebar />
          </div>
        </div>
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-stone-500">
        <p>拖拽席位调整位置 · 实时校验布局规则</p>
      </footer>
    </div>
  );
}
