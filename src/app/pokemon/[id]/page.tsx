"use client";

import { ModeToggle } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import { fetchTranslations } from "@/components/utils/fetch-translations";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Définition des types pour les Pokémon
interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

interface PokemonSpecies {
  flavor_text_entries: FlavorTextEntry[];
}

interface Pokemon {
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
  height: number; // en dm
  weight: number; // en hg
  species: PokemonSpecies;
}

const statTranslations: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Attaque Spéciale",
  "special-defense": "Défense Spéciale",
  speed: "Vitesse",
};

const PokemonDetail: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      if (!id) return; // Attendre que l'ID soit disponible

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des détails du Pokémon."
          );
        }
        const data = await response.json();

        // Récupérer les détails de l'espèce
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        // Obtenir les types, les capacités et le nom du Pokémon en français
        const typesPromises = data.types.map((type: any) =>
          fetchTranslations(type.type.url, "fr")
        );
        const abilitiesPromises = data.abilities.map((ability: any) =>
          fetchTranslations(ability.ability.url, "fr")
        );
        const pokemonNamePromise = fetchTranslations(data.species.url, "fr");

        const [types, abilities, pokemonName] = await Promise.all([
          Promise.all(typesPromises),
          Promise.all(abilitiesPromises),
          pokemonNamePromise,
        ]);

        // Mettre à jour l'état avec les détails du Pokémon et de l'espèce
        setPokemon({
          ...data,
          name: pokemonName,
          types,
          abilities,
          species: speciesData,
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  // Vérification si pokemon n'est pas nul
  if (!pokemon) return <div>Pokemon non disponible.</div>;

  // Vérification pour obtenir la description en français
  const flavorTexts = pokemon.species.flavor_text_entries || [];
  const frenchDescriptionEntry = flavorTexts.find(
    (entry: FlavorTextEntry) => entry.language.name === "fr"
  );

  // Assure-toi qu'on a une entrée en français
  const description = frenchDescriptionEntry
    ? frenchDescriptionEntry.flavor_text
    : "Description non disponible";

  // Conversion de la taille et du poids
  const heightInCm = pokemon.height * 10; // Convertir dm en cm
  const weightInKg = pokemon.weight / 10; // Convertir hg en kg

  return (
    <>
    <div className="bg-[url('/image/sacha2.png')] bg-cover ">
      {/* Barre supérieure avec les boutons */}
      <div className="flex justify-between w-full gap-2 p-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <ModeToggle />
      </div>
  
      {/* Contenu principal */}
      <div className="flex justify-start w-full h-full p-4">
        {/* Div gauche */}
        <div className="">
          {/* Div pour l'image et le nom du Pokémon */}
          <div className=" rounded-lg shadow-lg p-2 w-80 h-60 flex flex-col m-auto items-center justify-center border-2 border-[#fc6969] bg-white dark:bg-black">
            <img
              className="w-40 h-auto transition-all duration-300"
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
            />
            <h1 className="text-2xl font-bold text-[#fc6969] text-center capitalize mt-2">
              {pokemon.name.toUpperCase()}
            </h1>
          </div>
  
          {/* Div pour le reste des informations */}
          <div className="flex flex-col items-center gap-10 mt-8 ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
              {/* Carte pour Types */}
              <div className="bg-white dark:bg-black shadow-2xl rounded-lg hover:scale-105 transition-transform duration-300 border-2 border-[#fc6969]">
                <h2 className="text-xl font-semibold text-[#fc6969] p-2 text-center underline decoration-black dark:decoration-white">
                  Types
                </h2>
                <div className="pl-4 pb-4 sm:text-center md:text-center lg:text-left ">
                  <p className="text-black dark:text-white">
                    {pokemon.types.join(", ")}
                  </p>
                  <p className="text-xl font-semibold underline decoration-black dark:decoration-white text-[#fc6969] p-2 text-center ">
                    Mesures
                  </p>
                  <p className="mt-2 text-black dark:text-white ">
                    Taille: {heightInCm} cm
                  </p>
                  <p className="text-black dark:text-white">
                    Poids: {weightInKg} kg
                  </p>
                </div>
              </div>
  
              {/* Carte pour Statistiques */}
              <div className="bg-white dark:bg-black shadow-2xl rounded-lg hover:scale-105 transition-transform duration-300 border-2 border-[#fc6969]">
                <h2 className="text-xl font-semibold text-[#fc6969] p-2 text-center underline decoration-black dark:decoration-white">
                  Stats
                </h2>
                <ul className="flex flex-col p-4">
                  {pokemon.stats.map((stat: any) => (
                    <li
                      key={stat.stat.name}
                      className="text-black dark:text-white"
                    >
                      {statTranslations[stat.stat.name] || stat.stat.name}:{" "}
                      {stat.base_stat}
                    </li>
                  ))}
                </ul>
              </div>
  
              {/* Carte pour Capacités */}
              <div className="bg-white dark:bg-black shadow-2xl rounded-lg hover:scale-105 transition-transform duration-300 border-2 border-[#fc6969] ">
                <h2 className="text-xl font-semibold text-[#fc6969] p-2 text-center underline decoration-black dark:decoration-white">
                  Capacités
                </h2>
                <p className="text-black dark:text-white p-4 text-pretty">
                  {pokemon.abilities.join(", ")}
                </p>
                <Link href="https://fr.linkedin.com/in/maxime-guilloy-780178315?trk=people-guest_people_search-card">
                  <img
                    src="/image/pokeball.png"
                    alt="pokeball"
                    className="w-24 h-auto m-auto pt-2 opacity-70"
                  />
                </Link>
              </div>
            </div>
  
            {/* Carte pour Description */}
            <div className="bg-white dark:bg-black shadow-2xl rounded-lg pb-4 px-2 w-fit max-w-4xl border-2 border-[#fc6969]">
              <h2 className="text-xl font-semibold text-[#fc6969] text-center underline decoration-black dark:decoration-white p-2">
                Description
              </h2>
              <p className="text-black dark:text-white text-pretty">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  
  );
};
export default PokemonDetail;
