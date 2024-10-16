import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import PokemonCard from "./card";
import { Button } from "./ui/button";
import Link from "next/link";
import { fetchTranslations } from "./utils/fetch-translations";

const typeTranslationMap: Record<string, string> = {
  électrique: "electric",
  plante: "grass",
  feu: "fire",
  eau: "water",
  insecte: "bug",
  normal: "normal",
  poison: "poison",
  fée: "fairy",
  combat: "fighting",
  vol: "flying",
  psy: "psychic",
  roche: "rock",
  sol: "ground",
  acier: "steel",
  spectre: "ghost",
  glace: "ice",
  dragon: "dragon",
  ténèbres: "dark",
};


const pastelTypeColors: Record<string, string> = {
  electric: "bg-yellow-200",
  grass: "bg-green-200",
  fire: "bg-red-200",
  water: "bg-blue-200",
  bug: "bg-green-300",
  normal: "bg-gray-300",
  poison: "bg-purple-200",
  fairy: "bg-pink-200",
  fighting: "bg-orange-200",
  flying: "bg-blue-300",
  psychic: "bg-pink-300",
  rock: "bg-gray-400",
  ground: "bg-amber-200",
  steel: "bg-gray-500",
  ghost: "bg-indigo-200",
  ice: "bg-blue-100",
  dragon: "bg-purple-300",
  dark: "bg-gray-600",
};

const PokemonList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [types, setTypes] = useState<string[]>([]);
  const pokemonsPerPage = 20;

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerPage}&offset=${
            (currentPage - 1) * pokemonsPerPage
          }`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des Pokémon.");
        }
        const data = await response.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const detailsResponse = await fetch(pokemon.url);
            const details = await detailsResponse.json();
            const typesPromises = details.types.map((type: any) =>
              fetchTranslations(type.type.url, "fr")
            );
            const pokemonNamePromise = fetchTranslations(
              details.species.url,
              "fr"
            );
            const [types, pokemonName] = await Promise.all([
              Promise.all(typesPromises),
              pokemonNamePromise,
            ]);
            return {
              id: details.id, // Ajout de l'ID ici pour redirection
              name: pokemonName,
              image: details.sprites.other["official-artwork"].front_default,
              types,
            };
          })
        );
        setPokemons(pokemonDetails);
        setTotalPages(Math.ceil(data.count / pokemonsPerPage));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [currentPage]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des types.");
        }
        const data = await response.json();
        const typesPromises = data.results.map((type: any) =>
          fetchTranslations(type.url, "fr")
        );
        const typeNames = await Promise.all(typesPromises);
        // const typeNames = data.results.map((type: any) => type.name);
        setTypes(typeNames);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchTypes();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType
      ? pokemon.types.includes(selectedType)
      : true;
    return matchesSearch && matchesType;
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="">
      <div className="flex flex-col items-center mb-4">
        <div className="flex justify-between">
      <img src="/image/pokeball.png" alt="pokeball" className="w-24 h-auto m-auto pt-6"/>
        <img
          src="/image/pokemonlogo.png"
          alt="logo-pokemon"
          className="w-1/2 mb-2"
        />
        <img src="/image/pokeball.png" alt="pokeball" className="w-24 h-auto m-auto pt-6"/>
        </div>
      </div>
      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="Cherchez un Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=""
        />
        {/* Bouton filtrage */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="secondary" size="default">
              Filtrer par Type
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-60 overflow-y-auto">
            <DropdownMenuItem onClick={() => setSelectedType(null)}>
              Tous les types
            </DropdownMenuItem>
            {types.map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => setSelectedType(type)}
              >
                {
                  type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="border-2 border-gray-500 p-2 rounded hover:bg-gray-200"
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="border-2 border-gray-500 p-2 rounded hover:bg-gray-200"
        >
          Suivant
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredPokemons.map((pokemon) => (
          <Link href={`/pokemon/${pokemon.id}`}>
            <PokemonCard
              key={pokemon.id} // Utilisation de l'ID pour la clé
              id={pokemon.id} // Passer l'ID pour redirection
              name={pokemon.name}
              image={pokemon.image}
              types={pokemon.types.map(
                (type: string) =>
                  type.charAt(0).toUpperCase() + type.slice(1)
              )}
              className="h-fit w-auto"
              cardColor={
                pokemon.types[0] 
                  ? pastelTypeColors[typeTranslationMap[pokemon.types[0].toLowerCase()]] 
                  : "bg-gray-300"  // Couleur par défaut si aucun type
              }            />
          </Link>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="border-2 border-gray-500 p-2 rounded hover:bg-gray-200"
        >
          Précédent
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="border-2 border-gray-500 p-2 rounded hover:bg-gray-200"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
