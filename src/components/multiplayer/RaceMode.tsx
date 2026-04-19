'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type RaceState = 'idle' | 'hosting' | 'joining' | 'ready' | 'racing' | 'finished';

interface SyncPayload {
    type: 'RACE_TEXT' | 'RACE_START' | 'CURSOR_UPDATE' | 'RACE_FINISH';
    text?: string;
    progress?: number;
    wpm?: number;
    winner?: string;
}

const generateText = () => {
    const words = "the quick brown fox jumps over the lazy dog typed text race words simple fast speed accuracy time typing practice mode test".split(" ");
    let out = [];
    for(let i=0; i<30; i++) out.push(words[Math.floor(Math.random()*words.length)]);
    return out.join(" ");
};

export function RaceMode() {
    const [state, setState] = useState<RaceState>('idle');
    const [joinCode, setJoinCode] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [text, setText] = useState('');
    
    // Remote opponent state
    const [remoteProgress, setRemoteProgress] = useState(0);
    const [remoteWpm, setRemoteWpm] = useState(0);

    // Local state
    const [localProgress, setLocalProgress] = useState(0);
    const [localWpm, setLocalWpm] = useState(0);
    const [inputText, setInputText] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [winner, setWinner] = useState<string | null>(null);

    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);

    useEffect(() => {
        return () => { peerRef.current?.destroy(); };
    }, []);

    const broadcast = (payload: SyncPayload) => {
        connRef.current?.send(payload);
    };

    const handleData = useCallback((data: unknown) => {
        const payload = data as SyncPayload;
        if (payload.type === 'RACE_TEXT' && payload.text) {
            setText(payload.text);
            setState('ready');
        } else if (payload.type === 'RACE_START') {
            setState('racing');
            setStartTime(Date.now());
        } else if (payload.type === 'CURSOR_UPDATE') {
            if (payload.progress !== undefined) setRemoteProgress(payload.progress);
            if (payload.wpm !== undefined) setRemoteWpm(payload.wpm);
        } else if (payload.type === 'RACE_FINISH') {
            setWinner('Opponent');
            setState('finished');
        }
    }, []);

    const setupConnection = (conn: DataConnection, isHost: boolean) => {
        conn.on('open', () => {
            connRef.current = conn;
            if (isHost) {
                const newText = generateText();
                setText(newText);
                setState('ready');
                conn.send({ type: 'RACE_TEXT', text: newText });
            }
        });
        conn.on('data', handleData);
        conn.on('close', () => {
            connRef.current = null;
            setState('idle');
            toast.error('Opponent disconnected');
        });
    };

    const hostRace = () => {
        setState('hosting');
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setRoomCode(code);
        const peer = new Peer(`typemaster-race-${code}`);
        peerRef.current = peer;
        peer.on('connection', (conn) => setupConnection(conn, true));
        peer.on('error', () => { toast.error('Error starting server'); setState('idle'); });
    };

    const joinRace = () => {
        if (joinCode.length !== 6) return toast.error('Invalid code');
        setState('joining');
        const peer = new Peer();
        peerRef.current = peer;
        peer.on('open', () => {
            const conn = peer.connect(`typemaster-race-${joinCode}`);
            setupConnection(conn, false);
        });
        peer.on('error', () => { toast.error('Connection failed'); setState('idle'); });
    };

    const startRace = () => {
        broadcast({ type: 'RACE_START' });
        setState('racing');
        setStartTime(Date.now());
    };

    const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (state !== 'racing') return;
        const val = e.target.value;
        if (!text.startsWith(val)) return;
        
        setInputText(val);
        const progress = val.length / text.length;
        setLocalProgress(progress);
        
        const elapsed = (Date.now() - (startTime || Date.now())) / 60000;
        const wpmCalc = elapsed > 0 ? Math.round((val.length / 5) / elapsed) : 0;
        setLocalWpm(wpmCalc);
        
        broadcast({ type: 'CURSOR_UPDATE', progress, wpm: wpmCalc });

        if (val === text) {
            broadcast({ type: 'RACE_FINISH' });
            setWinner('You');
            setState('finished');
        }
    };

    return (
        <Card className="p-8 max-w-2xl mx-auto mt-10 shadow-2xl relative overflow-hidden bg-black/40 border border-white/10">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Key/> Multi-Player Race</h1>
            {state === 'idle' && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={hostRace} className="flex-1 whitespace-nowrap">Host Race</Button>
                    <div className="flex gap-2 flex-1">
                        <input className="bg-black/50 border border-white/20 p-2 rounded w-full outline-none focus:border-primary" placeholder="6 digit code" onChange={e => setJoinCode(e.target.value)} />
                        <Button variant="secondary" onClick={joinRace}>Join</Button>
                    </div>
                </div>
            )}
            
            {(state === 'hosting' || state === 'joining') && (
                <div className="text-center py-10 font-mono text-xl animate-pulse text-muted-foreground flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin w-5 h-5" />
                    {state === 'hosting' ? `Waiting for opponent... Code: ${roomCode}` : 'Connecting...'}
                </div>
            )}

            {state === 'ready' && (
                <div className="text-center py-10">
                    <h2 className="text-2xl mb-6 text-green-400 font-bold">Opponent Connected!</h2>
                    {roomCode ? <Button onClick={startRace} size="lg" className="w-48 text-lg font-bold">Start Race</Button> : <p className="text-muted-foreground">Waiting for host to start the match...</p>}
                </div>
            )}

            {state === 'racing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-blue-400 min-w-32">You ({localWpm} WPM)</span>
                        <div className="flex-1 mx-4 bg-black/50 rounded-full h-6 overflow-hidden relative shadow-inner">
                            <motion.div className="bg-linear-to-r from-blue-600 to-blue-400 h-full" style={{width: `${localProgress * 100}%`}} />
                        </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-purple-400 min-w-32">Opponent ({remoteWpm} WPM)</span>
                        <div className="flex-1 mx-4 bg-black/50 rounded-full h-6 overflow-hidden relative shadow-inner">
                            <motion.div className="bg-linear-to-r from-purple-600 to-purple-400 h-full" style={{width: `${remoteProgress * 100}%`}} />
                        </div>
                    </div>

                    <div className="text-xl font-mono leading-relaxed p-6 bg-black/60 rounded-xl border border-white/5 select-none text-wrap wrap-break-word">
                        <span className="text-primary bg-primary/20">{text.slice(0, inputText.length)}</span>
                        <span className="text-muted-foreground">{text.slice(inputText.length)}</span>
                    </div>

                    <input 
                        autoFocus
                        className="w-full bg-black/50 border-2 border-primary/50 text-xl font-mono p-4 rounded-xl outline-none focus:border-primary shadow-lg transition-colors placeholder:text-muted-foreground/50"
                        placeholder="Start typing..."
                        value={inputText}
                        onChange={handleType}
                    />
                </motion.div>
            )}

            {state === 'finished' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                    <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    <h2 className="text-4xl font-black mb-2 tracking-tight">{winner} Won!</h2>
                    <p className="text-muted-foreground mb-8 text-lg">Final speed: <span className="font-bold text-foreground">{winner === 'You' ? localWpm : remoteWpm} WPM</span></p>
                    <Button onClick={() => window.location.reload()} size="lg">Race Again</Button>
                </motion.div>
            )}
        </Card>
    );
}
