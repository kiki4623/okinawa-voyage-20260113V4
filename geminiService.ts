import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DayData, AIInsight, WeatherForecastResponse, WeatherDay, VenueDetails } from "./types";

/**
 * 模型設定
 * 註：請確認您的方案支援以下模型名稱。
 * 官方目前穩定版建議為 gemini-1.5-flash 或 gemini-1.5-pro。
 */
const TEXT_MODEL = "gemini-1.5-flash"; 
const PRO_MODEL = "gemini-1.5-pro";
const TTS_MODEL = "gemini-1.5-flash-preview-tts";

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "那霸": { lat: 26.2124, lng: 127.6809 },
  "讀谷": { lat: 26.4017, lng: 127.7500 },
  "名護": { lat: 26.5915, lng: 127.9775 },
  "本部": { lat: 26.6617, lng: 127.8894 },
  "北谷": { lat: 26.3155, lng: 127.7651 },
  "豐見城": { lat: 26.1736, lng: 127.6744 },
  "浦添": { lat: 26.2467, lng: 127.7214 }
};

/**
 * 核心修正：獲取 API Key
 * 在 Vite 環境中，我們統一使用 import.meta.env 讀取。
 * 配合您 GitHub Actions 中的設定，變數名稱為 VITE_API_KEY。
 */
const getApiKey = () => {
  // 這裡必須與 .github/workflows/deploy.yml 中的 env 名稱一致
  const key = import.meta.env.VITE_API_KEY; 
  return (key as string) || "";
};

// --- 輔助函數 ---

const mapWmoToCondition = (code: number): WeatherDay['condition'] => {
  if (code === 0) return 'Sunny';
  if (code >= 1 && code <= 3) return 'Cloudy';
  if (code >= 45 && code <= 67) return 'Rainy';
  if (code >= 80 && code <= 99) return 'Rainy';
  return 'Cloudy';
};

const extractJson = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return null;
  }
};

// --- API 實作函數 ---

export const getTravelInsights = async (dayData: DayData): Promise<AIInsight> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `你是一位沖繩旅遊專家。旅客目前正在進行第 ${dayData.day} 天的行程：「${dayData.title}」。今日計畫包含：${dayData.events.map(e => e.title).join(', ')}。請提供針對這些活動的氣候建議、在地建議、實用日語及文化知識。語言：繁體中文（台灣）。`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weather: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            localPhrase: { type: Type.STRING },
            funFact: { type: Type.STRING },
          },
          required: ["weather", "suggestion", "localPhrase", "funFact"],
        },
      },
    });
    return extractJson(response.text || "{}");
  } catch (error) {
    console.error("Travel Insights Error:", error);
    return {
      weather: "沖繩一月氣溫約 15-20 度，海風較大。",
      suggestion: "建議隨身攜帶輕便防風外套。",
      localPhrase: "Men-sou-re (めんそーれ) - 歡迎光臨",
      funFact: "沖繩是日本櫻花最早盛開的地方。",
    };
  }
};

export const translateText = async (text: string, targetLang: 'ja' | 'zh' = 'ja') => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("API Key is missing. Please check GitHub Secret settings.");
    return { 
      japanese: "設定錯誤", 
      romaji: "No API Key", 
      english: "Config Error", 
      chinese: "請檢查 GitHub Secret 設定", 
      error: "Missing API Key" 
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  let prompt = targetLang === 'ja' 
    ? `將「${text}」翻譯為自然有禮的日語和英語，附上羅馬拼音。回傳 JSON 格式。`
    : `將「${text}」翻譯為道地的繁體中文，附上日文原文和羅馬拼音。回傳 JSON 格式。`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            japanese: { type: Type.STRING },
            romaji: { type: Type.STRING },
            english: { type: Type.STRING },
            chinese: { type: Type.STRING },
          },
          required: ["japanese", "romaji", "english"],
        },
      },
    });
    return extractJson(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    return { 
      japanese: "エラー", 
      romaji: "Error", 
      english: "Failed", 
      chinese: `翻譯錯誤: ${error?.message || '未知錯誤'}`,
      error: error?.message 
    };
  }
};

export const playGeminiTTS = async (text: string, voice: 'Kore' | 'Puck' | 'Zephyr' = 'Kore') => {
  const apiKey = getApiKey();
  if (!apiKey) return;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text: `請朗讀以下文字，口氣自然：${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    
    const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioCtx, 24000, 1);
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const getVenueDetails = async (title: string, location: string): Promise<VenueDetails> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `請搜尋「${location}」的「${title}」旅遊資訊。以 JSON 格式回傳：phone (字串), about (字串陣列), menuItems (物件陣列: original, translated)。語言：繁體中文（台灣）。`;
  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    return extractJson(response.text || "{}") || {};
  } catch (e) {
    console.error("Venue Details Error:", e);
    return {};
  }
};

export const getWeatherForecast = async (location: string = "那霸"): Promise<WeatherForecastResponse> => {
  const coords = LOCATION_COORDS[location] || LOCATION_COORDS["那霸"];
  try {
    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`;
    const omRes = await fetch(omUrl);
    const omData = await omRes.json();
    const forecast: WeatherDay[] = omData.daily.time.map((date: string, i: number) => {
      const d = new Date(date);
      return {
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        tempHigh: Math.round(omData.daily.temperature_2m_max[i]),
        tempLow: Math.round(omData.daily.temperature_2m_min[i]),
        condition: mapWmoToCondition(omData.daily.weather_code[i]),
        description: "預報由 Open-Meteo 提供"
      };
    });

    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const tipResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `這是一份沖繩${location}的一週天氣數據：${JSON.stringify(forecast.slice(0, 3))}。請根據這些氣溫與狀況，給旅客一段簡短、溫馨的穿衣或行程建議（20字內）。語言：繁體中文（台灣）。`,
    });
    
    return {
      locationName: location,
      forecast: forecast,
      overallTip: tipResponse.text || "一月海風較強，建議穿著防風外套防寒。",
      sources: [{ uri: "https://open-meteo.com/", title: "Open-Meteo Weather Data" }]
    };
  } catch (error) {
    console.error("Weather Forecast Error:", error);
    return {
      locationName: location,
      forecast: [
        { date: "1/18", tempHigh: 20, tempLow: 15, condition: "Sunny", description: "晴天" }
      ],
      overallTip: "暫時無法取得即時預報，請注意防風。"
    };
  }
};
