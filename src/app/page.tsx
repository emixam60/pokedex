"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import Button from "../components/button"; // Assurez-vous que le chemin est correct
import { ModeToggle } from "@/components/toggle-theme";

const PokemonPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="overflow-hidden"> {/* Ajout de cette classe pour éviter le scroll */}
      {/* Conteneur pour l'image et le texte */}
      <div className="relative w-full h-screen overflow-hidden"> {/* Changer h-[90vh] en h-screen */}
        <img 
          src="https://images7.alphacoders.com/117/1174048.jpg" 
          alt="Image d'accueil" 
          className="hidden sm:block w-full h-full objet-cover rounded-2xl"
        />
        {/* Nouvelle image de fond pour petits écrans */}
  <img 
    src="/image/pikachu.jpg" // Remplacez par l'URL de votre nouvelle image
    alt="Image d'accueil pour mobiles" 
    className="w-full h-full object-cover block sm:hidden" // Afficher uniquement sur petits écrans
  />

        {/* Texte superposé à l'image */}
        <div className="absolute top-10 left-8 right-8 xl:right-auto text-left text-white dark:text-black">
          <h1 className="text-4xl font-bold mb-6">Bienvenue dans le Pokédex !</h1>
          <p className="mb-2 text-lg pr-2">Explorez le monde des Pokémon et trouvez vos favoris.</p>

          {/* Bouton pour commencer à explorer */}
          <div className="flex justify-center mt-8">
            <Button
              label="Commencer à explorer"
              onClick={() => router.push('/pokemon')}
              className="mt-2 bg-blue-500 text-white dark:text-black rounded px-4 py-2 border border-blue-700"
            />
          </div>
        </div>

        {/* Texte explicatif sous le bouton, maintenant déplacé en bas à gauche */}
  <div className="absolute bottom-10 left-8 right-8 md:left-8 md:right-auto text-white  text-lg max-w-sm
         bg-black bg-opacity-40 border border-white dark:text-black rounded p-4 ">
     <p>Ce projet POKEDEX est un exercice de développement web sur lequel je travaille pour améliorer mes compétences.
           J'apprends à utiliser <a href="https://reactjs.org/" className="text-blue-300 hover:underline">React</a> et 
           <a href="https://tailwindcss.com/" className="text-blue-300 hover:underline">Tailwind CSS</a> avec une API externe <a href="https://pokeapi.co/"
           className="text-blue-300 hover:underline">PokeAPI</a> pour explorer les fonctionnalités et la présentation du Pokédex.
     </p>
  </div>


        {/* Bouton de changement de thème positionné en haut à droite */}
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default PokemonPage;
