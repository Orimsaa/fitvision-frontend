"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import anime from "animejs";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const suggestedQuestions = [
    { icon: "fitness_center", text: "ท่า Squat ที่ถูกต้องเป็นยังไง?", tag: "Form" },
    { icon: "healing", text: "หัวเข่าเข้าในตอน Squat แก้ยังไง?", tag: "Fix" },
    { icon: "exercise", text: "Warm-up ก่อน Bench Press ควรทำอะไร?", tag: "Prep" },
    { icon: "trending_up", text: "เทคนิคเพิ่มน้ำหนัก Deadlift อย่างปลอดภัย", tag: "Advance" },
    { icon: "self_improvement", text: "โปรแกรมสร้างกล้ามเนื้อสำหรับมือใหม่", tag: "Program" },
    { icon: "monitor_heart", text: "วิธีหายใจที่ถูกต้องขณะยกเวท", tag: "Technique" },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        anime({
            targets: '.animate-chat-in',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(80, { start: 200 })
        });
        anime({
            targets: '.animate-glow-pulse',
            boxShadow: [
                '0 0 20px rgba(57,255,20,0.1)',
                '0 0 40px rgba(57,255,20,0.2)',
                '0 0 20px rgba(57,255,20,0.1)',
            ],
            duration: 3000,
            easing: 'easeInOutSine',
            loop: true
        });
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMessage: Message = { role: "user", content: messageText };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        if (inputRef.current) inputRef.current.style.height = "auto";

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
        } catch (err: any) {
            setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ขออภัย เกิดข้อผิดพลาด: ${err.message || "ไม่สามารถเชื่อมต่อ AI ได้"} ลองใหม่อีกครั้งนะครับ` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    const renderContent = (text: string) => {
        return text.split('\n').map((line, i) => {
            const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
            if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                const bulletText = line.trim().replace(/^[-•]\s*/, '');
                const parsed = bulletText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
                return (
                    <div key={i} className="flex gap-2.5 items-start ml-1 my-1">
                        <span className="text-primary mt-2 text-[5px]">●</span>
                        <span dangerouslySetInnerHTML={{ __html: parsed }} />
                    </div>
                );
            }
            const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
            if (numMatch) {
                const parsed = numMatch[2].replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
                return (
                    <div key={i} className="flex gap-2.5 items-start ml-1 my-1">
                        <span className="text-primary text-xs font-bold min-w-[18px] mt-0.5">{numMatch[1]}.</span>
                        <span dangerouslySetInnerHTML={{ __html: parsed }} />
                    </div>
                );
            }
            if (line.trim() === '') return <div key={i} className="h-3" />;
            return <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: boldParsed }} />;
        });
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100dvh-64px)] md:h-screen max-w-4xl mx-auto w-full relative">

                {/* Background ambient glow */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]"></div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 scrollbar-hide relative z-10">

                    {/* Empty State — Premium Hero */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full gap-8">

                            {/* AI Avatar with glow */}
                            <div className="animate-chat-in opacity-0 relative">
                                <div className="animate-glow-pulse w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center relative z-10">
                                    <span className="material-symbols-outlined text-primary text-4xl">neurology</span>
                                </div>
                                <div className="absolute -inset-3 bg-primary/10 rounded-3xl blur-xl"></div>
                            </div>

                            {/* Title */}
                            <div className="text-center animate-chat-in opacity-0">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                                    FitVision <span className="text-primary">AI Coach</span>
                                </h1>
                                <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                                    ถามอะไรก็ได้เกี่ยวกับท่าออกกำลังกาย เทคนิค ฟอร์ม<br />หรือการป้องกันอาการบาดเจ็บ
                                </p>
                            </div>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap justify-center gap-2 animate-chat-in opacity-0">
                                {["Biomechanics Expert", "Form Analysis", "Injury Prevention", "Thai & English"].map((f, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[11px] text-slate-500 font-medium">
                                        {f}
                                    </span>
                                ))}
                            </div>

                            {/* Suggested Questions Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(q.text)}
                                        className="animate-chat-in opacity-0 flex items-start gap-3 p-4 rounded-2xl border border-white/5 bg-surface-dark hover:bg-white/[0.04] hover:border-primary/30 transition-all text-left group relative overflow-hidden"
                                    >
                                        {/* Hover glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all relative z-10">
                                            <span className="material-symbols-outlined text-primary text-lg">{q.icon}</span>
                                        </div>
                                        <div className="relative z-10 flex-1 min-w-0">
                                            <span className="text-[10px] text-primary/60 font-bold uppercase tracking-wider">{q.tag}</span>
                                            <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors mt-0.5 leading-snug">{q.text}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="material-symbols-outlined text-primary text-sm">neurology</span>
                                </div>
                            )}
                            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-primary text-black rounded-br-sm font-medium"
                                : "bg-surface-dark border border-white/5 text-slate-300 rounded-bl-sm"
                                }`}
                            >
                                {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                            </div>
                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center shrink-0 mt-1">
                                    <span className="material-symbols-outlined text-slate-300 text-sm">person</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                                <span className="material-symbols-outlined text-primary text-sm animate-pulse">neurology</span>
                            </div>
                            <div className="bg-surface-dark border border-white/5 rounded-2xl rounded-bl-sm px-5 py-4">
                                <div className="flex gap-1.5 items-center">
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    <span className="text-[11px] text-slate-600 ml-2">AI กำลังคิด...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Premium Input Bar */}
                <div className="relative z-10 border-t border-white/5 bg-gradient-to-t from-background-dark via-background-dark to-transparent p-4 md:p-5 pb-safe">
                    <div className="flex items-end gap-3 max-w-3xl mx-auto">
                        <div className="flex-1 relative group">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleTextareaInput}
                                onKeyDown={handleKeyDown}
                                placeholder="ถามอะไรก็ได้เกี่ยวกับการออกกำลังกาย..."
                                rows={1}
                                className="w-full bg-surface-dark border border-white/10 focus:border-primary/40 rounded-2xl px-5 py-3.5 pr-12 text-sm text-white placeholder:text-slate-600 outline-none resize-none transition-all focus:shadow-[0_0_15px_rgba(57,255,20,0.08)]"
                                disabled={isLoading}
                            />
                            {/* Character hint */}
                            {input.length > 0 && (
                                <span className="absolute right-4 bottom-3.5 text-[10px] text-slate-700">{input.length}</span>
                            )}
                        </div>
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                            className="h-[48px] w-[48px] rounded-2xl bg-primary text-black flex items-center justify-center shrink-0 disabled:opacity-20 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all active:scale-90"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_upward</span>
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-700 mt-2.5 flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-[10px]">auto_awesome</span>
                        Powered by Gemini AI via KKU Gateway
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
