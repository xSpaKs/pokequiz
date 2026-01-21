import type { Pokemon } from "../types";

interface PokeCardProps {
    pokemon: Pokemon;
    isRevealed?: boolean; // Nouvelle prop pour le mode "Solution"
}

export const PokeCard = ({ pokemon, isRevealed = false }: PokeCardProps) => {
    // Calcul des styles dynamiques selon l'état
    let containerStyle = "bg-slate-900 border-slate-800"; // Par défaut (Caché)
    let idColor = "text-slate-600";

    if (pokemon.found) {
        containerStyle =
            "bg-slate-800 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]"; // Trouvé (Vert)
        idColor = "text-green-400";
    } else if (isRevealed) {
        containerStyle =
            "bg-slate-900 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)] cursor-help group"; // Raté (Rouge)
        idColor = "text-red-900/50";
    }

    return (
        <div
            className={`
        relative flex items-center justify-between 
        h-14 px-3 rounded-md border 
        transition-all duration-200
        ${containerStyle}
      `}
        >
            {/* 1. GAUCHE : ID Pokedex */}
            <span className={`text-xs font-mono font-bold w-8 ${idColor}`}>
                #{pokemon.pokedexId}
            </span>

            {/* 2. MILIEU : Les Sprites des Types (Indices) */}
            <div className="flex flex-col gap-1 justify-center flex-1 mx-2">
                {pokemon.types.map((type, index) => (
                    <img
                        key={index}
                        src={type.image!}
                        alt={type.name}
                        // On réduit un peu l'opacité si pas trouvé pour que ce soit subtil
                        className={`w-8 object-contain scale-120 transition-opacity ${pokemon.found ? "opacity-100" : "opacity-70"}`}
                        title={type.name}
                    />
                ))}
            </div>

            {/* 3. DROITE : Sprite du Pokémon ou Pokéball */}
            <div className="w-10 h-10 flex items-center justify-center p-0.5 ml-1 relative">
                {/* CAS A : POKEMON TROUVÉ */}
                {pokemon.found ? (
                    <img
                        key="found"
                        src={pokemon.sprites.regular}
                        alt={pokemon.name.fr}
                        className="w-full h-full object-contain drop-shadow-lg scale-150 animate-in zoom-in duration-300"
                        loading="lazy"
                    />
                ) : isRevealed ? (
                    // CAS B : ABANDON (Révélation en rouge/gris)
                    <>
                        <img
                            key="revealed"
                            src={pokemon.sprites.regular}
                            alt={pokemon.name.fr}
                            className="w-full h-full object-contain grayscale opacity-70 scale-125"
                            loading="lazy"
                        />
                        {/* Tooltip au survol (visible grâce à la classe 'group' sur le parent) */}
                        <div className="absolute bottom-full mb-2 right-0 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                            {pokemon.name.fr}
                            {/* Flèche du tooltip */}
                            <div className="absolute top-full right-3 border-4 border-transparent border-t-red-600"></div>
                        </div>
                    </>
                ) : (
                    // CAS C : CACHÉ (Pokéball)
                    <img
                        key="hidden"
                        src={"/general/pokeball.png"}
                        alt={"Pokeball"}
                        className="w-4 h-4 object-contain opacity-70"
                        loading="lazy"
                    />
                )}
            </div>
        </div>
    );
};
