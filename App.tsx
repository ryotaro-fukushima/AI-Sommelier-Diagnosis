import React, { useState, useRef, useEffect } from 'react';
import type { Message, UserInfo } from './types';
import { getDrinkRecommendation } from './services/geminiService';
import { SommelierIcon, UserIcon, SendIcon } from './components/icons';
import ResultCard from './components/ResultCard';

const questions = [
    "こんばんは。AIソムリエです。今夜のあなたに最高の一杯を提案します。まず、現在の体調と気分を教えていただけますか？（例：疲れている、元気、リラックスしたい）",
    "ありがとうございます。次に、今日の忙しさについて教えてください。（例：休みで時間がある、仕事で疲れた、明日は早い）",
    "承知いたしました。今夜食べる予定の料理は何ですか？",
    "最後に、普段よく飲むお酒の種類や、味の好みを教えてください。（例：ビールが好き、甘いカクテル、辛口の日本酒）"
];

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{ id: Date.now(), sender: 'ai', text: questions[0] }]);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || isComplete) return;

        const userMessage: Message = { id: Date.now(), sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        const newUserInfo = { ...userInfo };
        const keys: (keyof UserInfo)[] = ['condition', 'busyness', 'food', 'preference'];
        newUserInfo[keys[currentQuestionIndex]] = inputValue;
        setUserInfo(newUserInfo);

        const nextQuestionIndex = currentQuestionIndex + 1;
        
        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setTimeout(() => {
                 const aiMessage: Message = { id: Date.now() + 1, sender: 'ai', text: questions[nextQuestionIndex] };
                 setMessages(prev => [...prev, aiMessage]);
            }, 500);
        } else {
            setIsLoading(true);
            const finalRecommendation = await getDrinkRecommendation(newUserInfo as UserInfo);
            
            const resultMessage: Message = { id: Date.now() + 2, sender: 'ai', text: finalRecommendation, isResult: true };
            setMessages(prev => [...prev, resultMessage]);
            setIsLoading(false);
            setIsComplete(true);
        }
    };

    const handleReset = () => {
        setMessages([{ id: Date.now(), sender: 'ai', text: questions[0] }]);
        setUserInfo({});
        setCurrentQuestionIndex(0);
        setInputValue('');
        setIsLoading(false);
        setIsComplete(false);
    };

    return (
        <div className="flex flex-col h-screen font-sans bg-gray-50">
            <header className="bg-gray-800 text-white p-4 shadow-md">
                <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <span className="text-3xl text-cyan-400 font-mono tracking-tighter">診断メーカー</span>
                    <span className="text-xl font-light">風</span>
                    <span className="text-2xl">AIソムリエ</span>
                </h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <SommelierIcon />}
                            <div className={`max-w-lg ${msg.sender === 'user' ? 'order-1' : ''}`}>
                                {msg.isResult ? (
                                    <ResultCard text={msg.text} />
                                ) : (
                                    <div className={`px-5 py-3 rounded-2xl ${msg.sender === 'ai' ? 'bg-white shadow' : 'bg-cyan-500 text-white'}`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                )}
                            </div>
                            {msg.sender === 'user' && <UserIcon />}
                        </div>
                    ))}
                     {isLoading && !isComplete && (
                        <div className="flex items-start gap-4 justify-start">
                            <SommelierIcon />
                            <div className="px-5 py-3 rounded-2xl bg-white shadow">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto">
                    {isComplete ? (
                        <div className="flex justify-center">
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition duration-200"
                            >
                                新しい診断を始める
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="メッセージを入力..."
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 disabled:bg-gray-100"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputValue.trim()}
                                className="p-3 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default App;
