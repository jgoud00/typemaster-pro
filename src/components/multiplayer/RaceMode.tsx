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

    // Multiplayer Handshake - ensure both are ready
    const [localReady, setLocalReady] = useState(false);
    const [remoteReady, setRemoteReady] = useState(false);

    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);

    useEffect(() => {
        return () => { peerRef.current?.destroy(); };
    }, []);

    const broadcast = (payload: SyncPayload) => {
        connRef.current?.send(payload);
    };

    const handleData = useCallback((data: unknown) => {
        const payload = data as any;
        if (payload.type === 'READY') {
            setRemoteReady(true);
            toast.success('Opponent is ready!');
        } else if (payload.type === 'RACE_TEXT' && payload.text) {
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
        // Use a unique namespace to avoid global collisions
        const roomID = `alootype-v2-${code}-${Math.random().toString(36).substr(2, 5)}`;
        setRoomCode(roomID);
        const peer = new Peer(roomID);
        peerRef.current = peer;
        peer.on('connection', (conn) => setupConnection(conn, true));
        peer.on('error', (err) => { 
            console.error('Peer error:', err);
            toast.error('Error starting server'); 
            setState('idle'); 
        });
    };

    const joinRace = () => {
        if (!joinCode) return toast.error('Enter a room code');
        setState('joining');
        const peer = new Peer();
        peerRef.current = peer;
        peer.on('open', () => {
            const conn = peer.connect(joinCode);
            setupConnection(conn, false);
        });
        peer.on('error', (err) => { 
            console.error('Join error:', err);
            toast.error('Connection failed'); 
            setState('idle'); 
        });
    };

    const markReady = () => {
        setLocalReady(true);
        connRef.current?.send({ type: 'READY' });
    };

    const startRace = () => {
        if (!localReady || !remoteReady) {
            return toast.error('Both players must be ready');
        }
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
                <div className="text-center py-6 space-y-6">
                    <h2 className="text-2xl text-green-400 font-bold">Opponent Connected!</h2>
                    
                    <div className="flex justify-center gap-6">
                        <div className={`p-4 rounded-xl border-2 transition-all ${localReady ? 'border-green-500 bg-green-500/10' : 'border-white/10 opacity-50'}`}>
                           <p className="text-sm">You</p>
                           <p className="font-bold">{localReady ? 'READY' : 'Waiting...'}</p>
                        </div>
                        <div className={`p-4 rounded-xl border-2 transition-all ${remoteReady ? 'border-green-500 bg-green-500/10' : 'border-white/10 opacity-50'}`}>
                           <p className="text-sm">Opponent</p>
                           <p className="font-bold">{remoteReady ? 'READY' : 'Waiting...'}</p>
                        </div>
                    </div>

                    {!localReady ? (
                         <Button onClick={markReady} size="lg" className="w-48">Ready Up</Button>
                    ) : (
                        roomCode && remoteReady ? (
                             <Button onClick={startRace} size="lg" className="w-48 text-lg font-bold bg-green-600 hover:bg-green-700">Start Race</Button>
                        ) : (
                             <p className="text-muted-foreground duration-1000 animate-pulse">
                                 {remoteReady ? 'Starting...' : 'Waiting for opponent to ready up...'}
                             </p>
                        )
                    )}
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
