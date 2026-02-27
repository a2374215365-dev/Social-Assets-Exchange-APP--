import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Camera, 
  Smile, 
  MapPin, 
  Lock, 
  Globe, 
  Users, 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  Send
} from "lucide-react";

import { APPLE_EMOJIS } from "../constants";

interface CreatePostProps {
  onBack: () => void;
  onPost: (post: any) => void;
}

export default function CreatePost({ onBack, onPost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [location, setLocation] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [complianceEnabled, setComplianceEnabled] = useState(true);
  const [balancerEnabled, setBalancerEnabled] = useState(false);
  const [showBalancerSuggestion, setShowBalancerSuggestion] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const emojis = APPLE_EMOJIS;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);

    // Satirical "Real Emotion" detection
    const emotionKeywords = ["难过", "伤心", "爱", "恨", "痛苦", "感觉", "真诚", "累", "想哭", "破防", "sad", "love", "feel", "tired"];
    if (!balancerEnabled && emotionKeywords.some(k => val.toLowerCase().includes(k))) {
      setShowBalancerSuggestion(true);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("浏览器不支持定位");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we'd reverse geocode. Here we simulate.
        const { latitude, longitude } = position.coords;
        setLocation(`坐标: ${latitude.toFixed(2)}, ${longitude.toFixed(2)} (资产溢价区)`);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error(error);
        alert("无法获取位置，请检查权限设置");
        setIsGettingLocation(false);
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages([...images, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!content.trim() && images.length === 0) return;

    setIsAnalyzing(true);
    
    // Satirical "Compliance Check" simulation
    setTimeout(() => {
      onPost({
        author: {
          name: "芋头",
          avatar: "https://picsum.photos/seed/tram/200/200",
          level: "LV.99",
          sub: "核心资产"
        },
        content,
        image: images[0], // Simplified for demo
        location,
        productivity: `+${Math.floor(Math.random() * 20) * multiplier}分`,
        rating: multiplier >= 5 ? "S" : multiplier >= 2 ? "A+" : "A",
      });
      setIsAnalyzing(false);
      onBack();
    }, 1500);
  };

  const leverageCosts: Record<number, number> = {
    1: 5,
    2: 10,
    5: 25,
    10: 50
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col">
      <AnimatePresence>
        {showBalancerSuggestion && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="bg-slate-900 border border-orange-500/30 p-6 rounded-2xl max-w-xs text-center shadow-2xl">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-orange-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">检测到“真实情感”</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                系统检测到您的内容包含低效率的真实情感波动。这可能会降低您的社交资产评级。建议开启“情绪平衡器”以优化表达。
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    setBalancerEnabled(true);
                    setShowBalancerSuggestion(false);
                  }}
                  className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-bold text-sm"
                >
                  开启平衡器 (推荐)
                </button>
                <button 
                  onClick={() => setShowBalancerSuggestion(false)}
                  className="w-full bg-slate-800 text-slate-400 py-2.5 rounded-xl text-sm"
                >
                  坚持发布原始情感
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-background-dark/90 backdrop-blur-md">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <X size={24} />
        </button>
        <h1 className="text-lg font-bold font-display">发布动态</h1>
        <button 
          onClick={handlePost}
          disabled={(!content.trim() && images.length === 0) || isAnalyzing}
          className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
            (!content.trim() && images.length === 0) || isAnalyzing
              ? 'bg-slate-800 text-slate-500'
              : 'bg-primary text-white shadow-[0_0_15px_rgba(19,91,236,0.4)]'
          }`}
        >
          {isAnalyzing ? '合规性检查中...' : '发布'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="分享你的社交资产增值心得..."
          className="w-full h-40 bg-transparent text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none text-lg leading-relaxed"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-white/10">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 9 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-slate-900 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ImageIcon size={24} />
                <span className="text-[10px] mt-1">添加</span>
              </button>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleGetLocation}
            disabled={isGettingLocation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5 text-xs transition-colors ${location ? 'text-primary border-primary/30' : 'text-slate-400'}`}
          >
            <MapPin size={14} className={isGettingLocation ? 'animate-pulse' : ''} />
            <span>{isGettingLocation ? '定位中...' : location || '添加地点'}</span>
          </button>
          <button 
            onClick={() => setPrivacy(privacy === "public" ? "private" : "public")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5 text-slate-400 text-xs"
          >
            {privacy === "public" ? <Globe size={14} /> : <Lock size={14} />}
            <span>{privacy === "public" ? "公开" : "私密"}</span>
          </button>
        </div>

        {/* Satirical Features */}
        <div className="mt-8 space-y-4 border-t border-white/5 pt-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                <span className="text-sm font-bold text-slate-200">社交资产杠杆</span>
              </div>
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">PRO</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">支付 {leverageCosts[multiplier]} 社交币，使该动态的曝光率提升 {multiplier}x。</p>
            <div className="flex gap-2">
              {[1, 2, 5, 10].map(m => (
                <button 
                  key={m}
                  onClick={() => setMultiplier(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    multiplier === m 
                      ? 'bg-primary border-primary text-white shadow-lg' 
                      : 'bg-slate-800 border-white/5 text-slate-500'
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className={complianceEnabled ? "text-green-500" : "text-slate-600"} />
              <div>
                <h4 className="text-sm font-bold text-slate-200">算法合规检查</h4>
                <p className="text-[10px] text-slate-500">自动过滤负能量与非生产性内容</p>
              </div>
            </div>
            <button 
              onClick={() => setComplianceEnabled(!complianceEnabled)}
              className={`w-10 h-5 rounded-full relative transition-colors ${complianceEnabled ? 'bg-green-500/20' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${complianceEnabled ? 'right-1 bg-green-500' : 'left-1 bg-slate-600'}`} />
            </button>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className={balancerEnabled ? "text-orange-500" : "text-slate-600"} />
              <div>
                <h4 className="text-sm font-bold text-slate-200">情绪平衡器</h4>
                <p className="text-[10px] text-slate-500">检测到潜在的“真实情感”，自动修正表达</p>
              </div>
            </div>
            <button 
              onClick={() => setBalancerEnabled(!balancerEnabled)}
              className={`w-10 h-5 rounded-full relative transition-colors ${balancerEnabled ? 'bg-orange-500/20' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${balancerEnabled ? 'right-1 bg-orange-500' : 'left-1 bg-slate-600'}`} />
            </button>
          </div>
        </div>
      </main>

      <footer className="h-14 border-t border-white/5 bg-slate-900 flex items-center px-4 gap-6">
        <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-white">
          <ImageIcon size={24} />
        </button>
        <button onClick={() => cameraInputRef.current?.click()} className="text-slate-400 hover:text-white">
          <Video size={24} />
        </button>
        <button onClick={() => cameraInputRef.current?.click()} className="text-slate-400 hover:text-white">
          <Camera size={24} />
        </button>
        <div className="relative">
          <button onClick={() => setShowEmoji(!showEmoji)} className="text-slate-400 hover:text-white">
            <Smile size={24} />
          </button>
          <AnimatePresence>
            {showEmoji && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 left-0 bg-slate-800 border border-white/10 rounded-xl p-2 grid grid-cols-6 gap-2 shadow-2xl z-[110] w-48"
              >
                {emojis.map(e => (
                  <button 
                    key={e} 
                    onClick={() => {
                      setContent(content + e);
                      setShowEmoji(false);
                    }}
                    className="text-xl hover:scale-125 transition-transform"
                  >
                    {e}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </footer>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
        accept="image/*" 
      />
      
      <input 
        type="file" 
        ref={cameraInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
        accept="image/*,video/*" 
        capture="environment"
      />

      {isAnalyzing && (
        <div className="absolute inset-0 z-[110] bg-background-dark/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">正在进行合规性分析</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            我们的算法正在确保您的动态符合当前的社会信用准则，并最大化您的社交资产回报率。
          </p>
        </div>
      )}
    </div>
  );
}
