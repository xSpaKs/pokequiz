import { GENERATIONS_CONFIG, getSpriteUrl } from "../data/generations";

interface GenSelectorProps {
    selectedGens: number[];
    onToggleGen: (genId: number) => void;
    onStartGame: () => void;
}

export const GenSelector = ({
    selectedGens,
    onToggleGen,
    onStartGame,
}: GenSelectorProps) => {
    // Fonction utilitaire pour tout sélectionner/désélectionner
    const toggleAll = () => {
        if (selectedGens.length === GENERATIONS_CONFIG.length) {
            // Si tout est coché, on décoche tout sauf la 1
            GENERATIONS_CONFIG.forEach((g) => {
                if (g.id !== 1 && selectedGens.includes(g.id))
                    onToggleGen(g.id);
            });
        } else {
            // Sinon on coche tout
            GENERATIONS_CONFIG.forEach((g) => {
                if (!selectedGens.includes(g.id)) onToggleGen(g.id);
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-3xl font-bold text-white mb-8">
                Choisissez vos générations
            </h1>
            {/* Grille des générations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {GENERATIONS_CONFIG.map((gen) => {
                    const isSelected = selectedGens.includes(gen.id);

                    return (
                        <button
                            key={gen.id}
                            onClick={() => onToggleGen(gen.id)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 group flex flex-col items-center justify-center gap-2 cursor-pointer
                ${
                    isSelected
                        ? "bg-blue-900/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        : "bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                }
              `}
                        >
                            <span
                                className={`font-bold ${isSelected ? "text-blue-400" : "text-slate-400"}`}
                            >
                                {gen.label}
                            </span>

                            {/* Les 3 starters */}
                            <div className="flex items-center justify-center -space-x-6 mt-2">
                                {" "}
                                {/* <-- MODIF ICI : -space-x-6 au lieu de gap */}
                                {gen.starters.map((starterId) => (
                                    <img
                                        key={starterId}
                                        src={getSpriteUrl(starterId)}
                                        alt="Starter"
                                        // MODIF CI-DESSOUS : w-14 h-14 (plus gros) et z-index pour gérer l'ordre de superposition
                                        className={`
                w-20 h-20 object-contain relative z-10 
                transition-transform duration-300 
                ${
                    isSelected
                        ? "scale-110 drop-shadow-md z-20" // On grossit encore plus si sélectionné
                        : "opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                }
            `}
                                    />
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={toggleAll}
                    className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    {selectedGens.length === GENERATIONS_CONFIG.length
                        ? "Tout décocher"
                        : "Tout sélectionner"}
                </button>

                <button
                    onClick={onStartGame}
                    disabled={selectedGens.length === 0}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold px-12 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                >
                    LANCER LE QUIZ
                </button>
            </div>
        </div>
    );
};
