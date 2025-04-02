
import type { Metadata } from 'next'
import "react-quill/dist/quill.snow.css";
import "../globals.css"
import Header from '../components/common/Header';
import Sidebar from '../components/sidebar/Sidebar';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Admin Dashboard built with Next.js',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head />
            <body>
                <Header />
                <Sidebar>{children}</Sidebar>
            </body>
        </html>
    )
}