import { useState, useEffect } from "react";
import { getTopScores } from "../api/scores";
import { Trophy, Clock, Medal, Globe } from "lucide-react"; // J'ajoute Globe pour le National

export const Leaderboard = () => {
    // On commence par défaut sur le National (0) ou la Gen 1, au choix
    const [activeGen, setActiveGen] = useState(0);
    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getTopScores(activeGen)
            .then((data) => setScores(data || []))
            .catch(() => setScores([]))
            .finally(() => setLoading(false));
    }, [activeGen]);

    const formatTime = (ms: number) => {
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        const milli = Math.floor((ms % 1000) / 10);
        return `${min}:${sec.toString().padStart(2, "0")}.${milli.toString().padStart(2, "0")}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("fr-FR", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl max-w-2xl w-full mx-auto mt-8">
            <div className="flex items-center gap-2 mb-6 text-yellow-500">
                <Trophy className="w-6 h-6" />
                <h2 className="text-2xl font-bold text-white">
                    Meilleurs Dresseurs
                </h2>
            </div>

            {/* --- ONGLETS DES GÉNÉRATIONS --- */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                {/* On ajoute 0 au début de la liste */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => {
                    const isNational = gen === 0;
                    const isActive = activeGen === gen;

                    return (
                        <button
                            key={gen}
                            onClick={() => setActiveGen(gen)}
                            className={`
                    px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer
                    ${
                        isActive
                            ? isNational
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                                : "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }
                    `}
                        >
                            {isNational && <Globe className="w-3 h-3" />}
                            {isNational ? "NATIONAL" : `Gen ${gen}`}
                        </button>
                    );
                })}
            </div>

            {/* --- LISTE DES SCORES --- */}
            <div className="space-y-2 min-h-50">
                {loading ? (
                    <div className="text-center text-slate-500 py-10 flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Chargement des records...
                    </div>
                ) : scores.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 italic border-2 border-dashed border-slate-800 rounded-lg">
                        Aucun record pour l'instant.
                        <br />
                        <span className="text-sm">
                            Sois le premier à inscrire ton nom !
                        </span>
                    </div>
                ) : (
                    scores.map((score, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                {/* Icône de rang (inchangé) */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-inner
                ${
                    index === 0
                        ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                        : index === 1
                          ? "bg-gray-400/20 text-gray-300 border border-gray-400/30"
                          : index === 2
                            ? "bg-orange-700/20 text-orange-500 border border-orange-700/30"
                            : "text-slate-500 bg-slate-900"
                }`}
                                >
                                    {index < 3 ? (
                                        <Medal className="w-5 h-5" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>

                                <div className="flex flex-col pr-2">
                                    <span
                                        className={`font-semibold truncate max-w-37.5 ${
                                            index === 0
                                                ? "text-white"
                                                : "text-slate-300"
                                        }`}
                                    >
                                        {score.username}
                                    </span>
                                </div>
                            </div>

                            {/* PARTIE DROITE : Temps + Date */}
                            <div className="flex flex-col items-end gap-1">
                                {/* La Date (ajoutée ici) */}
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide text-right">
                                    {formatDate(score.created_at)}
                                </span>
                                {/* Le Chrono */}
                                <div className="flex items-center gap-2 text-slate-300 font-mono bg-slate-950/50 px-2 py-1 rounded border border-slate-800">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                    {formatTime(score.time_ms)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
