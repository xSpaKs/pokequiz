import { supabase } from "../lib/supabase";

export const saveScore = async (
    username: string,
    timeMs: number,
    gen: number,
) => {
    const { error } = await supabase
        .from("scores")
        .insert([{ username: username, time_ms: timeMs, generation: gen }]);

    if (error) console.error("Erreur save:", error);
};

export const getTopScores = async (gen: number) => {
    const { data, error } = await supabase
        .from("pokequiz-scores")
        .select("*")
        .eq("generation", gen) // On filtre par génération
        .order("time_ms", { ascending: true }) // Le plus petit temps en premier
        .limit(10); // Top 10 seulement

    if (error) {
        console.error("Erreur fetch:", error);
        return [];
    }
    return data;
};
