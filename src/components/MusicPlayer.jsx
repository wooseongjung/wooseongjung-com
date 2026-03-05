import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { db } from '../App';
import { collection, doc, setDoc, onSnapshot, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Play, Pause, SkipForward, SkipBack, Plus, Trash2, X, Disc, Clock, Search, ListMusic, Repeat, Shuffle, Volume2, VolumeX, Edit2, MoreHorizontal, ArrowRight } from 'lucide-react';

export default function MusicPlayer({ user }) {
    const [playlists, setPlaylists] = useState([]);
    const [activePlaylistId, setActivePlaylistId] = useState(null);

    // Playback state
    const [playerInfo, setPlayerInfo] = useState({ isPlaying: false, currentVidIndex: 0, duration: 0, currentTime: 0 });
    const [playerState, setPlayerState] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [isAddingSong, setIsAddingSong] = useState(false);

    // Advanced controls
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);

    // Playlists & songs modifications
    const [editingPlaylistId, setEditingPlaylistId] = useState(null);
    const [editPlaylistName, setEditPlaylistName] = useState('');
    const [songMoveMenuId, setSongMoveMenuId] = useState(null);

    const isRepeatRef = useRef(false);
    const isShuffleRef = useRef(false);
    const activePlaylistRef = useRef(null);

    const activePlaylist = playlists.find(p => p.id === activePlaylistId) || null;

    useEffect(() => { activePlaylistRef.current = activePlaylist; }, [activePlaylist]);
    useEffect(() => { isRepeatRef.current = isRepeat; }, [isRepeat]);
    useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);

    const handleRenamePlaylist = async (id, e) => {
        if (e) e.preventDefault();
        if (!editPlaylistName.trim() || !user) {
            setEditingPlaylistId(null);
            return;
        }
        await updateDoc(doc(db, 'users', user.uid, 'playlists', id), {
            name: editPlaylistName
        });
        setEditingPlaylistId(null);
    };

    const handleMoveSong = async (song, targetPlaylistId) => {
        if (!activePlaylist || !user || activePlaylist.id === targetPlaylistId) {
            setSongMoveMenuId(null);
            return;
        }
        await setDoc(doc(db, 'users', user.uid, 'playlists', targetPlaylistId), {
            songs: arrayUnion(song)
        }, { merge: true });
        await updateDoc(doc(db, 'users', user.uid, 'playlists', activePlaylist.id), {
            songs: arrayRemove(song)
        });
        setSongMoveMenuId(null);
    };

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
        event.target.setVolume(volume);
        if (isMuted) event.target.mute();
    };

    const onPlayerStateChange = async (event) => {
        const target = event.target;
        if (event.data === 1) {
            const dur = await target.getDuration();
            setPlayerInfo(p => ({ ...p, isPlaying: true, duration: dur }));
            if (dur && activePlaylistRef.current) updateSongDurationInDB(dur);
        }
        if (event.data === 2) setPlayerInfo(p => ({ ...p, isPlaying: false }));
        if (event.data === 0) {
            if (isRepeatRef.current) {
                target.seekTo(0);
                target.playVideo();
            } else {
                handleNext();
            }
        }
    };

    const togglePlay = () => {
        if (!playerState) return;
        if (playerInfo.isPlaying) playerState.pauseVideo();
        else playerState.playVideo();
    };

    const handleNext = () => {
        const currentActive = activePlaylistRef.current || activePlaylist;
        if (!currentActive?.songs?.length) return;

        if (isShuffleRef.current) {
            const nextIdx = Math.floor(Math.random() * currentActive.songs.length);
            setPlayerInfo(p => ({ ...p, currentVidIndex: nextIdx, duration: 0, currentTime: 0, isPlaying: true }));
        } else {
            setPlayerInfo(p => ({ ...p, currentVidIndex: (p.currentVidIndex + 1) % currentActive.songs.length, duration: 0, currentTime: 0, isPlaying: true }));
        }
    };

    const handlePrev = () => {
        const currentActive = activePlaylistRef.current || activePlaylist;
        if (!currentActive?.songs?.length) return;
        setPlayerInfo(p => ({ ...p, currentVidIndex: p.currentVidIndex === 0 ? currentActive.songs.length - 1 : p.currentVidIndex - 1, duration: 0, currentTime: 0, isPlaying: true }));
    };

    const selectSong = (index) => {
        setPlayerInfo({ isPlaying: true, currentVidIndex: index, duration: 0, currentTime: 0 });
    };

    const handleSliderChange = (e) => {
        if (!playerState || !playerInfo.duration) return;
        const newTime = parseFloat(e.target.value);
        setPlayerInfo(p => ({ ...p, currentTime: newTime }));
        playerState.seekTo(newTime, true);
    };

    const handleVolumeChange = (e) => {
        const val = parseInt(e.target.value);
        setVolume(val);
        if (playerState) {
            playerState.setVolume(val);
            if (val > 0 && isMuted) {
                playerState.unMute();
                setIsMuted(false);
            }
            if (val === 0 && !isMuted) {
                playerState.mute();
                setIsMuted(true);
            }
        }
    };

    const toggleMute = () => {
        if (!playerState) return;
        if (isMuted) {
            playerState.unMute();
            setIsMuted(false);
            if (volume === 0) {
                setVolume(50);
                playerState.setVolume(50);
            }
        } else {
            playerState.mute();
            setIsMuted(true);
        }
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
        <div
            className="flex flex-col h-[calc(100vh-56px)] bg-black text-zinc-300 font-sans selection:bg-white selection:text-black"
            onClick={() => { if (songMoveMenuId !== null) setSongMoveMenuId(null); }}
        >
            {/* Invisible Player */}
            {currentSong && (
                <div className="hidden">
                    <YouTube
                        videoId={currentSong.videoId}
                        opts={{ playerVars: { autoplay: playerInfo.isPlaying ? 1 : 0, controls: 0 } }}
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
                                <button onClick={handleCreatePlaylist} className="hover:text-white transition-colors cursor-pointer" title="Create Playlist">
                                    <Plus size={14} className="opacity-70 group-hover:opacity-100" />
                                </button>
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
                                        if (editingPlaylistId !== pl.id) {
                                            setActivePlaylistId(pl.id);
                                            setPlayerInfo({ isPlaying: false, currentVidIndex: 0, duration: 0, currentTime: 0 });
                                        }
                                    }}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${activePlaylistId === pl.id ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50'}`}
                                >
                                    {editingPlaylistId === pl.id ? (
                                        <form onSubmit={(e) => handleRenamePlaylist(pl.id, e)} className="flex-1 mr-2">
                                            <input
                                                autoFocus
                                                type="text"
                                                className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded px-2 py-1 w-full outline-none"
                                                value={editPlaylistName}
                                                onChange={(e) => setEditPlaylistName(e.target.value)}
                                                onBlur={(e) => handleRenamePlaylist(pl.id, e)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </form>
                                    ) : (
                                        <span className="text-sm truncate w-full pr-2" onDoubleClick={() => { setEditingPlaylistId(pl.id); setEditPlaylistName(pl.name); }}>{pl.name}</span>
                                    )}

                                    {editingPlaylistId !== pl.id && (
                                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-3 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingPlaylistId(pl.id); setEditPlaylistName(pl.name); }}
                                                className="text-zinc-500 hover:text-white"
                                                title="Rename playlist"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button onClick={(e) => handleDeletePlaylist(pl.id, e)} className="text-zinc-500 hover:text-white" title="Delete playlist">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )}
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
                            <div className="p-6 sm:p-8 flex items-end gap-6 bg-gradient-to-b from-zinc-800 to-[#121212] h-64 sm:h-80 transition-all">
                                <div className="w-32 h-32 sm:w-48 sm:h-48 shadow-2xl bg-zinc-900 flex items-center justify-center shrink-0 rounded-md">
                                    <Disc size={64} className="text-white/20" />
                                </div>
                                <div className="flex flex-col text-white pb-2 overflow-hidden">
                                    <span className="text-xs sm:text-sm font-medium mb-1 tracking-wider uppercase">Playlist</span>
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
                                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-xl"
                                        onClick={togglePlay}
                                    >
                                        {playerInfo.isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                    </button>
                                </div>
                                <form onSubmit={handleAddSong} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 focus-within:ring-1 ring-white/30 transition-all max-w-[250px] sm:max-w-sm">
                                    <input
                                        type="text"
                                        placeholder="Paste YouTube link..."
                                        value={newVideoUrl}
                                        onChange={e => setNewVideoUrl(e.target.value)}
                                        className="bg-transparent outline-none text-sm w-full placeholder-zinc-500 text-white"
                                    />
                                    {isAddingSong ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <button type="submit" disabled={!newVideoUrl} className="text-zinc-400 hover:text-white disabled:opacity-50 transition-colors" title="Add song to playlist">
                                            <Plus size={18} />
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* Table Header */}
                            <div className="px-6 sm:px-8 mt-4">
                                <div className="grid grid-cols-[3fr_2fr_1fr] sm:grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 text-xs font-medium text-zinc-400 uppercase border-b border-white/10 pb-2 mb-2 px-2 tracking-wider">
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
                                                <div className="hidden sm:flex items-center justify-end w-4 relative text-zinc-400">
                                                    <span className={`group-hover:hidden ${isActive ? 'text-white' : ''}`}>{idx + 1}</span>
                                                    <button onClick={() => selectSong(idx)} className="absolute hidden group-hover:block hover:text-white">
                                                        {isActive && playerInfo.isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                                    </button>
                                                </div>

                                                <div className="flex flex-col truncate pr-4 cursor-pointer" onClick={() => selectSong(idx)}>
                                                    <span className={`truncate text-base ${isActive ? 'text-white' : 'text-zinc-200'}`}>{song.title}</span>
                                                    <span className="truncate text-sm text-zinc-400 group-hover:text-white transition-colors">{song.author || "Unknown"}</span>
                                                </div>

                                                <div className="hidden sm:block truncate text-sm text-zinc-400 group-hover:text-white transition-colors pr-4 cursor-default">
                                                    Custom Curation
                                                </div>

                                                <div className="truncate text-sm text-zinc-400 cursor-default">
                                                    {formatDate(song.addedAt)}
                                                </div>

                                                <div className="flex items-center justify-end gap-3 text-sm text-zinc-400 relative">
                                                    <span className="flex-1 text-right pr-2">{song.duration ? formatTime(song.duration) : '--:--'}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSongMoveMenuId(songMoveMenuId === idx ? null : idx);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 hover:text-white p-1"
                                                        title="More options"
                                                    >
                                                        <MoreHorizontal size={16} />
                                                    </button>

                                                    {songMoveMenuId === idx && (
                                                        <div className="absolute right-8 top-8 z-50 w-48 bg-[#282828] border border-white/10 rounded-md shadow-2xl py-1 text-sm text-zinc-300">
                                                            <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Move to...</div>
                                                            {playlists.filter(p => p.id !== activePlaylist.id).length === 0 ? (
                                                                <div className="px-3 py-2 text-zinc-500 text-xs italic">No other playlists</div>
                                                            ) : (
                                                                playlists.filter(p => p.id !== activePlaylist.id).map(p => (
                                                                    <button
                                                                        key={p.id}
                                                                        onClick={(e) => { e.stopPropagation(); handleMoveSong(song, p.id); }}
                                                                        className="w-full text-left px-3 py-2 hover:bg-white/10 hover:text-white truncate flex items-center justify-between"
                                                                    >
                                                                        <span className="truncate">{p.name}</span>
                                                                        <ArrowRight size={14} className="opacity-50 shrink-0 ml-2" />
                                                                    </button>
                                                                ))
                                                            )}
                                                            <div className="border-t border-white/10 my-1"></div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setSongMoveMenuId(null); handleRemoveSong(song, e); }}
                                                                className="w-full text-left px-3 py-2 hover:bg-white/10 text-red-400 hover:text-red-300 flex items-center justify-between"
                                                            >
                                                                Remove from playlist
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    )}
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
                            <div className="flex flex-col truncate pr-4">
                                <a href={`https://youtube.com/watch?v=${currentSong.videoId}`} target="_blank" rel="noreferrer" className="text-white text-sm hover:underline truncate">
                                    {currentSong.title}
                                </a>
                                <span className="text-xs text-zinc-400 truncate hover:underline hover:text-white cursor-pointer mt-0.5">
                                    {currentSong.author || "Unknown"}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Player Controls */}
                <div className="w-1/3 max-w-[722px] flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsShuffle(!isShuffle); }}
                            className={`transition-colors relative ${isShuffle ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                            title="Shuffle"
                        >
                            <Shuffle size={16} />
                            {isShuffle && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>}
                        </button>

                        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="text-zinc-400 hover:text-white transition-colors" title="Previous">
                            <SkipBack size={20} fill="currentColor" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {playerInfo.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="text-zinc-400 hover:text-white transition-colors" title="Next">
                            <SkipForward size={20} fill="currentColor" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); setIsRepeat(!isRepeat); }}
                            className={`transition-colors relative ${isRepeat ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                            title="Repeat song"
                        >
                            <Repeat size={16} />
                            {isRepeat && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>}
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 text-xs text-zinc-400 font-medium hidden sm:flex">
                        <span className="w-10 text-right">{formatTime(playerInfo.currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={playerInfo.duration || 100}
                            value={playerInfo.duration ? playerInfo.currentTime : 0}
                            onChange={handleSliderChange}
                            className="flex-1 h-1 appearance-none cursor-pointer range-slider rounded-full"
                            style={{
                                background: `linear-gradient(to right, #fff ${playerInfo.duration ? (playerInfo.currentTime / playerInfo.duration) * 100 : 0}%, #4d4d4d ${playerInfo.duration ? (playerInfo.currentTime / playerInfo.duration) * 100 : 0}%)`
                            }}
                        />
                        <span className="w-10 text-left">{formatTime(playerInfo.duration)}</span>
                    </div>
                </div>

                {/* Volume / Extra Controls */}
                <div className="w-1/3 flex justify-end items-center gap-4 text-zinc-400 hidden md:flex pr-2">
                    <div className={`flex items-end gap-[3px] h-4 ${playerInfo.isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity mr-4`}>
                        <div className="w-1 bg-white h-2 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></div>
                        <div className="w-1 bg-white h-4 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.2s' }}></div>
                        <div className="w-1 bg-white h-3 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.9s' }}></div>
                        <div className="w-1 bg-white h-3 animate-bounce" style={{ animationDelay: '100ms', animationDuration: '1.1s' }}></div>
                    </div>

                    <div className="flex items-center gap-2 group w-32" onClick={(e) => e.stopPropagation()}>
                        <button onClick={toggleMute} className="hover:text-white transition-colors" title={isMuted ? "Unmute" : "Mute"}>
                            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="flex-1 h-1 bg-[#4d4d4d] appearance-none cursor-pointer range-slider rounded-full"
                            style={{
                                background: `linear-gradient(to right, #fff ${isMuted ? 0 : volume}%, #4d4d4d ${isMuted ? 0 : volume}%)`
                            }}
                        />
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
                
                /* Range Slider Styling */
                .range-slider {
                    -webkit-appearance: none;
                    width: 100%;
                }
                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s, transform 0.1s;
                }
                .range-slider:hover::-webkit-slider-thumb {
                    opacity: 1;
                }
                .range-slider::-webkit-slider-thumb:active {
                    transform: scale(1.2);
                }
            `}} />
        </div>
    );
}
