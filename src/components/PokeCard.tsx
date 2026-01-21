import type { Pokemon } from "../types";

interface PokeCardProps {
    pokemon: Pokemon;
}

export const PokeCard = ({ pokemon }: PokeCardProps) => {
    return (
        <div
            className={`
        flex items-center justify-between 
        h-14 px-3 rounded-md border 
        transition-colors duration-200
        ${
            pokemon.found
                ? "bg-slate-800 border-slate-600" // Style si trouvé
                : "bg-slate-900 border-slate-800" // Style si pas trouvé
        }
      `}
        >
            {/* 1. GAUCHE : ID Pokedex (Police Mono pour l'alignement) */}
            <span
                className={`text-xs font-mono font-bold w-8 ${pokemon.found ? "text-white" : "text-slate-600"}`}
            >
                #{pokemon.pokedexId}
            </span>

            {/* 2. MILIEU : Les Sprites des Types (Indice) */}
            <div className="flex flex-col gap-1 justify-center flex-1 mx-2">
                {/* On affiche les types seulement si le Pokémon est trouvé OU si on veut donner un indice (optionnel) */}
                {pokemon.types.map((type, index) => (
                    <img
                        key={index}
                        src={type.image!}
                        alt={type.name}
                        className="w-8 object-contain opacity-80 scale-120"
                        title={type.name} // Tooltip au survol
                    />
                ))}
            </div>

            {/* 3. DROITE : Sprite du Pokémon (Caché/Révélé) */}
            <div className="w-10 h-10 flex items-center justify-center p-0.5 ml-1">
                {pokemon.found ? (
                    <img
                        src={pokemon.sprites.regular}
                        alt={pokemon.name.fr}
                        className="w-full h-full object-contain drop-shadow-lg scale-150"
                        loading="lazy" // Très important pour la perf !
                    />
                ) : (
                    // Optionnel : Une petite pokéball sombre ou rien du tout quand pas trouvé
                    <img
                        src={"general/pokeball.png"}
                        alt={"Pokeball"}
                        className="w-3 h-3s object-contain drop-shadow-lg scale-150"
                        loading="lazy" // Très important pour la perf !
                    />
                )}
            </div>
        </div>
    );
};
