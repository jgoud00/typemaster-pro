'use client';

import { useState, useEffect, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Laptop, RefreshCw, Check, X, QrCode, ShieldAlert, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/stores/progress-store';
import { UserProgress } from '@/types';
import { useSettingsStore } from '@/stores/settings-store';
import toast from 'react-hot-toast';

type SyncMode = 'idle' | 'hosting' | 'joining' | 'connected' | 'syncing' | 'success' | 'conflict';

interface SyncPayload {
    type: 'SYNC_OFFER' | 'SYNC_ACK';
    progress: UserProgress;
    timestamp: number;
}

export function WebRTCSync() {
    const [mode, setMode] = useState<SyncMode>('idle');
    const [roomCode, setRoomCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [peerId, setPeerId] = useState('');
    const [connection, setConnection] = useState<DataConnection | null>(null);
    const [pendingPayload, setPendingPayload] = useState<SyncPayload | null>(null);
    
    // Holds the global peer instance
    const peerRef = useRef<Peer | null>(null);
    
    const { progress, importData } = useProgressStore();

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, []);

    const generateRoomCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const compareClocks = (local: Record<string, number>, remote: Record<string, number>) => {
        let localIsGreater = false;
        let remoteIsGreater = false;
        
        const safeLocal = local || {};
        const safeRemote = remote || {};

        const keys = new Set([...Object.keys(safeLocal), ...Object.keys(safeRemote)]);
        
        for (const key of keys) {
            const l = safeLocal[key] || 0;
            const r = safeRemote[key] || 0;
            if (l > r) localIsGreater = true;
            if (l < r) remoteIsGreater = true;
        }
        
        if (localIsGreater && remoteIsGreater) return 'conflict';
        if (remoteIsGreater) return 'remote_wins';
        if (localIsGreater) return 'local_wins';
        return 'equals';
    };

    const resolveConflict = (winner: 'local' | 'remote') => {
        if (!pendingPayload || !connection) return;
        
        let newState: UserProgress;
        const localState = useProgressStore.getState().progress;
        
        if (winner === 'remote') {
            newState = pendingPayload.progress;
        } else {
            newState = localState;
        }
        
        const mergedClock: Record<string, number> = {};
        const localClock = localState.vectorClock || {};
        const remoteClock = pendingPayload.progress.vectorClock || {};
        const keys = new Set([...Object.keys(localClock), ...Object.keys(remoteClock)]);
        for (const key of keys) {
            mergedClock[key] = Math.max(localClock[key] || 0, remoteClock[key] || 0);
        }
        
        const deviceId = localState.deviceId || (typeof crypto !== 'undefined' ? crypto.randomUUID() : 'unknown');
        mergedClock[deviceId] = (mergedClock[deviceId] || 0) + 1;
        
        newState = {
            ...newState,
            vectorClock: mergedClock
        };
        
        useProgressStore.getState().adoptRemoteState(newState);
        
        if (pendingPayload.type === 'SYNC_OFFER') {
            const ackPayload: SyncPayload = {
                type: 'SYNC_ACK',
                progress: newState,
                timestamp: Date.now()
            };
            connection.send(ackPayload);
        }
        
        setPendingPayload(null);
        setMode('success');
        toast.success(`Conflict resolved. Adopted ${winner} state!`);
    };

    const handleConnection = (conn: DataConnection, isHost: boolean) => {
        conn.on('open', () => {
            setMode('connected');
            setConnection(conn);
            toast.success('Devices connected securely via WebRTC');

            if (isHost) {
                // Host initiates sync
                const payload: SyncPayload = {
                    type: 'SYNC_OFFER',
                    progress: useProgressStore.getState().progress,
                    timestamp: Date.now()
                };
                conn.send(payload);
                setMode('syncing');
            }
        });

        conn.on('data', (data: any) => {
            const payload = data as SyncPayload;
            
            const localState = useProgressStore.getState().progress;
            const result = compareClocks(localState.vectorClock, payload.progress.vectorClock);

            if (result === 'conflict') {
                setPendingPayload(payload);
                setMode('conflict');
                return;
            }

            if (result === 'remote_wins') {
                useProgressStore.getState().adoptRemoteState(payload.progress);
                toast.success('Synchronized remotely updated progress!');
            }
            
            if (payload.type === 'SYNC_OFFER') {
                const ackPayload: SyncPayload = {
                    type: 'SYNC_ACK',
                    progress: useProgressStore.getState().progress,
                    timestamp: Date.now()
                };
                conn.send(ackPayload);
                setMode('success');
            } else if (payload.type === 'SYNC_ACK') {
                setMode('success');
            }
        });

        conn.on('close', () => {
            setConnection(null);
            setMode('idle');
            toast.error('Connection closed');
        });
    };

    const hostRoom = () => {
        setMode('hosting');
        const code = generateRoomCode();
        setRoomCode(code);
        
        const peer = new Peer(`typemaster-pro-${code}`);
        peerRef.current = peer;

        peer.on('open', (id) => {
            setPeerId(id);
        });

        peer.on('connection', (conn) => {
            handleConnection(conn, true);
        });
        
        peer.on('error', (err) => {
            toast.error(`PeerJS Error: ${err.type}`);
            setMode('idle');
        });
    };

    const joinRoom = () => {
        if (joinCode.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setMode('joining');
        const peer = new Peer();
        peerRef.current = peer;

        peer.on('open', () => {
            const conn = peer.connect(`typemaster-pro-${joinCode}`);
            handleConnection(conn, false);
        });

        peer.on('error', (err) => {
            toast.error(`Connection Error: ${err.type}`);
            setMode('idle');
        });
    };

    const disconnect = () => {
        if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
        }
        setConnection(null);
        setMode('idle');
        setRoomCode('');
        setJoinCode('');
    };

    return (
        <Card className="p-6 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {mode === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3">
                            <RefreshCw className="w-5 h-5 text-purple-500" />
                            <h2 className="text-xl font-semibold">Device Sync (P2P)</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Synchronize your progress securely across devices. Data travels directly between your devices via WebRTC, never hitting a database.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <Button 
                                className="h-24 flex flex-col gap-2 relative overflow-hidden group" 
                                variant="outline"
                                onClick={hostRoom}
                            >
                                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Laptop className="w-6 h-6 text-purple-500" />
                                <span>Host Data</span>
                            </Button>
                            
                            <Button 
                                className="h-24 flex flex-col gap-2 relative overflow-hidden group" 
                                variant="outline"
                                onClick={() => setMode('joining')}
                            >
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Smartphone className="w-6 h-6 text-blue-500" />
                                <span>Join Device</span>
                            </Button>
                        </div>
                    </motion.div>
                )}

                {mode === 'hosting' && (
                    <motion.div
                        key="hosting"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6 flex flex-col items-center text-center"
                    >
                        <h3 className="font-semibold text-lg">Scan or Enter Code</h3>
                        
                        <div className="bg-white p-4 rounded-xl shadow-inner">
                            <QRCodeSVG 
                                value={roomCode} 
                                size={150}
                                level="H"
                                includeMargin={false}
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Sync Code</p>
                            <div className="text-4xl font-mono font-bold tracking-[0.2em] bg-muted/50 py-2 px-6 rounded-lg border">
                                {roomCode}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Waiting for connection...
                        </div>

                        <Button variant="ghost" onClick={disconnect} className="w-full">
                            Cancel
                        </Button>
                    </motion.div>
                )}

                {mode === 'joining' && (
                    <motion.div
                        key="joining"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="font-semibold text-lg text-center">Enter Sync Code</h3>

                        <div className="space-y-4">
                            <div className="flex flex-col items-center">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ''))}
                                    className="text-4xl font-mono text-center tracking-[0.2em] bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none w-48 transition-colors pb-2"
                                />
                            </div>

                            <Button 
                                className="w-full" 
                                disabled={joinCode.length !== 6}
                                onClick={joinRoom}
                            >
                                Connect & Sync
                            </Button>
                            
                            <Button variant="ghost" onClick={disconnect} className="w-full">
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                )}

                {mode === 'conflict' && (
                    <motion.div
                        key="conflict"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 flex flex-col items-center"
                    >
                        <div className="flex items-center gap-3 text-amber-500">
                            <ShieldAlert className="w-8 h-8" />
                            <h3 className="font-semibold text-lg text-foreground">Sync Divergence Detected</h3>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            Both devices have progressed independently. To prevent data corruption, you must choose which device's history to trust. The other device will adopt this timeline.
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Button 
                                className="h-40 flex flex-col gap-2 relative overflow-hidden whitespace-normal text-center" 
                                variant="outline"
                                onClick={() => resolveConflict('local')}
                            >
                                <span className="font-bold text-blue-500">Keep Local Device</span>
                                <span className="text-xs text-muted-foreground">WPM: {progress.personalBests.wpm}</span>
                                <span className="text-xs text-muted-foreground">Practice Time: {Math.floor(progress.totalPracticeTime / 60)}m</span>
                                <span className="text-xs text-muted-foreground">Total Lessons: {progress.completedLessons.length}</span>
                            </Button>
                            
                            <Button 
                                className="h-40 flex flex-col gap-2 relative overflow-hidden whitespace-normal text-center" 
                                variant="outline"
                                onClick={() => resolveConflict('remote')}
                            >
                                <span className="font-bold text-purple-500">Trust Remote Device</span>
                                <span className="text-xs text-muted-foreground">WPM: {pendingPayload?.progress.personalBests.wpm}</span>
                                <span className="text-xs text-muted-foreground">Practice Time: {Math.floor((pendingPayload?.progress.totalPracticeTime ?? 0) / 60)}m</span>
                                <span className="text-xs text-muted-foreground">Total Lessons: {pendingPayload?.progress.completedLessons.length}</span>
                            </Button>
                        </div>
                        
                        <Button variant="ghost" onClick={disconnect} className="w-full">
                            Cancel Sync (Leave Unmerged)
                        </Button>
                    </motion.div>
                )}

                {(mode === 'connected' || mode === 'syncing' || mode === 'success') && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 flex flex-col items-center text-center py-4"
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${mode === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                            {mode === 'success' ? (
                                <Check className="w-8 h-8" />
                            ) : (
                                <RefreshCw className="w-8 h-8 animate-spin" />
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">
                                {mode === 'success' ? 'Sync Complete!' : 'Synchronizing...'}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {mode === 'success' 
                                    ? 'Your typing records have been successfully merged.' 
                                    : 'Exchanging encrypted typing patterns block...'
                                }
                            </p>
                        </div>

                        {mode === 'success' && (
                            <Button variant="outline" onClick={disconnect} className="w-full">
                                Done
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
