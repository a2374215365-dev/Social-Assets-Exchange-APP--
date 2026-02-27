import { useState, useRef, useEffect, ChangeEvent, MouseEvent, TouchEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Menu, 
  Flame, 
  Send, 
  Info, 
  HelpCircle, 
  ThumbsUp, 
  Briefcase, 
  Smile, 
  Image as ImageIcon, 
  Camera, 
  Plus, 
  Paperclip, 
  CloudOff,
  Mic,
  Video,
  Phone,
  PhoneOff,
  X,
  MoreHorizontal
} from "lucide-react";
import { APPLE_EMOJIS } from "../constants";

export default function ChatRoom({ onBack, onViewProfile }: { onBack: () => void, onViewProfile: (user: any) => void }) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'friend', text: '最近怎么样？', time: '昨天 19:42' },
    { id: 2, type: 'user', text: '挺好的，刚忙完一个项目', time: '昨天 19:45', read: true },
    { id: 3, type: 'system', text: '恭喜！成功发送无意义问候。羁绊标识 🔥 已点亮。击败全国 99% 的沉默好友！', time: '昨天 19:46' },
    { id: 4, type: 'file', text: '项目_资产_最终版_v3.zip', time: '今天 09:14', size: '2.4 MB', expired: true },
  ]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<number | null>(null);
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showFireRenewal, setShowFireRenewal] = useState(false);
  const [renewalDays, setRenewalDays] = useState(100);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (text: string, type: 'user' | 'image' | 'voice' = 'user', duration?: number) => {
    if (!text.trim() && type === 'user') return;
    const newMessage = {
      id: Date.now(),
      type: type,
      text: text,
      duration: duration,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setMessages([...messages, newMessage]);
    setInputText("");
    setShowEmojiPicker(false);

    // Fire renewal logic
    if (type === 'user' || type === 'image' || type === 'voice') {
      const addedDays = Math.floor(Math.random() * 5) + 1;
      setRenewalDays(prev => prev + addedDays);
      setShowFireRenewal(true);
      setTimeout(() => setShowFireRenewal(false), 3000);
    }
  };

  const handleVoiceStart = async (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (!isCancelHovered && recordingDuration > 0.5) {
          handleSendMessage(audioUrl, 'voice', Math.round(recordingDuration));
        }
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setIsCancelHovered(false);
      setRecordingDuration(0);
      
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);

    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("无法访问麦克风，请检查权限设置");
    }
  };

  const handleVoiceMove = (e: TouchEvent) => {
    if (isRecording) {
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.closest('.cancel-zone')) {
        setIsCancelHovered(true);
      } else {
        setIsCancelHovered(false);
      }
    }
  };

  const handleVoiceEnd = () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      setIsRecording(false);
    }
  };

  const handlePlayVoice = (id: number, url: string) => {
    if (playingVoiceId === id) {
      audioPlayerRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      
      const audio = new Audio(url);
      audioPlayerRef.current = audio;
      setPlayingVoiceId(id);
      
      audio.play();
      audio.onended = () => {
        setPlayingVoiceId(null);
      };
    }
  };

  const getProfileData = (type: string) => {
    if (type === 'user' || type === 'image' || type === 'voice') {
      return { isMe: true };
    }
    return { name: "十年老友", avatar: "https://picsum.photos/seed/friend_avatar/100/100", id: "884291X0" };
  };

  const isUserMessage = (type: string) => {
    return type === 'user' || type === 'image' || type === 'voice';
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSendMessage(reader.result as string, 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const perfunctoryReplies = [
    { icon: <ThumbsUp size={16} className="text-danger" />, label: "[一键点赞]", text: "👍", sub: "+1 热度" },
    { icon: <Briefcase size={16} className="text-primary" />, label: "[发送商业互吹]", text: "大佬太强了，向您学习！", sub: "职业化" },
    { icon: <span className="text-purple-500">🎭</span>, label: "[维持表面活跃]", text: "哈哈，确实。", sub: "低成本" },
  ];

  return (
    <div className="flex flex-col h-full bg-background-dark relative overflow-hidden">
      {/* Hidden Inputs */}
      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

      {/* Header */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between shadow-sm border-b border-white/5 z-30">
        <div className="flex items-center gap-1">
          <button onClick={onBack} className="text-slate-400 hover:text-white p-1">
            <ArrowLeft size={20} />
          </button>
          <div className="bg-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-slate-400">2</div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold text-white">十年老友</h1>
          <div className="flex items-center gap-1 mt-0.5 animate-pulse">
            <Flame size={10} className="text-danger fill-current" />
            <span className="text-[8px] font-bold text-danger uppercase tracking-wide">已连续互动 {renewalDays} 天</span>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-1">
          <Menu size={20} />
        </button>
      </div>

      {/* Chat Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        <AnimatePresence>
          {showFireRenewal && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
            >
              <div className="bg-danger/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_0_20px_rgba(234,42,51,0.4)] flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Flame size={16} className="text-white fill-current" />
                </motion.div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  火花已自动续期！当前：{renewalDays} 天
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {messages.map((msg, index) => (
          <div key={msg.id}>
            {msg.time && (index === 0 || messages[index-1].time !== msg.time) && (
               <div className="text-center my-4">
                 <span className="text-[10px] text-slate-500 font-medium">{msg.time}</span>
               </div>
            )}
            
            {msg.type === 'system' ? (
              <div className="mx-4 my-6">
                <div className="bg-slate-900/50 border border-white/5 rounded-lg p-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-danger/5 rounded-full blur-xl" />
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">[系统提示]</h3>
                        <span className="text-[8px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded font-bold">+15 社交信用分</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">
                        {msg.text}
                      </p>
                      <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "99%" }}
                          className="bg-danger h-full rounded-full shadow-[0_0_8px_rgba(234,42,51,0.6)]" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : msg.type === 'file' ? (
              <div className="flex justify-center w-full px-8">
                <div className="w-full max-w-[280px] bg-slate-900 rounded-xl shadow-sm border border-white/5 overflow-hidden">
                  <div className="bg-slate-800 p-8 flex items-center justify-center h-32 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0 100 L100 0" stroke="currentColor" strokeWidth="0.5" />
                        <path d="M20 100 L100 20" stroke="currentColor" strokeWidth="0.5" />
                        <path d="M0 80 L80 0" stroke="currentColor" strokeWidth="0.5" />
                      </svg>
                    </div>
                    <span className="material-symbols-outlined text-6xl text-slate-600">folder_zip</span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-medium text-white truncate">{msg.text}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-slate-500">{msg.size} • {msg.expired ? '已过期' : '可用'}</span>
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-slate-800/50 border-t border-white/5 flex items-center gap-1">
                    <CloudOff size={12} className="text-primary" />
                    <span className="text-[9px] text-slate-500">文件已失效</span>
                  </div>
                </div>
              </div>
            ) : msg.type === 'image' ? (
              <div className={`flex gap-3 ${isUserMessage(msg.type) ? 'flex-row-reverse' : ''}`}>
                <img 
                  src={isUserMessage(msg.type) ? "https://picsum.photos/seed/me_avatar/100/100" : "https://picsum.photos/seed/friend_avatar/100/100"} 
                  className="w-10 h-10 rounded-full object-cover border border-white/5 shrink-0 cursor-pointer"
                  referrerPolicy="no-referrer"
                  onClick={() => onViewProfile(getProfileData(msg.type))}
                />
                <div className="max-w-[70%] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={msg.text} className="w-full h-auto" referrerPolicy="no-referrer" />
                </div>
              </div>
            ) : msg.type === 'voice' ? (
              <div className={`flex gap-3 ${isUserMessage(msg.type) ? 'flex-row-reverse' : ''}`}>
                <img 
                  src={isUserMessage(msg.type) ? "https://picsum.photos/seed/me_avatar/100/100" : "https://picsum.photos/seed/friend_avatar/100/100"} 
                  className="w-10 h-10 rounded-full object-cover border border-white/5 shrink-0 cursor-pointer"
                  referrerPolicy="no-referrer"
                  onClick={() => onViewProfile(getProfileData(msg.type))}
                />
                <button 
                  onClick={() => handlePlayVoice(msg.id, msg.text)}
                  className={`bg-primary text-white p-3 rounded-2xl rounded-tr-none flex items-center gap-3 min-w-[120px] transition-all active:scale-95 ${playingVoiceId === msg.id ? 'bg-primary/80' : ''}`}
                >
                  <Mic size={16} className={playingVoiceId === msg.id ? 'animate-pulse' : ''} />
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: playingVoiceId === msg.id ? "100%" : "0%" }}
                      transition={{ duration: (msg as any).duration || 4, ease: "linear" }}
                      className="h-full bg-white" 
                    />
                  </div>
                  <span className="text-[10px] font-bold">{(msg as any).duration || 4}"</span>
                </button>
              </div>
            ) : (
              <div className={`flex gap-3 ${isUserMessage(msg.type) ? 'flex-row-reverse' : ''}`}>
                <img 
                  src={isUserMessage(msg.type) ? "https://picsum.photos/seed/me_avatar/100/100" : "https://picsum.photos/seed/friend_avatar/100/100"} 
                  className="w-10 h-10 rounded-full object-cover border border-white/5 shrink-0 cursor-pointer"
                  referrerPolicy="no-referrer"
                  onClick={() => onViewProfile(getProfileData(msg.type))}
                />
                <div className={`flex flex-col gap-1 max-w-[75%] ${isUserMessage(msg.type) ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl shadow-sm text-sm ${isUserMessage(msg.type) ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  {isUserMessage(msg.type) && (
                    <span className="text-[8px] text-slate-600 font-mono uppercase">{msg.read ? '已读' : '未读'}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Reply Panel */}
      <div className="bg-slate-900 border-t border-white/5 p-4 z-20 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">快捷敷衍回复面板</span>
          <HelpCircle size={14} className="text-slate-600 cursor-help" />
        </div>
        <div className="grid grid-cols-1 gap-2">
          {perfunctoryReplies.map((reply, idx) => (
            <button 
              key={idx}
              onClick={() => handleSendMessage(reply.text)}
              className="flex items-center justify-between w-full p-3 rounded-lg border border-white/5 bg-slate-800 hover:bg-slate-700 transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                {reply.icon}
                <span className="text-xs font-bold text-slate-200">{reply.label}</span>
              </div>
              <span className="text-[8px] text-slate-500 border border-white/10 rounded px-1">{reply.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real Chat Input */}
      <div className="bg-slate-900 border-t border-white/5 p-3 pb-8 relative z-30">
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full left-0 right-0 p-8 flex flex-col items-center gap-4 z-50"
            >
              <div 
                onMouseEnter={() => setIsCancelHovered(true)}
                onMouseLeave={() => setIsCancelHovered(false)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cancel-zone ${isCancelHovered ? 'bg-danger scale-125' : 'bg-slate-800/80 backdrop-blur-md'}`}
              >
                <X size={24} className={isCancelHovered ? 'text-white' : 'text-slate-400'} />
              </div>
              <p className={`text-xs font-bold uppercase tracking-widest ${isCancelHovered ? 'text-danger' : 'text-slate-400'}`}>
                {isCancelHovered ? '松开取消发送' : '上滑取消发送'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 right-0 bg-slate-800 border-t border-white/10 p-4 h-48 overflow-y-auto no-scrollbar grid grid-cols-8 gap-2 z-40"
            >
              {APPLE_EMOJIS.map((emoji, i) => (
                <button 
                  key={i} 
                  onClick={() => setInputText(prev => prev + emoji)}
                  className="text-2xl hover:bg-white/5 p-1 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`text-slate-400 hover:text-white transition-colors ${showEmojiPicker ? 'text-primary' : ''}`}
          >
            <Smile size={24} />
          </button>
          
          <div className="flex-1 relative">
            {isRecording ? (
              <div className="w-full bg-primary/20 border border-primary/30 rounded-full py-2 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
                  <span className="text-xs text-primary font-bold">正在录音 {recordingDuration.toFixed(1)}s</span>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-0.5 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="输入消息..."
                className="w-full bg-slate-800 border border-white/10 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {inputText.trim() ? (
              <button 
                onClick={() => handleSendMessage(inputText)}
                className="bg-primary text-white p-2 rounded-full hover:bg-primary/80 transition-colors"
              >
                <Send size={18} />
              </button>
            ) : (
              <>
                <button 
                  onMouseDown={handleVoiceStart}
                  onMouseUp={handleVoiceEnd}
                  onTouchStart={handleVoiceStart}
                  onTouchMove={handleVoiceMove}
                  onTouchEnd={handleVoiceEnd}
                  className={`text-slate-400 hover:text-white transition-all ${isRecording ? 'text-primary scale-125' : ''}`}
                >
                  <Mic size={22} />
                </button>
                <button 
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                  className={`text-slate-400 hover:text-white transition-colors ${showPlusMenu ? 'text-primary' : ''}`}
                >
                  <Plus size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Plus Menu Overlay */}
      <AnimatePresence>
        {showPlusMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlusMenu(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-slate-900 rounded-t-3xl z-[70] p-6 pb-12 border-t border-white/10"
            >
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setShowPlusMenu(false);
                    setActiveCall('video');
                  }}
                  className="h-24 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-white font-bold transition-colors"
                >
                  <Video size={24} className="text-primary" />
                  <span className="text-xs">视频通话</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPlusMenu(false);
                    setActiveCall('audio');
                  }}
                  className="h-24 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-white font-bold transition-colors"
                >
                  <Phone size={24} className="text-emerald-500" />
                  <span className="text-xs">语音通话</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPlusMenu(false);
                    imageInputRef.current?.click();
                  }}
                  className="h-24 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-white font-bold transition-colors"
                >
                  <ImageIcon size={24} className="text-orange-500" />
                  <span className="text-xs">发送图片</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPlusMenu(false);
                    cameraInputRef.current?.click();
                  }}
                  className="h-24 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-white font-bold transition-colors"
                >
                  <Camera size={24} className="text-pink-500" />
                  <span className="text-xs">拍照</span>
                </button>
              </div>
              <button 
                onClick={() => setShowPlusMenu(false)}
                className="w-full h-14 mt-4 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 font-bold transition-colors"
              >
                取消
              </button>
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
                  src="https://picsum.photos/seed/video_call_chat/1080/1920" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            
            <div className="relative z-10 flex flex-col items-center mt-20">
              <div className="h-32 w-32 rounded-full border-4 border-white/20 overflow-hidden mb-6 shadow-2xl">
                <img src="https://picsum.photos/seed/friend_avatar/100/100" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-3xl font-bold mb-2">十年老友</h2>
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
                {activeCall === 'video' ? <Video size={28} /> : <MoreHorizontal size={28} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
