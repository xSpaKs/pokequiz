import { useEffect, useState, useRef } from "react";
import type { Pokemon } from "../types";
import { PokeCard } from "./PokeCard";
import { normalizeInput } from "../utils/text";
import { Search, Loader2, Trophy, Clock } from "lucide-react";
import TYPE_TRANSLATIONS from "../data/types";
import { getTypeSprite, getPixelSprite } from "../utils/sprites";
import { GameWon } from "./GameWon";
import { GENERATIONS_CONFIG } from "../data/generations";

interface GameBoardProps {
    selectedGens: number[];
    onBack: () => void;
}

export const GameBoard = ({ selectedGens, onBack }: GameBoardProps) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);
    const [isWon, setIsWon] = useState(false);
    const [currentDuration, setCurrentDuration] = useState(0);

    // 1. CHARGEMENT DES DONNÉES
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. On prépare la requête GraphQL
                // On demande : ID, Nom (FR), et Types pour les générations choisies
                const query = `
                query getGenData($genIds: [Int!]) {
                    pokemon_v2_generation(where: {id: {_in: $genIds}}) {
                        id
                        pokemon_v2_pokemonspecies(order_by: {id: asc}) {
                            id
                            pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 5}}) {
                                name
                            }
                            pokemon_v2_pokemons(limit: 1) {
                                pokemon_v2_pokemontypes {
                                    pokemon_v2_type {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            `;

                // 2. On fait le fetch vers l'API GraphQL (Beta)
                const response = await fetch(
                    "https://beta.pokeapi.co/graphql/v1beta",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            query: query,
                            variables: { genIds: selectedGens },
                        }),
                    },
                );

                const json = await response.json();

                // 3. On extrait les données brutes qui sont imbriquées
                // La structure GraphQL renvoie un tableau par génération
                const rawGenerations = json.data.pokemon_v2_generation;

                // On a besoin d'un tableau plat de tous les pokémons
                let allPokemonsRaw: any[] = [];
                rawGenerations.forEach((gen: any) => {
                    // On transforme d'abord les données pour ajouter l'ID de gen
                    const pokemonsWithGen = gen.pokemon_v2_pokemonspecies.map(
                        (p: any) => ({
                            ...p,
                            currentGenId: gen.id, // On attache l'ID de la génération
                        }),
                    );

                    // Et on ajoute SEULEMENT cette version à la liste finale
                    allPokemonsRaw = [...allPokemonsRaw, ...pokemonsWithGen];
                });

                // 4. On nettoie et formate
                const cleanData: Pokemon[] = allPokemonsRaw.map((p: any) => {
                    // Récupération du nom FR (ou fallback anglais si manquant)
                    const frName =
                        p.pokemon_v2_pokemonspeciesnames[0]?.name || "Unknown";

                    // Récupération des types (qui sont dans un sous-objet)
                    const typesRaw =
                        p.pokemon_v2_pokemons[0]?.pokemon_v2_pokemontypes || [];

                    const formattedTypes = typesRaw.map((t: any) => {
                        const enType = t.pokemon_v2_type.name;
                        const frType = TYPE_TRANSLATIONS[enType] || enType; // Traduction
                        return {
                            name: frType,
                            image: getTypeSprite(frType), // On utilise ta fonction existante
                        };
                    });

                    return {
                        pokedexId: p.id,
                        generation: p.currentGenId,
                        category: "Pokemon",
                        name: {
                            fr: frName,
                            en: "Unknown",
                        },
                        sprites: {
                            regular: getPixelSprite(p.id),
                        },
                        types: formattedTypes,
                        found: false,
                    };
                });

                // Tri final par ID pour être sûr
                cleanData.sort((a, b) => a.pokedexId - b.pokedexId);

                setPokemons(cleanData);
            } catch (error) {
                console.error("Erreur PokéAPI GraphQL:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedGens]);

    // Démarrage du chrono
    useEffect(() => {
        if (!loading && pokemons.length > 0) {
            setStartTime(Date.now());
            setIsWon(false); // Reset victoire
            setScore(0);
        }
    }, [loading]);

    // Effet pour mettre à jour le chrono chaque seconde
    useEffect(() => {
        if (loading || isWon) return; // On arrête si chargement ou victoire

        const interval = setInterval(() => {
            // On calcule la différence entre maintenant et le début
            setCurrentDuration(Date.now() - startTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [loading, startTime, isWon]);

    // Fonction pour formater en MM:SS
    const formatTimer = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor(ms / 1000 / 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // 2. LOGIQUE DE JEU
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        const cleanGuess = normalizeInput(val);
        if (cleanGuess.length < 3) return;

        const matchIndex = pokemons.findIndex(
            (p) => !p.found && normalizeInput(p.name.fr) === cleanGuess,
        );

        if (matchIndex !== -1) {
            const newList = [...pokemons];
            newList[matchIndex].found = true;

            setPokemons(newList);
            const newScore = score + 1;
            setScore(newScore);
            setInput("");

            // --- VICTOIRE DÉTECTÉE ---
            if (newScore === pokemons.length) {
                setEndTime(Date.now());
                setIsWon(true);
            }
        }
    };

    // Fonction pour relancer la même partie
    const handleRestart = () => {
        // En forçant le rechargement via un petit trick ou en resetant les states
        // Le plus simple ici est de reset les pokemon found:false
        const resetPokemons = pokemons.map((p) => ({ ...p, found: false }));
        setPokemons(resetPokemons);
        setScore(0);
        setStartTime(Date.now());
        setIsWon(false);
        setInput("");
    };

    // --- RENDU CONDITIONNEL : SI GAGNÉ, ON AFFICHE GAMEWON ---
    if (isWon) {
        return (
            <GameWon
                duration={endTime - startTime}
                selectedGens={selectedGens}
                onRestart={handleRestart}
                onBackToMenu={onBack}
            />
        );
    }

    // Calcul du pourcentage
    const progress =
        pokemons.length > 0 ? Math.round((score / pokemons.length) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p>Capture des Pokemons...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* --- HEADER STICKY --- */}
            <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 p-4 shadow-2xl">
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    {/* Ligne du haut : Retour - Timer - Score */}
                    <div className="flex justify-between items-center text-white relative">
                        {/* GAUCHE : Bouton Retour */}
                        <button
                            onClick={onBack}
                            className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <span>←</span>{" "}
                            <span className="hidden sm:inline">
                                Retourner à l'accueil
                            </span>
                        </button>

                        {/* CENTRE : Le Timer (Nouveau) */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-xl font-bold text-blue-400 bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-800">
                            <Clock className="w-5 h-5" />
                            <span>{formatTimer(currentDuration)}</span>
                        </div>

                        {/* DROITE : Score */}
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <Trophy className="text-yellow-500 w-5 h-5" />
                            <span>
                                {score}{" "}
                                <span className="text-slate-500 text-sm">
                                    / {pokemons.length}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Barre de progression visuelle (Inchangée) */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-blue-600 to-cyan-400 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Zone de Recherche (Inchangée) */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={handleInput}
                            autoFocus
                            placeholder="Entrez le nom d'un Pokémon..."
                            className="w-full bg-slate-900 border-2 border-slate-700 text-white text-lg rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* --- GRILLE DES POKEMONS PAR GÉNÉRATION --- */}
            <div className="flex flex-col gap-12 p-4 mt-4 pb-20">
                {selectedGens.map((genId) => {
                    // 1. On filtre les pokemons de cette génération
                    const genPokemons = pokemons.filter(
                        (p) => p.generation === genId,
                    );

                    // Sécurité : si pas de pokemon chargé pour cette gen, on n'affiche rien
                    if (genPokemons.length === 0) return null;

                    return (
                        <div
                            key={genId}
                            className="animate-in fade-in duration-700 slide-in-from-bottom-4"
                        >
                            {/* Titre de la section */}
                            <div className="flex items-center gap-4 mb-4 border-b border-slate-800 pb-2">
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                                    Génération {genId}
                                    {" • "}
                                    {GENERATIONS_CONFIG.at(genId - 1)?.region}
                                </h2>
                                <span className="text-slate-600 text-sm ml-auto">
                                    {genPokemons.filter((p) => p.found).length}{" "}
                                    / {genPokemons.length} trouvés
                                </span>
                            </div>

                            {/* La Grille pour cette génération */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 content-visibility-auto">
                                {genPokemons.map((poke) => (
                                    <PokeCard
                                        key={poke.pokedexId}
                                        pokemon={poke}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
