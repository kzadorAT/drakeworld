import React, { useState, useRef, useEffect } from "react";
import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm";
import './ChatAI.css';

const ChatAI = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [loadingText, setLoadingText] = useState('Presiona "Inicializar chat" para cargar el modelo.');
    const containerRef = useRef(null);
    const [engine, setEngine] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    const initializeEngine = async () => {
        setIsInitializing(true);
        try {
            const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
            const newEngine = await CreateWebWorkerMLCEngine(
                worker,
                'Llama-3-8B-Instruct-q4f32_1-MLC-1k',
                {
                    initProgressCallback: (info) => {
                        setLoadingText(`${info.text}`);
                        if (info.progress === 1) {
                            setIsButtonDisabled(false);
                            setIsInitialized(true);
                            setIsInitializing(false);
                        }
                    }
                }
            );
            setEngine(newEngine);
        } catch (error) {
            console.error("Error al inicializar el motor:", error);
            setIsInitializing(false);
            setLoadingText("Error al cargar el modelo. Inténtalo de nuevo.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputValue.trim() === '') {
            return;
        }

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputValue('');
        setIsButtonDisabled(true);

        let newMessages = [...messages, userMessage];

        const botMessages = { role: 'assistant', content: '' };
        newMessages.push(botMessages);
        setMessages(newMessages);

        const chunks = await engine.chat.completions.create({
            messages: newMessages.slice(0, -1),
            stream: true
        });

        let reply = '';

        for await (const chunk of chunks) {
            const choice = chunk.choices[0];
            const content = choice?.delta?.content ?? '';
            reply += content;
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].content = reply;
                return updatedMessages;
            });

            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        setIsButtonDisabled(false);
    };

    return (
        <div className="chat-container">
            {!isInitialized && !isInitializing && (
                <button onClick={initializeEngine}>Inicializar chat</button>
            )}
            <div ref={containerRef}>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index} className={`message ${message.role}`}>
                            <span>{message.role === 'assistant' ? 'Drake IA: ' : 'Tú: '}</span>
                            <p>{message.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Escribe aquí tu pregunta..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={!isInitialized}
                />
                <button type="submit" disabled={!isInitialized || isButtonDisabled}>Enviar</button>
            </form>
            <small>{loadingText}</small>

            <template id="message-template">
                <li className="message">
                    <span></span>
                    <p></p>
                </li>
            </template>
        </div>
    );
};

export default ChatAI;
