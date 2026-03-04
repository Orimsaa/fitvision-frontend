"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import anime from "animejs";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const suggestedQuestions = [
    { icon: "fitness_center", text: "ท่า Squat ที่ถูกต้องเป็นยังไง?" },
    { icon: "healing", text: "หัวเข่าเข้าในตอน Squat แก้ยังไง?" },
    { icon: "exercise", text: "Warm-up ก่อน Bench Press ควรทำอะไร?" },
    { icon: "trending_up", text: "เทคนิคเพิ่มน้ำหนัก Deadlift อย่างปลอดภัย" },
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
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: anime.stagger(80, { start: 100 })
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

        // Auto-resize textarea back to default
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
            setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Error: ${err.message || "Failed to get response"}. Please try again.` }]);
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
        // Auto-grow
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    // Simple markdown-ish rendering
    const renderContent = (text: string) => {
        // Split by lines and render
        return text.split('\n').map((line, i) => {
            // Bold
            const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
            // Bullet points
            if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                const bulletText = line.trim().replace(/^[-•]\s*/, '');
                const parsed = bulletText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
                return (
                    <div key={i} className="flex gap-2 items-start ml-1 my-0.5">
                        <span className="text-primary mt-1.5 text-[6px]">●</span>
                        <span dangerouslySetInnerHTML={{ __html: parsed }} />
                    </div>
                );
            }
            // Numbered lists
            const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
            if (numMatch) {
                const parsed = numMatch[2].replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
                return (
                    <div key={i} className="flex gap-2 items-start ml-1 my-0.5">
                        <span className="text-primary text-xs font-bold min-w-[16px]">{numMatch[1]}.</span>
                        <span dangerouslySetInnerHTML={{ __html: parsed }} />
                    </div>
                );
            }
            // Empty line = paragraph break
            if (line.trim() === '') return <div key={i} className="h-2" />;
            // Normal line
            return <p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: boldParsed }} />;
        });
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100dvh-64px)] md:h-screen max-w-3xl mx-auto w-full">

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 scrollbar-hide">

                    {/* Empty State */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full gap-6 animate-chat-in opacity-0">
                            {/* Logo */}
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-white mb-2">FitVision AI Coach</h1>
                                <p className="text-slate-500 text-sm max-w-sm">ถามอะไรก็ได้เกี่ยวกับท่าออกกำลังกาย ฟอร์ม หรือการป้องกันอาการบาดเจ็บ</p>
                            </div>

                            {/* Suggested Questions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(q.text)}
                                        className="animate-chat-in opacity-0 flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all text-left group"
                                    >
                                        <span className="material-symbols-outlined text-primary/60 group-hover:text-primary text-lg transition-colors">{q.icon}</span>
                                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{q.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                                </div>
                            )}
                            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-primary text-black rounded-br-md font-medium"
                                : "bg-surface-dark border border-white/5 text-slate-300 rounded-bl-md"
                                }`}
                            >
                                {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                            </div>
                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1">
                                    <span className="material-symbols-outlined text-white text-sm">person</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                            </div>
                            <div className="bg-surface-dark border border-white/5 rounded-2xl rounded-bl-md px-5 py-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Input Bar */}
                <div className="border-t border-white/5 bg-surface-darker/80 backdrop-blur-lg p-3 md:p-4 pb-safe">
                    <div className="flex items-end gap-2 max-w-3xl mx-auto">
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleTextareaInput}
                                onKeyDown={handleKeyDown}
                                placeholder="ถามเกี่ยวกับท่าออกกำลังกาย..."
                                rows={1}
                                className="w-full bg-surface-dark border border-white/10 focus:border-primary/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none resize-none transition-colors"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                            className="h-[44px] w-[44px] rounded-xl bg-primary text-black flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-xl">send</span>
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-700 mt-2">Powered by Gemini AI via KKU Gateway</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
