import React from 'react';
import Link from 'next/link';
import NutritionIngredientCalculator from '../components/NutritionIngredientCalculator';

export default async function RecipePage({ params }: { params: Promise<{ [key: string]: string }> }) {
    const { id } = await params;
    const response = await fetch(`http://54.90.201.128:8080/api/recipedata/${id}`);
    const recipeDataResponse: RecipeDataResponse = await response.json();
    const recipeData: Recipe[] = recipeDataResponse.recipe;

    // Assumption that cooktime and preptime will have format of "XX minutes"
    const displayTotalTime = (cookTime: string, prepTime: string): string => {
        const extractNumberFromString = (input: string) => {
            const match = input.match(/\d+/);
            return match ? parseInt(match[0], 10) : null;
        }
        const totalTime = extractNumberFromString(cookTime)! + extractNumberFromString(prepTime)!
        return ` ${totalTime} minutes`
    }

    if (recipeData.length) {
        const recipe: Recipe = recipeData[0];
        return (
            <div className="flex justify-center items-center min-h-screen bg-orange-50 p-6">
                <article className="relative bg-white md:max-w-2xl w-full mx-auto md:p-10 p-6 rounded-xl shadow-lg border border-orange-200">
                    <div className="absolute top-3 right-3 flex space-x-2">
                        {recipe.tags.map((tag) => {
                            return (
                                <span key={tag} className="px-4 py-2 text-sm bg-cyan-200 text-green-800 rounded-full border-black">{tag}</span>
                            )
                        })}
                    </div>

                    <Link
                        href="/"
                        className=" absolute top-3 left-3 px-3 py-1 bg-white border border-gray-300 text-gray-600 text-sm rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        ← Home
                    </Link>

                    <div className="font-outfit text-wenge-brown mt-4 pt-5">
                        <h1 className="font-fancy text-4xl md:text-5xl font-bold text-dark-charcoal text-left">
                            {recipe.title}
                        </h1>
                        <p className="mt-4 md:mt-6 text-lg text-gray-700 text-left leading-relaxed">
                            {recipe.description}
                        </p>

                        {/* Preparation Time */}
                        <div className="bg-rose-100 mt-6 p-5 md:p-6 rounded-lg shadow-sm border border-rose-200">
                            <h2 className="text-dark-raspberry text-2xl font-semibold">
                                Preparation Time
                            </h2>
                            <ul className="list-disc mt-3 ml-6 text-lg marker:text-dark-raspberry">
                                <li className="pl-3"><span className="font-semibold">Total:</span>{displayTotalTime(recipe.cookTime, recipe.prepTime)}</li>
                                <li className="mt-2 pl-3"><span className="font-semibold">Prep:</span> {recipe.prepTime} </li>
                                <li className="mt-2 pl-3"><span className="font-semibold">Cook:</span> {recipe.cookTime} </li>
                            </ul>
                        </div>

                        <NutritionIngredientCalculator recipeDataResponse={recipeDataResponse} />

                        {/* Instructions */}
                        <div className="mt-8">
                            <h3 className="font-fancy text-3xl text-nutmeg font-semibold text-left">
                                Instructions
                            </h3>
                            <ol className="list-decimal marker:text-nutmeg mt-4 ml-6 space-y-3 text-lg text-gray-700">
                                {recipe.instructions.map((instruction, index) => (
                                    <li key={index}> {instruction}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </article>
            </div>
        );
    }

    return (
        <div className="text-center">
            <p>No Recipe found :(</p>
            <Link
                href="/"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                ← Home
            </Link>
        </div>
    );
}
