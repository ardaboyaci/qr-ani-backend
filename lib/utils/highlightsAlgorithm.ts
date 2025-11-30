interface Photo {
    id: number;
    url: string;
    file_size?: number; // In bytes
    likes_count?: number; // If you track likes
    created_at: string;
    file_name?: string;
    [key: string]: any;
}

export function selectHighlights(photos: Photo[], count: number = 10): Photo[] {
    if (!photos || photos.length === 0) return [];

    // Step 1: Score each photo
    const scoredPhotos = photos.map(photo => {
        let score = 0;

        // Factor 1: File size (proxy for quality/resolution)
        // Relaxed: Any size > 0.5MB gets some points
        const sizeMB = (photo.file_size || 0) / (1024 * 1024);
        if (sizeMB > 3) score += 30; // High-res
        else if (sizeMB > 1) score += 15; // Medium-res
        else if (sizeMB > 0.5) score += 5; // Low-res but decent

        // Factor 2: Likes (if available)
        const likes = photo.likes_count || 0;
        score += likes * 10;

        // Factor 3: Recency bonus (newer photos get slight boost)
        const uploadedDate = new Date(photo.created_at);
        const hoursSinceUpload = (Date.now() - uploadedDate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceUpload < 24) score += 10; // Recent uploads
        else if (hoursSinceUpload < 72) score += 5; // Last 3 days

        // Factor 4: File name hints
        const fileName = (photo.file_name || '').toLowerCase();
        if (fileName.includes('img') || fileName.includes('dsc') || fileName.includes('photo')) {
            score += 5;
        }

        // Factor 5: Random variation
        score += Math.random() * 20;

        return { ...photo, score };
    });

    // Step 2: Sort by score
    let selected = scoredPhotos
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(({ score, ...photo }) => photo);

    // Step 3: Guaranteed Fallback
    // If we have fewer than 3 photos (and the original list has enough),
    // or if the "best" photos have very low scores (implicit in this logic since we always take top N),
    // we force a fallback to "Recent + Shuffle" to ensure variety if the scoring failed to differentiate.
    // However, since we always take top N, the only risk is if N is small.
    // Let's ensure we always return *something* if input has photos.

    if (selected.length === 0 && photos.length > 0) {
        // Fallback: Take recent photos and shuffle them
        const recent = [...photos]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, Math.min(count * 2, photos.length)); // Take pool of recent

        // Shuffle the pool
        selected = recent
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
    }

    return selected;
}
