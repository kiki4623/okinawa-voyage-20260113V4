import React, { useState, useCallback, useRef } from 'react';
import { 
  Send, 
  Loader2, 
  Utensils, 
  ShoppingBag, 
  Car, 
  BedDouble,
  Volume2,
  Copy,
  RefreshCw,
  FlipHorizontal,
  Mic,
  MicOff,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { translateText } from '../geminiService';

interface Phrase {
  cn: string;
  jp: string;
  romaji: string;
}

const COMMON_PHRASES: Record<string, { icon: any, list: Phrase[] }> = {
  '用餐': {
    icon: Utensils,
    list: [
      { cn: '我有訂位。', jp: '予約しています。', romaji: 'Yoyaku shiteimasu.' },
      { cn: '請給我這個。', jp: 'これをください。', romaji: 'Kore o kudasai.' },
      { cn: '結帳。', jp: 'お会計をお願いします。', romaji: 'O-kaikei o onegaishimasu.' },
      { cn: '兩個人。', jp: '二人です。', romaji: 'Futari desu.' },
    ]
  },
  '購物': {
    icon: ShoppingBag,
    list: [
      { cn: '多少錢？', jp: 'いくらですか？', romaji: 'Ikura desu ka?' },
      { cn: '可以試穿嗎？', jp: '試着してもいいですか？', romaji: 'Shichaku shitemo ii desu ka?' },
      { cn: '有免稅嗎？', jp: '免税はできますか？', romaji: 'Menzei wa dekimasu ka?' },
      { cn: '可以用信用卡嗎？', jp: 'クレジットカードは使えますか？', romaji: 'Kurejitto kaado wa tsukaemasu ka?' },
    ]
  },
  '交通': {
    icon: Car,
    list: [
      { cn: '這裡可以停車嗎？', jp: 'ここに駐車できますか？', romaji: 'Koko ni chuusha dekimasu ka?' },
      { cn: '請加滿油。', jp: 'レギュラー満タンでお願いします。', romaji: 'Regyuraa mantan de onegaishimasu.' },
      { cn: '要去這裡。', jp: 'ここに行ってください。', romaji: 'Koko ni itte kudasai.' },
      { cn: '還車的地點在哪？', jp: '返却場所はどこですか？', romaji: 'Henkyaku basho wa doko desu ka?' },
    ]
  },
  '飯店': {
    icon: BedDouble,
    list: [
      { cn: '我要辦理入住。', jp: 'チェックインをお願いします。', romaji: 'Chekkuin o onegaishimasu.' },
      { cn: '可以寄放行李嗎？', jp: '荷物を預かってもらえますか？', romaji: 'Nimotsu o azukatte moraemasu ka?' },
      { cn: '早餐是幾點？', jp: '朝食は何時ですか？', romaji: 'Choushoku wa nan-ji desu ka?' },
      { cn: '我要退房。', jp: 'チェックアウトをお願いします。', romaji: 'Chekkuauto o onegaishimasu.' },
    ]
  }
};

export const Translator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<{japanese: string, romaji: string, english: string, chinese?: string, error?: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('用餐');
  const [isFaceToFace, setIsFaceToFace] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState<'me' | 'partner' | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // --- 備案播放功能：解決手機環境不支援 Web Speech API 的問題 ---
  const useFallbackAudio = (text: string, id: string) => {
    // 使用 Google TTS 引擎作為備案
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ja&client=tw-ob`;
    const audio = new Audio(url);
    
    setIsPlaying(id);
    audio.onended = () => setIsPlaying(null);
    audio.onerror = () => {
      setIsPlaying(null);
      alert("抱歉，目前裝置環境無法播放語音。");
    };
    
    audio.play().catch(() => {
      setIsPlaying(null);
      // 提醒使用者可能需要解除靜音模式
    });
  };

  // --- 主要發音邏輯：自動切換原生或備案 ---
  const handlePlayVoice = (text: string, id: string) => {
    // 檢查瀏覽器是否支援原生發音且未被封鎖
    if ('speechSynthesis' in window && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsPlaying(id);
      utterance.onend = () => setIsPlaying(null);
      
      // 如果原生 API 在播放時報錯（如 S20 FE 常見的情況），自動切換到備案
      utterance.onerror = () => useFallbackAudio(text, id);

      window.speechSynthesis.speak(utterance);
    } else {
      // 完全不支援時直接使用備案
      useFallbackAudio(text, id);
    }
  };

  const handleTranslate = useCallback(async (text: string, targetLang: 'ja' | 'zh' = 'ja') => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const data = await translateText(text, targetLang);
      setResult(data);
    } catch (e: any) {
      // 捕捉金鑰外洩錯誤並顯示友善訊息
      const errorMsg = e.message || "";
      const isLeaked = errorMsg.includes("leaked") || JSON.stringify(e).includes("leaked");
      
      setResult({ 
        japanese: "Error", 
        romaji: "Error", 
        english: "Error", 
        chinese: isLeaked ? "API 金鑰已被系統封鎖 (Leaked)" : "翻譯發生錯誤",
        error: errorMsg 
      });
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const startVoiceInput = (target: 'me' | 'partner') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("此瀏覽器不支援語音輸入功能。");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = target === 'me' ? 'zh-TW' : 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingTarget(target);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (target === 'me') {
        setInputText(transcript);
        handleTranslate(transcript, 'ja');
      } else {
        handleTranslate(transcript, 'zh');
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setRecordingTarget(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setRecordingTarget(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 space-y-12">
      
      {/* 頂部 AI 翻譯區 */}
      <section className="bg-white rounded-[2.5rem] border border-[#F0EFEA] shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
        {/* 對方視角 (Partner's View) */}
        <div className={`flex-1 p-8 bg-[#8B1D3D]/5 flex flex-col items-center justify-center text-center transition-all duration-500 relative ${isFaceToFace ? 'rotate-180' : ''}`}>
          <div className="mb-4 opacity-40 flex items-center gap-2">
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Partner's View / 對方視角</span>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#8B1D3D] animate-spin opacity-40" />
              <p className="text-[10px] text-[#8B1D3D] font-bold">翻譯中...</p>
            </div>
          ) : result ? (
            <div className="space-y-4 max-w-xs animate-in zoom-in-95">
              {result.error ? (
                <div className="flex flex-col items-center gap-3 text-red-500">
                  <AlertCircle className="w-10 h-10" />
                  <p className="text-sm font-bold">{result.chinese || '翻譯錯誤'}</p>
                  <p className="text-[9px] opacity-60 text-center">請更新 GitHub Secrets 中的金鑰</p>
                </div>
              ) : (
                 <>
                   <p className="text-3xl font-noto-serif font-black text-[#2D2D2D] leading-tight">
                     {result.japanese}
                   </p>
                   <p className="text-sm font-bold text-[#8B1D3D]/60 uppercase tracking-wide">
                     {result.english}
                   </p>
                 </>
              )}
            </div>
          ) : (
            <p className="text-xs font-bold text-[#A09E97] italic">點擊下方按鈕進行 AI 翻譯</p>
          )}

          <button 
            onClick={() => startVoiceInput('partner')}
            className={`absolute bottom-6 right-6 p-4 rounded-full shadow-lg z-20 ${
              isRecording && recordingTarget === 'partner' 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-white text-[#A09E97] border border-[#F0EFEA]'
            }`}
          >
            {isRecording && recordingTarget === 'partner' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative h-[1px] bg-[#F0EFEA] flex items-center justify-center">
          <button 
            onClick={() => setIsFaceToFace(!isFaceToFace)}
            className="absolute z-30 p-2.5 bg-white border border-[#F0EFEA] rounded-full shadow-sm text-[#A09E97] active:scale-90 transition-all"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isFaceToFace ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex-1 p-8 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <Sparkles className="w-4 h-4 text-[#8B1D3D]" />
              <h2 className="text-lg font-serif font-bold text-[#2D2D2D]">AI 翻譯 (中文 &rarr; 日文)</h2>
            </div>

            <div className="relative mb-6">
              <textarea 
                className="w-full bg-[#F5F4F0] border border-[#F0EFEA] rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#8B1D3D] min-h-[100px] resize-none pr-16"
                placeholder="輸入中文或使用語音..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleTranslate(inputText, 'ja')}
                    disabled={loading || !inputText}
                    className="p-3 bg-[#8B1D3D] text-white rounded-xl shadow-lg disabled:opacity-30 active:scale-95 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
              </div>
            </div>

            {result && !loading && !result.error && (
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => handlePlayVoice(result.japanese, 'result')}
                  className="p-2.5 bg-[#8B1D3D]/5 text-[#8B1D3D] rounded-full active:scale-90 transition-all flex items-center gap-2"
                >
                  {isPlaying === 'result' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-[10px] font-bold">朗讀日文</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 求生日語手冊區塊 */}
      <section className="space-y-8">
        <h3 className="text-3xl font-noto-serif font-bold text-[#2D2D2D] px-2">求生日語</h3>
        
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 px-1">
          {Object.keys(COMMON_PHRASES).map(cat => {
            const Icon = COMMON_PHRASES[cat].icon;
            const isActive = activeCategory === cat;
            return (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full whitespace-nowrap font-bold text-[11px] transition-all ${
                  isActive ? 'bg-[#8B1D3D] text-white shadow-md' : 'bg-white text-[#A09E97] border border-[#F0EFEA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5">
          {COMMON_PHRASES[activeCategory].list.map((phrase, idx) => (
            <div 
              key={idx}
              className="group flex items-center justify-between p-7 bg-white border border-[#F0EFEA] rounded-[1.5rem] shadow-sm hover:border-[#8B1D3D]/20 transition-all active:scale-[0.99] cursor-pointer"
              onClick={() => handlePlayVoice(phrase.jp, `phrase-${idx}`)}
            >
              <div className="flex-1 space-y-1.5">
                <p className="text-[13px] text-[#8C8C8C] font-bold">{phrase.cn}</p>
                <p className="text-3xl font-noto-serif font-black text-[#2D2D2D] leading-snug tracking-tight">{phrase.jp}</p>
                <p className="text-lg font-cormorant font-bold text-[#B0B0B0] italic">{phrase.romaji}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button 
                   onClick={(e) => { e.stopPropagation(); handlePlayVoice(phrase.jp, `phrase-${idx}`); }}
                   className="p-3.5 bg-[#F5F4F0] rounded-full text-[#A09E97] hover:text-[#8B1D3D] hover:bg-[#8B1D3D]/5 transition-all"
                >
                  {isPlaying === `phrase-${idx}` ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button 
                   onClick={(e) => { e.stopPropagation(); copyToClipboard(phrase.jp); }}
                   className="p-3.5 bg-white border border-[#F0EFEA] rounded-full text-[#A09E97] hover:text-[#8B1D3D] transition-all"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
