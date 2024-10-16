"use client";

import React from "react";

import { ModeToggle } from "@/components/toggle-theme";
import { useRouter } from "next/navigation";
import PokemonList from "@/components/pokemonlist";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const PokemonPage: React.FC = () => {
  const router = useRouter(); // Initialiser le router

  const handleExploreClick = () => {
    router.push("/pokemon"); // Rediriger vers la page des Pokémon
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex justify-between w-full">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <ModeToggle />
      </div>
      <PokemonList />
    </div>
  );
};

export default PokemonPage;
