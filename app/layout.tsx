export const metadata = {
    title: 'QR Anı Backend',
    description: 'Backend API for QR Anı',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
