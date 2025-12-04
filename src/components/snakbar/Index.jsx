import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";
import { dequeue } from '../../store/slices/snakbar';

function normalizeErrors(err) {
    if (err == null) return ['Unknown error'];
    if (err instanceof Error) return normalizeErrors(err.message);
    if (typeof err === 'string') return err.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (Array.isArray(err)) return err.flatMap(e => normalizeErrors(e));
    if (typeof err === 'object') {
        if (err.message) return normalizeErrors(err.message);
        if (err.errors) return normalizeErrors(err.errors);
        const vals = Object.values(err);
        if (vals.length) return vals.flatMap(v => normalizeErrors(v));
        try { return [JSON.stringify(err)]; } catch (e) { return ['Object error']; }
    }
    return [String(err)];
}

export default function SnackbarListener() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const location = useLocation();
    const queue = useSelector(s => s?.snackbar?.queue || []);

    // 🔥 Close snackbars on route change
    useEffect(() => {
        closeSnackbar(); // closes all snackbars immediately
    }, [location.pathname, closeSnackbar]);

    // Show snackbars from queue
    useEffect(() => {
        if (!queue || queue.length === 0) return;

        queue.forEach(item => {
            const msgs = normalizeErrors(item.message);

            if (msgs.length > 1) {
                const node = (
                    <div style={{ maxWidth: 420 }}>
                        <strong>{item.variant === 'error' ? 'Error' : 'Notice'}</strong>
                        <ul style={{ margin: '8px 0 0 16px' }}>
                            {msgs.map((m, i) => <li key={i} style={{ whiteSpace: 'pre-wrap' }}>{m}</li>)}
                        </ul>
                    </div>
                );
                enqueueSnackbar(node, { variant: item.variant || 'default', autoHideDuration: 4000 });
            } else {
                enqueueSnackbar(msgs[0], { variant: item.variant || 'default', autoHideDuration: 4000 });
            }

            dispatch(dequeue(item.id));
        });
    }, [queue, enqueueSnackbar, dispatch]);

    return null;
}
