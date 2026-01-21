import { useState } from "react";
import { saveScore } from "../api/scores";
import {
    Trophy,
    Clock,
    RotateCcw,
    Home,
    Send,
    PartyPopper,
} from "lucide-react";

interface GameWonProps {
    duration: number; // Temps en ms
    selectedGens: number[];
    onRestart: () => void;
    onBackToMenu: () => void;
}

export const GameWon = ({
    duration,
    selectedGens,
    onRestart,
    onBackToMenu,
}: GameWonProps) => {
    const [pseudo, setPseudo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scoreSaved, setScoreSaved] = useState(false);

    // LOGIQUE D'ÉLIGIBILITÉ
    // On peut sauvegarder si : 1 seule Gen sélectionnée OU Toutes les Gens (9)
    const isNationalMode = selectedGens.length === 9;
    const isSingleGenMode = selectedGens.length === 1;
    const canSaveScore = isNationalMode || isSingleGenMode;

    // Déterminer l'ID de la gen pour la base de données (0 = National)
    const generationId = isNationalMode ? 0 : selectedGens[0];

    const formatTime = (ms: number) => {
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        const milli = Math.floor((ms % 1000) / 10);
        return `${min}:${sec.toString().padStart(2, "0")}.${milli.toString().padStart(2, "0")}`;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pseudo.trim() || !canSaveScore) return;

        setIsSubmitting(true);
        try {
            await saveScore(pseudo, duration, generationId);
            setScoreSaved(true);
        } catch (error) {
            console.error("Erreur sauvegarde", error);
            alert("Erreur lors de la sauvegarde du score.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden">
                {/* Effet de fond "Party" */}
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />

                <div className="flex justify-center mb-6">
                    <div className="bg-yellow-500/20 p-4 rounded-full">
                        <Trophy className="w-16 h-16 text-yellow-500" />
                    </div>
                </div>

                <h2 className="text-4xl font-black text-white mb-2 uppercase italic">
                    Victoire !
                </h2>
                <p className="text-slate-400 mb-8">Tu les as tous attrapés !</p>

                {/* --- STATS --- */}
                <div className="bg-slate-950 rounded-xl p-6 mb-8 flex flex-col gap-2 border border-slate-800">
                    <span className="text-slate-500 text-sm uppercase tracking-wider font-bold">
                        Temps Final
                    </span>
                    <div className="flex items-center justify-center gap-3 text-3xl font-mono font-bold text-blue-400">
                        <Clock className="w-8 h-8" />
                        {formatTime(duration)}
                    </div>
                    <div className="text-sm text-slate-500 mt-2">
                        Mode :{" "}
                        {isNationalMode
                            ? "National (Toutes Gens)"
                            : isSingleGenMode
                              ? `Génération ${selectedGens[0]}`
                              : "Multi-Générations (Custom)"}
                    </div>
                </div>

                {/* --- FORMULAIRE SAUVEGARDE --- */}
                {canSaveScore ? (
                    !scoreSaved ? (
                        <form onSubmit={handleSave} className="mb-8">
                            <label className="block text-left text-sm font-bold text-slate-300 mb-2">
                                Enregistre ton record
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={pseudo}
                                    onChange={(e) => setPseudo(e.target.value)}
                                    placeholder="Ton pseudo..."
                                    maxLength={15}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-8 p-4 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 flex items-center justify-center gap-2">
                            <PartyPopper className="w-5 h-5" />
                            Score enregistré avec succès !
                        </div>
                    )
                ) : (
                    <div className="mb-8 p-4 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20 text-sm">
                        Le classement n'est disponible que si tu joues sur{" "}
                        <strong>une seule génération</strong> ou le{" "}
                        <strong>mode National</strong> (toutes).
                    </div>
                )}

                {/* --- BOUTONS ACTIONS --- */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onBackToMenu}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Accueil
                    </button>
                    <button
                        onClick={onRestart}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-900/20"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Rejouer
                    </button>
                </div>
            </div>
        </div>
    );
};
