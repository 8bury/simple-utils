"use client";

import NavBar from "@/components/NavBar";
import { useState } from "react";

export default function VideoDownloader() {
    const [videoUrl, setVideoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    return (<>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Video Downloader</h1>
            <div className="max-w-md mx-auto">
                <input
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cole o URL do vídeo aqui"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                ></input>

                {loading ? (
                    <div className="mt-4 flex justify-center items-center bg-gray-400 text-white px-4 py-2 rounded-md w-full h-[42px]">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="ml-2">Processando...</span>
                    </div>
                ) : (
                    <button
                        className={`mt-4 text-white px-4 py-2 rounded-md transition w-full cursor-grab bg-blue-600 hover:bg-blue-700`}
                        onClick={() => {
                            setLoading(true);
                            downloadVideo(videoUrl).then(() => {
                                setLoading(false);
                            }).catch((error) => {
                                setError(error.message);
                                setLoading(false);
                            });
                        }}
                    >
                        Download
                    </button>
                )}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-center">
                        {error}
                    </div>
                )}
            </div>
        </div></>
    );
    async function downloadVideo(url: string): Promise<void> {
        try {
            const response = await fetch('http://localhost:8080/api/videos/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Falha ao processar o download');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;

            const filename = response.headers.get('content-disposition')?.split('filename=')[1]?.trim() || 'video.mp4';
            a.download = filename.replace(/['"]/g, '');

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);

        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }
}

