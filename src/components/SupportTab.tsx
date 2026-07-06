import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  Activity, 
  Terminal, 
  HelpCircle,
  RefreshCw,
  Clock,
  PhoneCall
} from "lucide-react";
import { Message } from "../types";

interface SupportTabProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const SupportTab: React.FC<SupportTabProps> = ({ messages, setMessages }) => {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions in Khmer
  const suggestedQuestions = [
    { text: "តើប្រព័ន្ធពិនិត្យមេរោគដំណើរការយ៉ាងដូចម្តេច?", label: "របៀបពិនិត្យមេរោគ" },
    { text: "តើខ្ញុំអាចធ្វើសមកាលកម្មទិន្នន័យ (Sync) យ៉ាងដូចម្តេច?", label: "ការធ្វើសមកាលកម្ម" },
    { text: "របៀបបម្រុងទុកទិន្នន័យ (Backup)?", label: "ការបម្រុងទុកទិន្នន័យ" },
    { text: "តើកម្មវិធីទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់ដោយរបៀបណា?", label: "ការផ្ទៀងផ្ទាត់កម្មវិធី" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ sender: m.sender, text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error("Chat connection failed.");
      }

      const result = await response.json();
      
      const supportMessage: Message = {
        id: Math.random().toString(),
        sender: "support",
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, supportMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Math.random().toString(),
        sender: "support",
        text: "សូមអភ័យទោស! មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើការជជែក។ សូមព្យាយាមម្តងទៀតនៅពេលបន្តិចទៀត។",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="support-container">
      {/* Informative Side Card */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-linear-to-b from-indigo-600 to-indigo-850 text-white rounded-2xl p-6 border border-indigo-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <PhoneCall className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/10">
              <Clock className="w-3.5 h-3.5" />
              សេវាបម្រើអតិថិជន ២៤/៧
            </span>
            <h3 className="text-xl font-bold mb-2">ជំនួយការបច្ចេកទេសផ្ទាល់</h3>
            <p className="text-indigo-100 text-xs leading-relaxed mb-4">
              យើងខ្ញុំមានភ្នាក់ងារបច្ចេកទេស និងម៉ាស៊ីន AI វៃឆ្លាតរង់ចាំឆ្លើយតបរាល់ចម្ងល់ ឬដោះស្រាយបញ្ហាបច្ចេកវិទ្យារបស់លោកអ្នកគ្រប់ពេលវេលា។
            </p>
            <div className="space-y-3 pt-3 border-t border-white/20 text-xs">
              <div className="flex items-center justify-between text-indigo-150">
                <span>មធ្យមភាគពេលឆ្លើយតប៖</span>
                <span className="font-bold text-white bg-emerald-500/30 px-2 py-0.5 rounded-sm">ភ្លាមៗ (Instant)</span>
              </div>
              <div className="flex items-center justify-between text-indigo-150">
                <span>ភាសាគាំទ្រ៖</span>
                <span className="font-bold text-white">ភាសាខ្មែរ / English</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Quick Questions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-xs">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            សំនួរដែលសួរញឹកញាប់
          </h4>
          <div className="flex flex-col gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                className="text-left text-xs bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-850 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-200"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Terminal Area */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                ជំនួយការបច្ចេកទេស Khmer App Store
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span>អនឡាញ ២៤ម៉ោង</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setMessages([
              {
                id: "welcome",
                sender: "support",
                text: "សួស្តី! ខ្ញុំជាភ្នាក់ងារជំនួយការបច្ចេកទេស ២៤/៧ របស់ Khmer App Store។ តើខ្ញុំអាចជួយលោកអ្នកអំពីអ្វីខ្លះថ្ងៃនេះ? ខ្ញុំអាចជួយដោះស្រាយបញ្ហាទាញយក ការពិនិត្យមេរោគ និងការធ្វើសមកាលកម្មទិន្នន័យ។",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ])}
            title="Clear Chat History"
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                m.sender === "user" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}>
                {m.sender === "user" ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
              </div>
              <div className="space-y-1">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-indigo-650 text-white rounded-tr-none"
                    : "bg-slate-50 dark:bg-slate-850 text-slate-850 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none"
                }`}>
                  {m.text}
                </div>
                <div className={`text-[10px] text-slate-400 px-1 font-mono ${
                  m.sender === "user" ? "text-right" : "text-left"
                }`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-full shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
          className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2 items-center"
        >
          <input
            id="chat-input-field"
            type="text"
            placeholder="សរសេរសំណួររបស់អ្នកនៅទីនេះ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/85 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-750 dark:text-slate-100 focus:outline-hidden"
          />
          <button
            type="submit"
            id="send-chat-btn"
            disabled={!inputText.trim() || isTyping}
            className="p-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
