import { Leaderboard } from "./Leaderboard";
import { Helmet } from "react-helmet-async";

interface HomeProps {
    onStart: () => void;
}

export const Home = ({ onStart }: HomeProps) => {
    return (
        <>
            <Helmet>
                <title>
                    PokéQuiz - Le Blind Test Pokémon Ultime (Gen 1 à 9)
                </title>
                <meta
                    name="description"
                    content="Testez vos connaissances sur les 1025 Pokémon ! Un quiz rapide, gratuit et sans inscription. Classement mondial et mode speedrun."
                />
                <link rel="canonical" href="https://ton-site.vercel.app/" />
            </Helmet>
            <div className="min-h-screen flex flex-col items-center py-12 px-4 animate-in fade-in duration-700">
                {/* Titre et Logo */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-blue-400 to-cyan-300 drop-shadow-lg tracking-tight">
                        PokéQuiz
                    </h1>
                    <p className="text-slate-400 text-xl max-w-lg mx-auto">
                        Testez vos connaissances et attrapez-les tous le plus
                        rapidement possible !
                    </p>
                </div>

                {/* Bouton d'action principal */}
                <button
                    onClick={onStart}
                    className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-bold rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_35px_rgba(37,99,235,0.7)] transition-all transform hover:-translate-y-1 active:scale-95 mb-6"
                >
                    <span className="flex items-center gap-3 cursor-pointer">
                        LANCER LA PARTIE
                        <span className="group-hover:translate-x-1 transition-transform">
                            →
                        </span>
                    </span>
                </button>

                {/* Section Records */}
                <div className="w-full">
                    <Leaderboard />
                </div>
            </div>
        </>
    );
};
