import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { db } from '../App';
import { collection, doc, setDoc, onSnapshot, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Play, Pause, SkipForward, SkipBack, Plus, Trash2, X, Disc, Clock, Search, ListMusic } from 'lucide-react';

export default function MusicPlayer({ user }) {
    const [playlists, setPlaylists] = useState([]);
    const [activePlaylistId, setActivePlaylistId] = useState(null);

    // Playback state
    const [playerInfo, setPlayerInfo] = useState({ isPlaying: false, currentVidIndex: 0, duration: 0, currentTime: 0 });
    const [playerState, setPlayerState] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [isAddingSong, setIsAddingSong] = useState(false);

    const activePlaylist = playlists.find(p => p.id === activePlaylistId) || null;

    useEffect(() => {
        if (!user) {
            setPlaylists([]);
            setActivePlaylistId(null);
            return;
        }
        const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'playlists'), (snapshot) => {
            const pData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlaylists(pData);
        });
        return () => unsubscribe();
    }, [user]);

    const parseYouTubeId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim() || !user) return;
        const newId = Date.now().toString();
        await setDoc(doc(db, 'users', user.uid, 'playlists', newId), {
            name: newPlaylistName,
            songs: []
        });
        setNewPlaylistName('');
    };

    const handleDeletePlaylist = async (id, e) => {
        if (e) e.stopPropagation();
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'playlists', id));
        if (activePlaylistId === id) setActivePlaylistId(null);
    };

    const handleAddSong = async (e) => {
        e.preventDefault();
        if (!newVideoUrl.trim() || !activePlaylist || !user || isAddingSong) return;
        setIsAddingSong(true);
        const vidId = parseYouTubeId(newVideoUrl) || newVideoUrl.trim();
        if (!vidId || vidId.length !== 11) {
            alert("Invalid YouTube URL or Video ID");
            setIsAddingSong(false);
            return;
        }

        let songTitle = `Track (${vidId})`;
        let author = "Unknown Artist";
        try {
            const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vidId}&format=json`);
            if (res.ok) {
                const data = await res.json();
                songTitle = data.title;
                author = data.author_name;
            }
        } catch (err) {
            console.error(err);
        }

        const newSong = { videoId: vidId, title: songTitle, author: author, addedAt: Date.now() };

        await setDoc(doc(db, 'users', user.uid, 'playlists', activePlaylist.id), {
            songs: arrayUnion(newSong)
        }, { merge: true });

        setNewVideoUrl('');
        setIsAddingSong(false);
    };

    const handleRemoveSong = async (song, e) => {
        if (e) e.stopPropagation();
        if (!activePlaylist || !user) return;
        await updateDoc(doc(db, 'users', user.uid, 'playlists', activePlaylist.id), {
            songs: arrayRemove(song)
        });
    };

    const currentSong = activePlaylist?.songs?.[playerInfo.currentVidIndex] || null;

    useEffect(() => {
        let interval;
        if (playerInfo.isPlaying && playerState) {
            interval = setInterval(async () => {
                const time = await playerState.getCurrentTime();
                setPlayerInfo(p => ({ ...p, currentTime: time || 0 }));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [playerInfo.isPlaying, playerState]);

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const formatDate = (ms) => {
        if (!ms) return "Unknown";
        const d = new Date(ms);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const updateSongDurationInDB = async (durationSecs) => {
        if (!currentSong || !activePlaylist || !user || currentSong.duration) return;
        const updatedSongs = [...activePlaylist.songs];
        updatedSongs[playerInfo.currentVidIndex] = { ...currentSong, duration: durationSecs };
        await updateDoc(doc(db, 'users', user.uid, 'playlists', activePlaylist.id), {
            songs: updatedSongs
        });
    };

    const onPlayerReady = (event) => {
        setPlayerState(event.target);
    };

    const onPlayerStateChange = async (event) => {
        const target = event.target;
        if (event.data === 1) {
            const dur = await target.getDuration();
            setPlayerInfo(p => ({ ...p, isPlaying: true, duration: dur }));
            if (dur && activePlaylist) updateSongDurationInDB(dur);
        }
        if (event.data === 2) setPlayerInfo(p => ({ ...p, isPlaying: false }));
        if (event.data === 0) handleNext();
    };

    const togglePlay = () => {
        if (!playerState) return;
        if (playerInfo.isPlaying) playerState.pauseVideo();
        else playerState.playVideo();
    };

    const handleNext = () => {
        if (!activePlaylist?.songs?.length) return;
        setPlayerInfo(p => ({ ...p, currentVidIndex: (p.currentVidIndex + 1) % activePlaylist.songs.length }));
    };

    const handlePrev = () => {
        if (!activePlaylist?.songs?.length) return;
        setPlayerInfo(p => ({ ...p, currentVidIndex: p.currentVidIndex === 0 ? activePlaylist.songs.length - 1 : p.currentVidIndex - 1 }));
    };

    const selectSong = (index) => {
        setPlayerInfo({ isPlaying: true, currentVidIndex: index, duration: 0, currentTime: 0 });
    };

    const handleProgressBarClick = (e) => {
        if (!playerState || !playerInfo.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        playerState.seekTo(percent * playerInfo.duration);
    };

    if (!user) {
        return (
            <div className="flex flex-col h-[calc(100vh-56px)] bg-[#121212] items-center justify-center text-zinc-400">
                <Disc size={48} className="mb-6 opacity-20" />
                <h2 className="text-2xl font-bold text-white mb-2">WSJ Record</h2>
                <p className="font-light tracking-wide">Please sign in from the top right to access your music catalog.</p>
            </div>
        );
    }

    // Dynamic gradient based on active playlist (we just use a static nice one for now)
    const bgGradient = "bg-gradient-to-b from-[#2E2E2E] to-[#121212]";

    return (
        <div className="flex flex-col h-[calc(100vh-56px)] bg-black text-zinc-300 font-sans selection:bg-white selection:text-black">
            {/* Invisible Player */}
            {currentSong && (
                <div className="hidden">
                    <YouTube
                        videoId={currentSong.videoId}
                        opts={{ playerVars: { autoplay: 1, controls: 0 } }}
                        onReady={onPlayerReady}
                        onStateChange={onPlayerStateChange}
                    />
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 bg-black flex flex-col p-4 sm:p-6 gap-6 overflow-y-auto hidden md:flex shrink-0">
                    <div className="text-white font-bold text-xl flex items-center gap-2 mb-2 tracking-tight">
                        <Disc size={24} /> WSJ Record
                    </div>

                    <div className="bg-[#121212] rounded-lg p-2 flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-2 py-3 text-zinc-400 font-medium text-sm">
                            <span className="flex flex-col gap-1"><ListMusic size={20} /> Playlists</span>
                            <div className="flex items-center gap-2 bg-zinc-800/50 rounded-full px-2 py-1 focus-within:ring-1 ring-white">
                                <Plus size={14} className="opacity-70" />
                                <input
                                    type="text"
                                    className="bg-transparent outline-none w-20 text-xs text-white placeholder-zinc-500"
                                    placeholder="Create..."
                                    value={newPlaylistName}
                                    onChange={e => setNewPlaylistName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCreatePlaylist()}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto mt-2 space-y-1 pr-1 custom-scrollbar">
                            {playlists.map(pl => (
                                <div
                                    key={pl.id}
                                    onClick={() => {
                                        setActivePlaylistId(pl.id);
                                        setPlayerInfo({ isPlaying: false, currentVidIndex: 0, duration: 0, currentTime: 0 });
                                    }}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${activePlaylistId === pl.id ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50'}`}
                                >
                                    <span className="text-sm truncate w-full pr-4">{pl.name}</span>
                                    <button onClick={(e) => handleDeletePlaylist(pl.id, e)} className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-[#121212] rounded-lg md:mt-2 md:mr-2 md:mb-2 overflow-hidden flex flex-col relative">
                    {!activePlaylist ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                            <ListMusic size={48} className="mb-4 opacity-20" />
                            <p className="text-lg">Select a playlist from the library.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative pb-32">
                            {/* Hero Header */}
                            <div className={`p-6 sm:p-8 flex items-end gap-6 ${bgGradient} h-64 sm:h-80 transition-all`}>
                                <div className="w-32 h-32 sm:w-48 sm:h-48 shadow-2xl bg-zinc-800 flex items-center justify-center shrink-0">
                                    <Disc size={64} className="text-white/20" />
                                </div>
                                <div className="flex flex-col text-white pb-2 overflow-hidden">
                                    <span className="text-xs sm:text-sm font-medium mb-1 uppercase tracking-wider">Public Playlist</span>
                                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-4 sm:mb-6 truncate">{activePlaylist.name}</h1>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300 font-medium">
                                        <span className="text-white hover:underline cursor-pointer">{user.email.split('@')[0]}</span>
                                        <span className="opacity-50">•</span>
                                        <span>{activePlaylist.songs?.length || 0} songs</span>
                                    </div>
                                </div>
                            </div>

                            {/* Controls Bar & Table */}
                            <div className="px-6 py-4 bg-[#121212]/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <button
                                        className="w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center hover:scale-105 hover:bg-green-400 transition-all shadow-xl"
                                        onClick={togglePlay}
                                    >
                                        {playerInfo.isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                    </button>
                                </div>
                                <form onSubmit={handleAddSong} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 focus-within:ring-1 ring-white/30 transition-all max-w-[200px] sm:max-w-xs">
                                    <Search size={16} className="text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder="Paste link..."
                                        value={newVideoUrl}
                                        onChange={e => setNewVideoUrl(e.target.value)}
                                        className="bg-transparent outline-none text-sm w-full placeholder-zinc-500 text-white"
                                    />
                                    {isAddingSong && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                                </form>
                            </div>

                            {/* Table Header */}
                            <div className="px-6 sm:px-8 mt-4">
                                <div className="grid grid-cols-[3fr_2fr_1fr] sm:grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 text-xs font-medium tracking-widest text-[#a7a7a7] uppercase border-b border-white/10 pb-2 mb-2 px-2">
                                    <div className="hidden sm:block text-right">#</div>
                                    <div>Title</div>
                                    <div className="hidden sm:block">Album</div>
                                    <div>Date added</div>
                                    <div className="flex justify-end pr-8"><Clock size={14} /></div>
                                </div>

                                {/* Song List */}
                                <div className="space-y-1">
                                    {activePlaylist.songs?.map((song, idx) => {
                                        const isActive = playerInfo.currentVidIndex === idx;
                                        return (
                                            <div
                                                key={idx}
                                                className={`group grid grid-cols-[3fr_2fr_1fr] sm:grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 items-center px-2 py-2.5 rounded-md hover:bg-white/10 transition-colors text-sm ${isActive ? 'bg-white/5' : ''}`}
                                            >
                                                <div className="hidden sm:flex items-center justify-end w-4 relative text-[#a7a7a7]">
                                                    <span className={`group-hover:hidden ${isActive ? 'text-green-500' : ''}`}>{idx + 1}</span>
                                                    <button onClick={() => selectSong(idx)} className="absolute hidden group-hover:block hover:text-white">
                                                        {isActive && playerInfo.isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                                    </button>
                                                </div>

                                                <div className="flex flex-col truncate pr-4 cursor-pointer" onClick={() => selectSong(idx)}>
                                                    <span className={`truncate text-base ${isActive ? 'text-green-500' : 'text-white'}`}>{song.title}</span>
                                                    <span className="truncate text-sm text-[#a7a7a7] group-hover:text-white transition-colors">{song.author || "Unknown"}</span>
                                                </div>

                                                <div className="hidden sm:block truncate text-sm text-[#a7a7a7] group-hover:text-white transition-colors pr-4 cursor-default">
                                                    Custom Curation
                                                </div>

                                                <div className="truncate text-sm text-[#a7a7a7] cursor-default">
                                                    {formatDate(song.addedAt)}
                                                </div>

                                                <div className="flex items-center justify-end gap-3 text-sm text-[#a7a7a7]">
                                                    <span className="flex-1 text-right">{song.duration ? formatTime(song.duration) : ''}</span>
                                                    <button onClick={(e) => handleRemoveSong(song, e)} className="opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-white p-1">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Bottom Playbar */}
            <div className="h-[90px] bg-black border-t border-[#282828] flex items-center px-4 justify-between shrink-0 z-50">
                {/* Now Playing Info */}
                <div className="w-1/3 flex items-center gap-3">
                    {currentSong && (
                        <>
                            <div className="w-14 h-14 bg-zinc-800 rounded shadow-md flex items-center justify-center shrink-0">
                                <Disc size={24} className={`text-white/20 ${playerInfo.isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                            </div>
                            <div className="flex flex-col truncate">
                                <a href={`https://youtube.com/watch?v=${currentSong.videoId}`} target="_blank" rel="noreferrer" className="text-white text-sm hover:underline truncate">
                                    {currentSong.title}
                                </a>
                                <span className="text-xs text-[#a7a7a7] truncate hover:underline hover:text-white cursor-pointer mt-0.5">
                                    {currentSong.author || "Unknown"}
                                </span>
                            </div>
                            <button className="ml-4 text-[#a7a7a7] hover:text-white"><Plus size={16} /></button>
                        </>
                    )}
                </div>

                {/* Player Controls */}
                <div className="w-1/3 max-w-[722px] flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-6">
                        <button onClick={handlePrev} className="text-[#a7a7a7] hover:text-white transition-colors">
                            <SkipBack size={20} fill="currentColor" />
                        </button>
                        <button
                            onClick={togglePlay}
                            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {playerInfo.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button onClick={handleNext} className="text-[#a7a7a7] hover:text-white transition-colors">
                            <SkipForward size={20} fill="currentColor" />
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-2 text-xs text-[#a7a7a7] font-medium hidden sm:flex">
                        <span className="w-10 text-right">{formatTime(playerInfo.currentTime)}</span>
                        <div
                            className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative group cursor-pointer"
                            onClick={handleProgressBarClick}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-white group-hover:bg-green-500 rounded-full"
                                style={{ width: `${playerInfo.duration ? (playerInfo.currentTime / playerInfo.duration) * 100 : 0}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transform translate-x-1/2"></div>
                            </div>
                        </div>
                        <span className="w-10">{formatTime(playerInfo.duration)}</span>
                    </div>
                </div>

                {/* Volume / Extra Controls */}
                <div className="w-1/3 flex justify-end items-center gap-4 text-[#a7a7a7] hidden md:flex pr-2">
                    <div className={`flex items-end gap-[3px] h-4 ${playerInfo.isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                        <div className="w-1 bg-green-500 h-2 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></div>
                        <div className="w-1 bg-green-500 h-4 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.2s' }}></div>
                        <div className="w-1 bg-green-500 h-3 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.9s' }}></div>
                        <div className="w-1 bg-green-500 h-3 animate-bounce" style={{ animationDelay: '100ms', animationDuration: '1.1s' }}></div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 12px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border: 3px solid transparent;
                    background-clip: padding-box;
                    border-radius: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(255, 255, 255, 0.5);
                }
            `}} />
        </div>
    );
}
