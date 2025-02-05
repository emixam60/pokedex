import React from "react";

interface PokemonCardProps {
  name: string;
  image: string;
  types: string[];
  className?: string;
  cardColor: string; // Ajout d'une prop pour la couleur de la carte
  id: number;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name, image, types, className, cardColor }) => {
  console.log(types, cardColor);
  return (
    <div
      className={`transform transition-transform hover:scale-110 p-4 rounded-lg shadow-md flex flex-col items-center justify-center ${cardColor} ${className}`}
    >
      <img src={image} alt={name} className="w-24 h-24 mb-2" />
      <h2 className="text-lg font-semibold dark:text-black">{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      <div className="flex space-x-1 mt-1">
        {types.map((type) => (
          <span
            key={type}
            className="text-sm font-medium bg-gray-200 rounded-full px-2 py-1 dark:text-black"
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;
