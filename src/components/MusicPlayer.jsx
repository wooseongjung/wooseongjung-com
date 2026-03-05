import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { db, auth } from '../App'; // We will export db & auth from App.jsx
import { collection, doc, setDoc, onSnapshot, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Play, Pause, SkipForward, SkipBack, ListMusic, Plus, Trash2, X } from 'lucide-react';

export default function MusicPlayer({ user }) {
    const [playlists, setPlaylists] = useState([]);
    const [activePlaylistId, setActivePlaylistId] = useState(null);

    // Playback state
    const [playerInfo, setPlayerInfo] = useState({ isPlaying: false, currentVidIndex: 0 });
    const [playerState, setPlayerState] = useState(null); // The youtube player target
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newVideoUrl, setNewVideoUrl] = useState('');

    const activePlaylist = playlists.find(p => p.id === activePlaylistId) || null;

    // Fetch playlists for the user
    useEffect(() => {
        if (!user) {
            setPlaylists([]);
            setActivePlaylistId(null);
            return;
        }
        const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'playlists'), (snapshot) => {
            const pData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlaylists(pData);
            // We no longer need to manually sync activePlaylist because it is derived from playlists on each render.
        });
        return () => unsubscribe();
    }, [user]);

    // Handle parsing a YouTube URL into a video ID
    const parseYouTubeId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim() || !user) return;
        const newId = Date.now().toString(); // simple ID
        await setDoc(doc(db, 'users', user.uid, 'playlists', newId), {
            name: newPlaylistName,
            songs: []
        });
        setNewPlaylistName('');
    };

    const handleDeletePlaylist = async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'playlists', id));
        if (activePlaylistId === id) setActivePlaylistId(null);
    };

    const handleAddSong = async () => {
        if (!newVideoUrl.trim() || !activePlaylist || !user) return;
        const vidId = parseYouTubeId(newVideoUrl) || newVideoUrl.trim(); // Allow raw IDs too
        if (!vidId || vidId.length !== 11) {
            alert("Invalid YouTube URL or Video ID");
            return;
        }

        const newSong = { videoId: vidId, title: `Track (${vidId})`, addedAt: Date.now() };

        // Ensure the doc exists and update the array
        await setDoc(doc(db, 'users', user.uid, 'playlists', activePlaylist.id), {
            songs: arrayUnion(newSong)
        }, { merge: true });

        setNewVideoUrl('');
    };

    const handleRemoveSong = async (song) => {
        if (!activePlaylist || !user) return;
        await updateDoc(doc(db, 'users', user.uid, 'playlists', activePlaylist.id), {
            songs: arrayRemove(song)
        });
    };

    // --- Playback Controls ---
    const currentSong = activePlaylist?.songs?.[playerInfo.currentVidIndex];

    const onPlayerReady = (event) => {
        setPlayerState(event.target);
    };

    const onPlayerStateChange = (event) => {
        // 1 = playing, 2 = paused, 0 = ended
        if (event.data === 1) setPlayerInfo(p => ({ ...p, isPlaying: true }));
        if (event.data === 2) setPlayerInfo(p => ({ ...p, isPlaying: false }));
        if (event.data === 0) handleNext(); // Auto play next when ended
    };

    const togglePlay = () => {
        if (!playerState) return;
        if (playerInfo.isPlaying) playerState.pauseVideo();
        else playerState.playVideo();
    };

    const handleNext = () => {
        if (!activePlaylist?.songs?.length) return;
        setPlayerInfo(p => ({
            ...p,
            currentVidIndex: (p.currentVidIndex + 1) % activePlaylist.songs.length
        }));
    };

    const handlePrev = () => {
        if (!activePlaylist?.songs?.length) return;
        setPlayerInfo(p => ({
            ...p,
            currentVidIndex: p.currentVidIndex === 0 ? activePlaylist.songs.length - 1 : p.currentVidIndex - 1
        }));
    };

    const selectSong = (index) => {
        setPlayerInfo({ isPlaying: true, currentVidIndex: index });
    };

    if (!user) {
        return (
            <div className="bg-white p-6 border border-zinc-100 shadow-sm relative group col-span-1 md:col-span-3 hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-200 transition-colors group-hover:border-zinc-900"></div>
                <ListMusic size={24} className="text-zinc-400 mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 mb-2">Sonic Curation</h3>
                <p className="text-sm text-zinc-500 font-light mb-4">You must be signed in to manage and play your private playlists.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-100 shadow-sm relative group col-span-1 md:col-span-3 hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-200 transition-colors group-hover:border-zinc-900 z-10"></div>

            {/* Invisible YouTube Player */}
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

            {/* Sidebar: Playlists */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-zinc-100 p-6 flex flex-col bg-zinc-50/50">
                <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center gap-2">
                    <ListMusic size={18} /> Playlists
                </h3>

                <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
                    {playlists.length === 0 ? (
                        <p className="text-sm text-zinc-400 font-light italic">No playlists yet.</p>
                    ) : (
                        playlists.map(pl => (
                            <div
                                key={pl.id}
                                className={`flex items-center justify-between p-2 rounded text-sm cursor-pointer transition-colors ${activePlaylistId === pl.id ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100 text-zinc-600'}`}
                                onClick={() => {
                                    setActivePlaylistId(pl.id);
                                    setPlayerInfo({ isPlaying: false, currentVidIndex: 0 }); // reset playback
                                }}
                            >
                                <span className="truncate">{pl.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(pl.id); }} className="opacity-50 hover:opacity-100">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="New playlist..."
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="flex-1 bg-white border border-zinc-200 text-sm px-3 py-1.5 outline-none focus:border-zinc-400"
                    />
                    <button onClick={handleCreatePlaylist} className="bg-zinc-900 text-white p-1.5 px-3 hover:bg-zinc-800 transition-colors"><Plus size={16} /></button>
                </div>
            </div>

            {/* Main Content: Songs & Player */}
            <div className="w-full md:w-2/3 flex flex-col">
                {!activePlaylist ? (
                    <div className="flex-1 flex items-center justify-center p-8 text-zinc-400 font-light text-sm">
                        Select or create a playlist to start listening.
                    </div>
                ) : (
                    <>
                        <div className="flex-1 p-6 overflow-y-auto bg-white min-h-[250px]">
                            <h4 className="font-medium text-zinc-900 mb-6 flex justify-between items-center">
                                <span>{activePlaylist.name}</span>
                                <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{activePlaylist.songs?.length || 0} tracks</span>
                            </h4>

                            <div className="space-y-1">
                                {activePlaylist.songs?.length === 0 && (
                                    <p className="text-sm text-zinc-400 font-light italic mt-4">Empty playlist.</p>
                                )}
                                {activePlaylist.songs?.map((song, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between text-sm p-2 group hover:bg-zinc-50 border-l-2 transition-colors ${playerInfo.currentVidIndex === idx ? 'border-zinc-900 bg-zinc-50 font-medium text-zinc-900' : 'border-transparent text-zinc-500 font-light'}`}
                                    >
                                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => selectSong(idx)}>
                                            <span className="text-xs text-zinc-400 w-4 text-right">{idx + 1}</span>
                                            <span className="truncate">{song.title}</span>
                                        </div>
                                        <button onClick={() => handleRemoveSong(song)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity p-1">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Input to Add Songs */}
                        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex gap-2">
                            <input
                                type="text"
                                placeholder="Paste YouTube URL or Video ID..."
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                className="flex-1 bg-white border border-zinc-200 text-sm px-3 py-2 outline-none focus:border-zinc-400"
                            />
                            <button disabled={!newVideoUrl.trim()} onClick={handleAddSong} className="bg-zinc-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors">
                                Add Song
                            </button>
                        </div>

                        {/* Bottom Player Controls */}
                        <div className="bg-zinc-900 text-white p-4 flex items-center justify-between">
                            <div className="flex flex-col truncate w-1/3">
                                <span className="text-xs text-zinc-400 font-light uppercase tracking-wider mb-0.5">Now Playing</span>
                                <span className="text-sm font-medium truncate">
                                    {currentSong ? currentSong.title : '---'}
                                </span>
                            </div>

                            <div className="flex items-center gap-6 justify-center w-1/3">
                                <button onClick={handlePrev} className="text-zinc-400 hover:text-white transition-colors"><SkipBack size={18} fill="currentColor" /></button>
                                <button onClick={togglePlay} className="text-white hover:text-zinc-200 transition-colors hover:scale-105 transform">
                                    {playerInfo.isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                                </button>
                                <button onClick={handleNext} className="text-zinc-400 hover:text-white transition-colors"><SkipForward size={18} fill="currentColor" /></button>
                            </div>

                            <div className="w-1/3 flex justify-end">
                                {/* Visualizer bars just for aesthetics */}
                                <div className={`flex items-end gap-[2px] h-4 ${playerInfo.isPlaying ? '' : 'opacity-30'}`}>
                                    <div className="w-1 bg-white h-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1 bg-white h-4 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                                    <div className="w-1 bg-white h-3 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                                    <div className="w-1 bg-white h-1 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
