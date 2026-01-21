import { useState } from "react";
import { Home } from "./components/Home";
import { GenSelector } from "./components/GenSelector";
import { GameBoard } from "./components/GameBoard";

// On définit les 3 états possibles de l'application
type AppView = "HOME" | "SELECTOR" | "GAME";

function App() {
    // État de navigation
    const [currentView, setCurrentView] = useState<AppView>("HOME");

    // État des données
    const [selectedGens, setSelectedGens] = useState<number[]>([1]);

    // --- Logique du Selecteur ---
    const handleToggleGen = (genId: number) => {
        setSelectedGens((prev) => {
            if (prev.includes(genId)) {
                if (prev.length === 1) return prev; // Garde au moins 1 gen
                return prev.filter((id) => id !== genId);
            } else {
                return [...prev, genId].sort((a, b) => a - b);
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* VUE 1 : ACCUEIL */}
            {currentView === "HOME" && (
                <Home onStart={() => setCurrentView("SELECTOR")} />
            )}

            {/* VUE 2 : SÉLECTION DES GÉNÉRATIONS */}
            {currentView === "SELECTOR" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    {/* Petit bouton retour en haut à gauche */}
                    <button
                        onClick={() => setCurrentView("HOME")}
                        className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
                    >
                        ← Retour accueil
                    </button>

                    <GenSelector
                        selectedGens={selectedGens}
                        onToggleGen={handleToggleGen}
                        onStartGame={() => setCurrentView("GAME")}
                    />
                </div>
            )}

            {/* VUE 3 : LE JEU */}
            {currentView === "GAME" && (
                <GameBoard
                    selectedGens={selectedGens}
                    // Quand on fait "Retour" depuis le jeu, on revient au sélecteur
                    onBack={() => setCurrentView("SELECTOR")}
                />
            )}
        </div>
    );
}

export default App;
