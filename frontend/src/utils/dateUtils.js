export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function getRelativeStatus(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = date.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < -1) return "Completed";
    if (diffDays < 0) return "Happening now";
    if (diffDays < 1) return "Happening soon";
    if (diffDays < 7) return "This week";
    if (diffDays < 31) return "This month";
    return "Upcoming";
}

export function isUpcoming(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    return date >= now;
}

export function isThisWeek(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
}

export function isThisMonth(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
    );
}
