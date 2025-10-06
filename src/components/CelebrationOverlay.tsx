import { Sparkles } from 'lucide-react';

interface CelebrationOverlayProps {
  message: string;
  show: boolean;
}

export default function CelebrationOverlay({ message, show }: CelebrationOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"></div>

      <div className="relative animate-bounce-scale">
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-3xl shadow-2xl p-8 border-4 border-white">
          <div className="flex items-center gap-4">
            <Sparkles className="w-12 h-12 text-white animate-spin-slow" />
            <div>
              <p className="text-3xl font-black text-white drop-shadow-lg">
                {message}
              </p>
            </div>
            <Sparkles className="w-12 h-12 text-white animate-spin-slow" />
          </div>
        </div>

        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-300 rounded-full animate-ping delay-100"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-purple-300 rounded-full animate-ping delay-200"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-orange-300 rounded-full animate-ping delay-300"></div>
      </div>
    </div>
  );
}
