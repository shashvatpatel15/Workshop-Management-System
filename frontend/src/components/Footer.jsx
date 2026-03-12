import React from 'react';
import { useRegistrations } from '../hooks/useRegistrations';

export default function Footer() {
    const { registrations } = useRegistrations();

    const registrationCountText = `${registrations.length} registration${registrations.length === 1 ? "" : "s"
        } saved on this device`;

    return (
        <footer className="footer" style={{ marginTop: 'auto' }}>
            <span>Built for college clubs &amp; colleagues</span>
            <span className="dot">•</span>
            <span id="registrationCount">{registrationCountText}</span>
        </footer>
    );
}
