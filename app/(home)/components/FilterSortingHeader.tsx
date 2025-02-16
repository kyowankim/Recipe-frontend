"use client"
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useLocalStorageArray from '@/app/hooks/localStorageHook';


export default function FilterSortingHeader({ recipes, setRecipes }: SearchFilterProps) {
    const [allRecipes, setAllRecipes] = useState<Recipe[]>(recipes)
    const [searchValue, setSearchValue] = useState("");
    const [filterCategory, setFilterCategory] = useState(FilterCategory.RECIPE_NAME);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [favorites, setFavorites, addFavorites, removeFavorites] = useLocalStorageArray("favorites", []);


    //Function to handle the filtering 
    const handleFilter = () => {
        const filteredRecipes = recipes.filter(recipe => {
            switch (filterCategory) {
                case FilterCategory.RECIPE_NAME:
                    return recipe.title.toLowerCase() === searchValue.toLowerCase()
                case FilterCategory.INGREDIENTS:
                    //replacing empty spaces in searchValue with underscore
                    const searchValueWithUnderscore = searchValue.replace(/\s+/g, "_").toLowerCase();
                    return recipe.ingredients.some(ingredient => {
                        return ingredient.ingredientId === searchValueWithUnderscore
                    })
                case FilterCategory.TAGS:
                    return recipe.tags.includes(searchValue.toLowerCase())
                case FilterCategory.DIETARY_RESTRICTIONS:
                    return recipe.dietaryRestrictions.includes(searchValue.toLowerCase())
            }
        })
        setRecipes(filteredRecipes);
    }

    //Handle showing favorites
    const showFavorites = () => {
        const favoritedRecipes = recipes.filter(recipe => {
            return favorites.includes(recipe.id)
        })
        setRecipes(favoritedRecipes);
    }

    //Helper function to obtain integer value from a string
    function getNumberFromString(value: string) {
        const match = value.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    //Function to handle the sorting of the recipes
    const handleSort = (sortingValue: Sort) => {
        console.log(sortingValue)
        const sortedRecipes = recipes.sort((a: Recipe, b: Recipe): number => {
            const difficultyOrder: { [key: string]: number } = { "easy": 1, "medium": 2, "hard": 3 };
            switch (sortingValue) {
                case Sort.MOST_DIFFICULT:
                    return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
                case Sort.LEAST_DIFFICULT:
                    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                case Sort.LONGEST_PREP:
                    return getNumberFromString(b.prepTime) - getNumberFromString(a.prepTime);
                case Sort.SHORTEST_PREP:
                    return getNumberFromString(a.prepTime) - getNumberFromString(b.prepTime);
                case Sort.LONGEST_COOK:
                    return getNumberFromString(b.cookTime) - getNumberFromString(a.cookTime);
                case Sort.SHORTEST_COOK:
                    return getNumberFromString(a.cookTime) - getNumberFromString(b.cookTime);
                default:
                    return 0
            }
        })
        setRecipes([...sortedRecipes]);
    };

    return (
        <div className="flex">
            {/* Favorites Button */}
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={showFavorites}
            >
                Favorites
            </button>

            {/* Reset Button */}
            <button className="ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={() => setRecipes(allRecipes)}
            >
                Reset
            </button>

            {/* SearchFilter Category Dropdown */}
            <div className="ml-4 relative">
                <button
                    id="dropdown-button"
                    data-dropdown-toggle="dropdown"
                    className="shrink-0 w-35 z-10 inline-flex justify-between items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown visibility on button click
                >
                    {filterCategory}
                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>
                <div
                    id="dropdown"
                    className={`absolute z-20 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 ${isDropdownOpen ? '' : 'hidden'}`}
                    style={{ top: '100%', left: 0 }} // Positioning below the button
                >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                        {Object.values(FilterCategory).map((option) => {
                            return (
                                <li key={option}>
                                    <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={() => {
                                            setFilterCategory(option)
                                            setIsDropdownOpen((prev) => !prev)
                                        }}
                                    >
                                        {option}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative w-64">
                <input
                    type="search"
                    id="search-dropdown"
                    className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                    placeholder="Search"
                    required
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleFilter() }}
                />
                <button
                    className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleFilter}
                >
                    <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </button>
            </div>

            {/* Sort By Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger className="ml-5 p-2 bg-sky-200 rounded-md text-sm text-gray-900">Sort By</DropdownMenuTrigger>
                <DropdownMenuContent>
                    {Object.values(Sort).map((sortingValue, index) => {
                        return (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => { handleSort(sortingValue) }}
                            >{sortingValue}</DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

enum Sort {
    MOST_DIFFICULT = "Most Difficult",
    LEAST_DIFFICULT = "Least Difficult",
    SHORTEST_PREP = "Shortest Prep Time",
    LONGEST_PREP = "Longest Prep Time",
    SHORTEST_COOK = "Shortest Cook Time",
    LONGEST_COOK = "Longest Cook Time"
};

enum FilterCategory {
    RECIPE_NAME = "Recipe Name",
    TAGS = "Tags",
    INGREDIENTS = "Ingredients",
    DIETARY_RESTRICTIONS = "Dietary Restrictions"
};

type SearchFilterProps = {
    recipes: Recipe[];
    setRecipes: Dispatch<SetStateAction<Recipe[]>>;
};

