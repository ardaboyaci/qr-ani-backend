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
    // Step 1: Score each photo
    const scoredPhotos = photos.map(photo => {
        let score = 0;

        // Factor 1: File size (proxy for quality/resolution)
        // Higher resolution = better quality (usually)
        const sizeMB = (photo.file_size || 0) / (1024 * 1024);
        if (sizeMB > 3) score += 30; // High-res photos
        else if (sizeMB > 1) score += 15;

        // Factor 2: Likes (if available)
        const likes = photo.likes_count || 0;
        score += likes * 10;

        // Factor 3: Recency bonus (newer photos get slight boost)
        const uploadedDate = new Date(photo.created_at);
        const hoursSinceUpload = (Date.now() - uploadedDate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceUpload < 24) score += 10; // Recent uploads

        // Factor 4: File name hints (some cameras auto-name best shots)
        const fileName = (photo.file_name || '').toLowerCase();
        if (fileName.includes('img') || fileName.includes('dsc')) {
            // Professional camera naming patterns
            score += 5;
        }

        // Factor 5: Random variation (prevents same results every time)
        score += Math.random() * 20;

        return { ...photo, score };
    });

    // Step 2: Sort by score and take top N
    return scoredPhotos
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(({ score, ...photo }) => photo); // Remove score from final result
}
