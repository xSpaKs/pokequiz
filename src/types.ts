// src/types.ts

export interface Pokemon {
    pokedexId: number;
    generation: number;
    category: string;
    name: {
        fr: string;
        en: string;
    };
    // On a besoin de l'objet sprites (même si on le modifie nous-même)
    sprites: {
        regular: string;
    };
    // Tableau des types (avec l'image qu'on a générée nous-même)
    types: Array<{
        name: string;
        image: string | null; // Peut être null si on ne trouve pas l'image du type
    }>;
    // L'état du jeu : est-ce qu'on l'a trouvé ?
    found: boolean;
}
