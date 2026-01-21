// src/data/generations.ts

export const GENERATIONS_CONFIG = [
    { id: 1, label: "Gen 1 (Kanto)", region: "Kanto", starters: [1, 4, 7] }, // Bulbizarre, Salamèche, Carapuce
    {
        id: 2,
        label: "Gen 2 (Johto)",
        region: "Johto",
        starters: [152, 155, 158],
    }, // Germignon, Héricendre, Kaiminus
    {
        id: 3,
        label: "Gen 3 (Hoenn)",
        region: "Hoenn",
        starters: [252, 255, 258],
    }, // Arcko, Poussifeu, Gobou
    {
        id: 4,
        label: "Gen 4 (Sinnoh)",
        region: "Sinnoh",
        starters: [387, 390, 393],
    }, // Tortipouss, Ouisticram, Tiplouf
    { id: 5, label: "Gen 5 (Unys)", region: "Unys", starters: [495, 498, 501] }, // Vipélierre, Gruikui, Moustillon
    {
        id: 6,
        label: "Gen 6 (Kalos)",
        region: "Kalos",
        starters: [650, 653, 656],
    }, // Marisson, Feunnec, Grenousse
    {
        id: 7,
        label: "Gen 7 (Alola)",
        region: "Alola",
        starters: [722, 725, 728],
    }, // Brindibou, Flamiaou, Otaquin
    {
        id: 8,
        label: "Gen 8 (Galar)",
        region: "Galar",
        starters: [810, 813, 816],
    }, // Ouistempo, Flambino, Larméléon
    {
        id: 9,
        label: "Gen 9 (Paldea)",
        region: "Paldea",
        starters: [906, 909, 912],
    }, // Poussacha, Chochodile, Coiffeton
];

// Helper pour avoir l'image rapidement
export const getSpriteUrl = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
