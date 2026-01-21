// src/utils/sprites.ts

// 1. SPRITE DU POKÉMON (Pixel Art - Gen 4 style)
export const getPixelSprite = (pokedexId: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexId}.png`;
};

// 2. SPRITES DES TYPES (Style étiquette rectangulaire)

// Mapping: Nom Français -> ID interne du type (utilisé dans les fichiers de sprites)
const TYPE_MAPPING: Record<string, number> = {
    Normal: 1,
    Combat: 2,
    Vol: 3,
    Poison: 4,
    Sol: 5,
    Roche: 6,
    Insecte: 7,
    Spectre: 8,
    Acier: 9,
    Feu: 10,
    Eau: 11,
    Plante: 12,
    Électrik: 13,
    Electrik: 13, // Sécurité pour l'orthographe
    Psy: 14,
    Glace: 15,
    Dragon: 16,
    Ténèbres: 17,
    Fée: 18,
};

export const getTypeSprite = (frenchName: string) => {
    if (!frenchName) return null;

    // On s'assure que la première lettre est majuscule et le reste minuscule
    // Ex: "feu" -> "Feu", "ÉLECTRIK" -> "Électrik"
    const cleanName =
        frenchName.charAt(0).toUpperCase() + frenchName.slice(1).toLowerCase();

    const typeId = TYPE_MAPPING[cleanName];

    if (!typeId) return null;

    // Cas particulier : Le type FÉE (18)
    // Il n'existe pas dans les dossiers "Gen 3". On utilise le style "Gen 8 BDSP" qui imite le rétro.
    if (typeId === 18) {
        return `types/fairy_custom.png`;
    }

    // Pour tous les autres : Style "Emerald" (GBA) très lisible
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-iii/emerald/${typeId}.png`;
};
