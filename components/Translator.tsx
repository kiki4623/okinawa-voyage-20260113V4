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

const COMMON_PHRASES: Record<string, { icon: any; list: Phrase[] }> = {
  用餐: {
    icon: Utensils,
    list: [
      { cn: '我有訂位。', jp: '予約しています。', romaji: 'Yoyaku shiteimasu.' },
      { cn: '請給我這個。', jp: 'これをください。', romaji: 'Kore o kudasai.' },
      { cn: '結帳。', jp: 'お会計をお願いします。', romaji: 'O-kaikei o onegaishimasu.' },
      { cn: '兩個人。', jp: '二人です。', romaji: 'Futari desu.' }
    ]
  },
  購物: {
    icon: ShoppingBag,
    list: [
      { cn: '多少錢？', jp: 'いくらですか？', romaji: 'Ikura desu ka?' },
      { cn: '可以試穿嗎？', jp: '試着してもいいですか？', romaji: 'Shichaku shitemo ii desu ka?' },
      { cn: '有免稅嗎？', jp: '免税はできますか？', romaji: 'Menzei wa dekimasu ka?' },
      { cn: '可以用信用卡嗎？', jp: 'クレジットカードは使えますか？', romaji: 'Kurejitto kaado wa tsukaemasu ka?' }
    ]
  },
  交通: {
    icon: Car,
    list: [
      { cn: '這裡可以停車嗎？', jp: 'ここに駐車できますか？', romaji: 'Koko ni chuusha dekimasu ka?' },
      { cn: '請加滿油。', jp: 'レギュラー満タンでお願いします。', romaji: 'Regyuraa mantan de onegaishimasu.' },
      { cn: '要去這裡。', jp: 'ここに行ってください。', romaji: 'Koko ni itte kudasai.' },
      { cn: '還車的地點在哪？', jp: '返却場所はどこですか？', romaji: 'Henkyaku basho wa doko desu ka?' }
    ]
  },
  飯店: {
    icon: BedDouble,
    list: [
      { cn: '我要辦理入住。', jp: 'チェックインをお願いします。', romaji: 'Chekkuin o onegaishimasu.' },
      { cn: '可以寄放行李嗎？', jp: '荷物を預かってもらえますか？', romaji: 'Nimotsu o azukatte moraemasu ka?' },
      { cn: '早餐是幾點？', jp: '朝食は何時ですか？', romaji: 'Choushoku wa nan-ji desu ka?' },
      { cn: '我要退房。', jp: 'チェックアウトをお願いします。', romaji: 'Chekkuauto o onegaishimasu.' }
    ]
  }
};

export const Translator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('用餐');
  const [isFaceToFace, setIsFaceToFace] = useState(true);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  /* =========================
     🔊 語音播放（強化版）
  ========================= */

  const playWithFallback = (text: string, id: string) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=ja&client=tw-ob`;
    const audio = new Audio(url);

    audio.onplay = () => setIsPlaying(id);
    audio.onended = () => setIsPlaying(null);
    audio.onerror = (e) => {
      console.error('Fallback TTS error', e);
      setIsPlaying(null);
      alert('語音播放失敗（可能被瀏覽器限制）');
    };

    audio.play().catch((err) => {
      console.error('audio.play rejected', err);
      setIsPlaying(null);
    });
  };

  const speakJapanese = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) {
      playWithFallback(text, id);
      return;
    }

    const synth = window.speechSynthesis;

    const speak = () => {
      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP';
        utter.rate = 0.9;

        const voices = synth.getVoices();
        const jaVoice = voices.find((v) => v.lang?.startsWith('ja'));
        if (jaVoice) utter.voice = jaVoice;

        utter.onstart = () => setIsPlaying(id);
        utter.onend = () => setIsPlaying(null);
        utter.onerror = (e) => {
          console.error('SpeechSynthesis error', e);
          playWithFallback(text, id);
        };

        synth.cancel();
        synth.speak(utter);
      } catch (e) {
        console.error('Speech exception', e);
        playWithFallback(text, id);
      }
    };

    if (synth.getVoices().length > 0) {
      speak();
    } else {
      synth.onvoiceschanged = speak;
      setTimeout(speak, 800);
    }
  };

  /* ========================= */

  const handleTranslate = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const data = await translateText(text, 'ja');
      setResult(data);
    } catch (e: any) {
      setResult({
        japanese: 'Error',
        english: '',
        chinese: '翻譯失敗'
      });
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <div className="space-y-10 pb-20">
      <section className="bg-white rounded-3xl p-6 space-y-4">
        <textarea
          className="w-full p-4 rounded-xl bg-gray-100"
          placeholder="輸入中文"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={() => handleTranslate(inputText)}
          className="bg-[#8B1D3D] text-white px-4 py-2 rounded-xl"
        >
          翻譯
        </button>

        {result && (
          <div className="space-y-2">
            <p className="text-3xl font-bold">{result.japanese}</p>
            <button
              onClick={() => speakJapanese(result.japanese, 'main')}
              className="flex items-center gap-2 text-[#8B1D3D]"
            >
              {isPlaying === 'main' ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Volume2 />
              )}
              朗讀日文
            </button>
          </div>
        )}
      </section>

      <section className="space-y-6">
        {COMMON_PHRASES[activeCategory].list.map((p, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500">{p.cn}</p>
              <p className="text-2xl font-bold">{p.jp}</p>
              <p className="italic text-gray-400">{p.romaji}</p>
            </div>
            <button
              onClick={() => speakJapanese(p.jp, `phrase-${i}`)}
              className="p-3 rounded-full bg-gray-100"
            >
              {isPlaying === `phrase-${i}` ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Volume2 />
              )}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};
