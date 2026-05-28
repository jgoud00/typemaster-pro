import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { RecoverableSession } from '@/lib/services/session-recovery';

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('incomplete_sessions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error || !data) {
        return NextResponse.json(null);
    }

    const session: RecoverableSession = {
        text: data.text,
        currentIndex: data.current_index,
        errorIndices: data.error_indices,
        startTime: data.start_time,
        pausedMs: data.paused_ms,
        mode: data.mode,
        lessonId: data.lesson_id,
        savedAt: data.saved_at
    };

    return NextResponse.json(session);
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Support clear command
    if (body.action === 'clear') {
        const { error } = await supabase
            .from('incomplete_sessions')
            .delete()
            .eq('user_id', user.id);
            
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true });
    }

    // Otherwise, upsert session progress
    const session = body as RecoverableSession;

    const { error } = await supabase
        .from('incomplete_sessions')
        .upsert({
            user_id: user.id,
            text: session.text,
            current_index: session.currentIndex,
            error_indices: session.errorIndices,
            start_time: session.startTime,
            paused_ms: session.pausedMs,
            mode: session.mode,
            lesson_id: session.lessonId,
            saved_at: Date.now()
        }, { onConflict: 'user_id' });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
