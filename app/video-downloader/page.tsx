"use client";

import NavBar from "@/components/NavBar";
import { useState } from "react";

export default function VideoDownloader() {
    const [videoUrl, setVideoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [videoInfo, setVideoInfo] = useState({
        title: "",
        thumbnail: "",
        duration: "",
    })
    const [showInfo, setShowInfo] = useState(false);
    return (<>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">video downloader</h1>
            <div className="max-w-md mx-auto">
                <input
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="cole o URL do vídeo aqui"
                    value={videoUrl}
                    onChange={(e) => {
                        setVideoUrl(e.target.value)
                        setShowInfo(false);
                        setError("");
                    }}
                ></input>
                {
                    showInfo
                        ? <div className="flex bg-gray-800 p-4 rounded-md mt-4 text-white">
                            <img src={videoInfo.thumbnail} className="pr-4"></img>
                            <div className="flex flex-col space-y-2">
                                <p>{videoInfo.title}</p>
                                <p>{videoInfo.duration} segundos</p>
                            </div>
                        </div>
                        : null
                }
                {
                    !showInfo
                        ? <>{
                            !loading
                                ? <button className="mt-4 text-white px-4 py-2 rounded-md transition w-full cursor-grab bg-blue-600 hover:bg-blue-700"
                                    onClick={
                                        async () => {
                                            try {
                                                setError("");
                                                setLoading(true);
                                                let info = await getInfo(videoUrl)
                                                setVideoInfo(info);
                                                setShowInfo(true);
                                            } catch (error: any) {
                                                setError(error.message);
                                            } finally {
                                                setLoading(false);
                                            }
                                        }
                                    }>
                                    obter informações do vídeo
                                </button>
                                : <LoadingButton />
                        }</>
                        : null
                }
                {
                    showInfo
                        ? <>{!loading ? (
                            <DownloadButton setLoading={setLoading} error={error} setError={setError} downloadVideo={downloadVideo} videoUrl={videoUrl} />
                        ) : <LoadingButton />}</>
                        : null
                }
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

    async function getInfo(url: string): Promise<{
        title: string;
        thumbnail: string;
        duration: string;
    }> {
        try {
            const response = await fetch(`http://localhost:8080/api/videos/info?url=${url}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('falha ao obter informacoes do video');
            }

            const data = await response.json();
            console.log('Video info response:', JSON.stringify(data, null, 2));


            if (!data.player_response) {
                throw new Error('Formato de resposta inválido: player_response não encontrado');
            }

            if (!data.player_response.videoDetails) {
                throw new Error('Formato de resposta inválido: videoDetails não encontrado');
            }

            const videoDetails = data.player_response.videoDetails;


            if (!videoDetails.title) {
                throw new Error('Título do vídeo não disponível');
            }


            let thumbnailUrl;
            if (videoDetails.thumbnail && videoDetails.thumbnail.thumbnails && videoDetails.thumbnail.thumbnails.length > 0) {
                thumbnailUrl = videoDetails.thumbnail.thumbnails[0].url;
            } else if (videoDetails.thumbnails && videoDetails.thumbnails.length > 0) {
                thumbnailUrl = videoDetails.thumbnails[0].url;
            } else {
                thumbnailUrl = "";
            }

            return {
                title: videoDetails.title,
                thumbnail: thumbnailUrl,
                duration: videoDetails.lengthSeconds || "0"
            };
        }
        catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }
}


function LoadingButton({ }) {
    return (<div className="mt-4 flex justify-center items-center bg-gray-400 text-white px-4 py-2 rounded-md w-full h-[42px]">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span className="ml-2">processando...</span>
    </div>);
}

function DownloadButton({ setLoading, error, setError, downloadVideo, videoUrl }: {
    setLoading: (loading: boolean) => void,
    error: string,
    setError: (error: string) => void,
    downloadVideo: (url: string) => Promise<void>,
    videoUrl: string
}) {
    return (<button className={`mt-4 text-white px-4 py-2 rounded-md transition w-full cursor-grab bg-blue-600 hover:bg-blue-700`} onClick={() => {
        setLoading(true);
        downloadVideo(videoUrl).then(() => {
            setLoading(false);
        }).catch(error => {
            setError(error.message);
            setLoading(false);
        });
    }}>
        download
    </button>);
}
