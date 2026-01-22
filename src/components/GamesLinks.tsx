import { ExternalLink } from "lucide-react";
import { getPixelSprite } from "../utils/sprites";

export const GamesLinks = () => {
    const games = [
        {
            name: "PokéQuiz",
            url: "#", // ⚠️ Remplace par la vraie URL
            icon: (
                <img
                    src={getPixelSprite(393)}
                    alt="Tiplouf"
                    className="w-8 h-8 object-contain pixelated rendering-pixelated -my-1"
                />
            ),
            color: "from-purple-500 to-pink-500",
            current: true,
        },
        {
            name: "PokéSprite",
            url: "https://pokesprite-game.vercel.app", // Jeu actuel
            icon: (
                <img
                    src={getPixelSprite(54)}
                    alt="Psykokwak"
                    className="w-8 h-8 object-contain pixelated rendering-pixelated -my-1"
                />
            ),
            color: "from-blue-500 to-cyan-500",
            current: false,
        },
    ];

    return (
        <div className="absolute top-4 right-4 z-50 flex flex-col sm:flex-row gap-3">
            {games.map((game) => (
                <a
                    key={game.name}
                    href={game.url}
                    className={`
                        group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
                        ${
                            game.current
                                ? "bg-slate-800/50 border-slate-600 cursor-default"
                                : "bg-slate-900/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-500 hover:scale-105 cursor-pointer backdrop-blur-md"
                        }
                    `}
                >
                    {/* Fond coloré subtil au survol */}
                    {!game.current && (
                        <div
                            className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 bg-linear-to-r ${game.color} transition-opacity`}
                        />
                    )}

                    <span
                        className={`text-slate-300 ${game.current ? "text-white font-bold" : "group-hover:text-white"}`}
                    >
                        {game.icon}
                    </span>

                    <span
                        className={`text-sm font-medium ${game.current ? "text-slate-200" : "text-slate-400 group-hover:text-white"}`}
                    >
                        {game.name}
                    </span>

                    {!game.current && (
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 ml-1" />
                    )}
                </a>
            ))}
        </div>
    );
};
