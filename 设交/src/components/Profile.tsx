import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Settings, 
  ThumbsUp, 
  ChevronRight, 
  Star, 
  Moon, 
  Sun, 
  Phone, 
  Gift, 
  MessageCircle,
  Gamepad2,
  LayoutGrid,
  Heart,
  Camera,
  Video,
  Mic,
  X,
  PhoneOff,
  VideoOff
} from "lucide-react";

interface ProfileProps {
  user?: {
    name: string;
    avatar: string;
    level?: string;
    bio?: string;
    id?: string;
  };
  onBack?: () => void;
  onSendMessage?: () => void;
  onViewPersonalFeed?: (user: any) => void;
}

export default function Profile({ user, onBack, onSendMessage, onViewPersonalFeed }: ProfileProps) {
  const isOwnProfile = !user;
  const displayUser = user || {
    name: "芋头",
    avatar: "https://picsum.photos/seed/tram/200/200",
    id: "1034145257",
    bio: "未来可期❤️",
    level: "LVL 99"
  };

  const [likes, setLikes] = useState(511);
  const [isLiked, setIsLiked] = useState(false);
  const [avatar, setAvatar] = useState(displayUser.avatar);
  const [cover, setCover] = useState("https://picsum.photos/seed/city_taxi/800/600");
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') {
          setAvatar(reader.result as string);
        } else {
          setCover(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-y-auto no-scrollbar">
      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={avatarInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => handleFileChange(e, 'avatar')} 
      />
      <input 
        type="file" 
        ref={coverInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => handleFileChange(e, 'cover')} 
      />

      {/* Cover Image Section */}
      <div 
        className={`relative h-64 w-full shrink-0 ${isOwnProfile ? 'cursor-pointer group' : ''}`}
        onClick={() => isOwnProfile && coverInputRef.current?.click()}
      >
        <img 
          src={cover} 
          alt="Cover" 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
        
        {isOwnProfile && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white">
              <Camera size={24} />
            </div>
          </div>
        )}
        
        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          {onBack ? (
            <button onClick={onBack} className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div />
          )}
          <button className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white">
            <Settings size={20} />
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-bold text-4xl drop-shadow-lg font-display tracking-widest opacity-60">
          duck
        </div>
      </div>

      {/* Profile Card Section */}
      <div className="relative -mt-12 px-4 z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-t-[2rem] p-6 shadow-2xl border-t border-x border-white/10">
          <div className="flex justify-between items-start mb-4">
            <div className="relative -mt-16">
              <div 
                className={`h-24 w-24 rounded-full border-4 border-slate-900 overflow-hidden shadow-xl relative ${isOwnProfile ? 'cursor-pointer group' : ''}`}
                onClick={() => isOwnProfile && avatarInputRef.current?.click()}
              >
                <img 
                  src={avatar} 
                  alt="Avatar" 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isOwnProfile && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={20} className="text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <button 
                onClick={handleLike}
                className={`flex flex-col items-center gap-0.5 transition-colors ${isLiked ? 'text-primary' : 'text-slate-500'}`}
              >
                <ThumbsUp size={24} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-xs font-bold text-white">{likes}</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white">{displayUser.name}</h1>
            <p className="text-sm text-slate-500 font-mono">设交号: {displayUser.id || '884291X0'}</p>
          </div>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="flex items-center justify-between text-sm text-slate-400 group cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-pink-500">♀</span>
                <span>女</span>
                <span className="text-slate-700">|</span>
                <span>4月30日 金牛座</span>
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400" />
            </div>

            {/* Level Icons */}
            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-1.5">
                <div className="bg-orange-100 text-orange-500 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
                  <Sun size={10} fill="currentColor" />
                  655
                </div>
                <Sun size={14} className="text-yellow-400 fill-current" />
                <Sun size={14} className="text-yellow-400 fill-current" />
                <Moon size={14} className="text-yellow-400 fill-current" />
                <Moon size={14} className="text-yellow-400 fill-current" />
                <Moon size={14} className="text-yellow-400 fill-current" />
                <Star size={14} className="text-yellow-400 fill-current" />
                <Star size={14} className="text-yellow-400 fill-current" />
                <div className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">勋章</div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
            </div>

            {/* VIP Status */}
            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <div className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center">
                    <Star size={8} fill="white" />
                  </div>
                  SVIP2
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
            </div>

            {/* Bio */}
            <div className="flex items-center justify-between group cursor-pointer">
              <p className="text-sm text-slate-200 font-medium">{displayUser.bio}</p>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-pink-500/10 text-pink-500 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border border-pink-500/20">
                <img src="https://picsum.photos/seed/tag/20/20" className="w-4 h-4 rounded" referrerPolicy="no-referrer" />
                超级可爱❤️
              </div>
            </div>

            {/* Interaction Badges */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 group cursor-pointer">
              <span className="text-sm font-bold text-white">你们的互动标识</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">立刻点亮你们的第一个标识</span>
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Star size={12} className="text-purple-500 fill-current" />
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Below Card */}
      <div className="mt-2 space-y-2 pb-32">
        <div 
          onClick={() => onViewPersonalFeed?.(displayUser)}
          className="bg-slate-900/50 px-6 py-4 flex items-center justify-between group cursor-pointer border-y border-white/5"
        >
          <div className="flex items-center gap-3">
            <Star size={20} className="text-slate-500" />
            <span className="text-sm font-medium text-white">设交动态</span>
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400" />
        </div>
      </div>

      {/* Bottom Action Bar */}
      {!isOwnProfile && (
        <div className="fixed bottom-0 w-full max-w-md bg-slate-900/95 backdrop-blur-lg border-t border-white/5 px-4 py-3 pb-8 flex items-center gap-3 z-50">
          <button 
            onClick={() => setShowCallMenu(true)}
            className="flex-1 h-12 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-white font-bold text-sm hover:bg-white/5 transition-colors"
          >
            <Phone size={18} />
            音视频通话
          </button>
          <button 
            onClick={onSendMessage}
            className="flex-[1.5] h-12 rounded-xl bg-primary text-white flex items-center justify-center gap-2 font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <MessageCircle size={18} />
            发消息
          </button>
        </div>
      )}

      {/* Call Menu Overlay */}
      <AnimatePresence>
        {showCallMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCallMenu(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-slate-900 rounded-t-3xl z-[70] p-6 pb-12 border-t border-white/10"
            >
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setShowCallMenu(false);
                    setActiveCall('video');
                  }}
                  className="w-full h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-colors"
                >
                  <Video size={20} className="text-primary" />
                  视频通话
                </button>
                <button 
                  onClick={() => {
                    setShowCallMenu(false);
                    setActiveCall('audio');
                  }}
                  className="w-full h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-colors"
                >
                  <Phone size={20} className="text-emerald-500" />
                  音频通话
                </button>
                <button 
                  onClick={() => setShowCallMenu(false)}
                  className="w-full h-14 mt-2 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 font-bold transition-colors"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Simulated Call UI */}
      <AnimatePresence>
        {activeCall && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-between p-12 text-white"
          >
            {activeCall === 'video' && (
              <div className="absolute inset-0 opacity-40">
                <img 
                  src="https://picsum.photos/seed/video_call/1080/1920" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            
            <div className="relative z-10 flex flex-col items-center mt-20">
              <div className="h-32 w-32 rounded-full border-4 border-white/20 overflow-hidden mb-6 shadow-2xl">
                <img src={avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{displayUser.name}</h2>
              <p className="text-slate-400 animate-pulse">正在呼叫...</p>
            </div>

            <div className="relative z-10 flex items-center gap-8 mb-20">
              <button className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                <Mic size={28} />
              </button>
              <button 
                onClick={() => setActiveCall(null)}
                className="h-20 w-20 rounded-full bg-danger flex items-center justify-center shadow-lg shadow-danger/40 hover:bg-red-600 transition-transform active:scale-90"
              >
                <PhoneOff size={32} />
              </button>
              <button className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                {activeCall === 'video' ? <VideoOff size={28} /> : <LayoutGrid size={28} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
