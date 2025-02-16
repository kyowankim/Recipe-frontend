"use client";
import React, { useState } from 'react'
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import FilterSortingHeader from './FilterSortingHeader';
import Link from 'next/link';
import useLocalStorageArray from '@/app/hooks/localStorageHook';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function RecipesDisplay({ allRecipes }: { allRecipes: Recipe[] }) {
    const [recipes, setRecipes] = useState(allRecipes);

    const [shoppingList, setShoppingList, addToShoppingList, removeFromShoppingList] = useLocalStorageArray("shopping", []);

    const [favorites, setFavorites, addFavorites, removeFavorites] = useLocalStorageArray("favorites", []);

    const handleShoppingClick = (recipeId: string) => {
        if (shoppingList.includes(recipeId)) {
            removeFromShoppingList(recipeId)
        } else {
            addToShoppingList(recipeId)
        }
    }

    const handleFavoriteClick = (recipeId: string) => {
        if (favorites.includes(recipeId)) {
            removeFavorites(recipeId)
        } else {
            addFavorites(recipeId)
        }
    }

    const router = useRouter();

    return (
        <>
            {/* Header component */}
            <div className="flex flex-row justify-between p-2">
                <FilterSortingHeader recipes={recipes} setRecipes={setRecipes} />
                <Button variant="outline"
                    onClick={() => router.push("/shoppingList")}
                >
                    Generate Shopping List: {shoppingList.length} Recipes
                </Button>
            </div>

            <div className="bg-orange-50 shadow-sm border border-rose-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
                {recipes.map((recipe: Recipe) => (
                    <div
                        className="max-w-sm p-5 bg-white rounded-lg shadow-sm border border-rose-200 hover:shadow-md transition-shadow duration-300"
                        key={recipe.id}
                    >
                        <div className="flex flex-row justify-between">
                            <h5 className="text-2xl font-semibold text-gray-900">{recipe.title}</h5>
                            <button
                                onClick={(e) => handleFavoriteClick(recipe.id)}
                                className='flex justify-start align-start'
                            >
                                <FaHeart size={20}
                                    className={`${favorites.includes(recipe.id) ? "text-red-400" : "text-gray-400"}`}
                                />
                            </button>
                        </div>


                        <p className="mt-3 text-gray-600 text-sm">{recipe.description}</p>
                        <div className="mt-4 border border-black-200 rounded-md p-2">
                            <p className="text-gray-600 text-sm">Serves: {recipe.servings} people</p>
                            <p className="text-gray-600 text-sm">Preptime: {recipe.prepTime}</p>
                            <p className="text-gray-600 text-sm">Cooktime: {recipe.cookTime}</p>
                        </div>
                        <div className="flex flex-row justify-between align-centers mt-4">
                            <Link
                                href={`/recipe/${recipe.id}`}
                                className="inline-flex items-center align-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                More Details
                                <svg
                                    className="rtl:rotate-180 w-4 h-4 ms-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 5h12m0 0L9 1m4 4L9 9"
                                    />
                                </svg>
                            </Link>
                            <button
                                onClick={(e) => handleShoppingClick(recipe.id)}
                            >
                                <MdOutlineShoppingCart size={30}
                                    className={`${shoppingList.includes(recipe.id) ? "text-cyan-400" : "text-gray-400"}`}
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

