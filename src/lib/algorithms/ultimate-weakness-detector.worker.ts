import { UltimateWeaknessDetector } from './ultimate-weakness-detector';

const detector = new UltimateWeaknessDetector();

self.onmessage = async (e: MessageEvent) => {
    const { messageId, type, payload } = e.data;
    
    try {
        switch (type) {
            case 'LOAD':
                await detector.load();
                self.postMessage({ messageId, success: true });
                break;
                
            case 'SAVE':
                await detector.saveNow();
                self.postMessage({ messageId, success: true });
                break;
                
            case 'UPDATE_KEY':
                // payload: { key: string, isCorrect: boolean, speed: number, context: { timestamp, sessionPosition, recentErrors, adjacentKey? } }
                detector.updateKey(
                    payload.key,
                    payload.isCorrect,
                    payload.speed,
                    payload.context
                );
                self.postMessage({ messageId, success: true });
                break;
                
            case 'ANALYZE_ALL':
                const results = detector.analyzeAllKeys();
                self.postMessage({ messageId, success: true, payload: results });
                break;
                
            case 'ANALYZE_KEY':
                // payload: string (key)
                const result = detector.analyzeKey(payload);
                self.postMessage({ messageId, success: true, payload: result });
                break;
                
            default:
                throw new Error(`Unknown message type: ${type}`);
        }
    } catch (error) {
        self.postMessage({ messageId, success: false, error: String(error) });
    }
};

// Expose nothing locally to signify it is a Worker executable
export {};
