"use client"
import React, { useState } from 'react'

export default function NutritionIngredientCalculator({ recipeDataResponse }: { recipeDataResponse: RecipeDataResponse }) {
    const recipeData: Recipe = recipeDataResponse.recipe[0]
    const nutritionData: Nutrition = recipeDataResponse.nutrition;
    const [servings, setServings] = useState<number>(recipeData.servings);

    const ratio = servings / recipeData.servings;

    //Handle the Input values of the "Servings" to ensure only positive integers are allowed
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.valueAsNumber;

        if (!isNaN(inputValue) && inputValue > 0) {
            setServings(inputValue);
        } else if (event.target.value === '') {
            setServings(recipeData.servings);
        }
    };

    //Function to display ingredient information in the format "3 cups tomato"
    const displayIngredient = (ingredient: Ingredient) => {
        const ingredientAmount = (stringToNumber(ingredient.amount) * ratio).toFixed(2);
        const ingredientName = ingredient.ingredientId.replace(/_/g, ' ');
        return `${ingredientAmount} ${ingredient.unit} ${ingredientName}`
    };

    //Convert string to Number, handles fraction cases
    function stringToNumber(str: string): number | typeof NaN {
        try {
            const num = eval(str);
            if (typeof num === 'number' && !isNaN(num) && isFinite(num)) {
                return num;
            }
            return NaN;
        } catch (error) {
            return NaN;
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4">
            <div className="w-full h-1 bg-orange-300 mx-auto mt-8 rounded-full"></div>

            {/* Nutrition Header & Servings Input (Always in a row) */}
            <div className="mt-8">
                <div className="flex flex-row justify-between items-center flex-wrap gap-4">
                    <h3 className="font-fancy text-2xl md:text-3xl text-nutmeg font-semibold">
                        Nutrition
                    </h3>
                    <div className="flex flex-row items-center gap-2">
                        <h5 className="font-fancy text-xl text-nutmeg font-semibold">
                            Servings
                        </h5>
                        <input
                            type="number"
                            id="number-input"
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-24 p-2.5"
                            defaultValue={servings}
                            onChange={handleChange}
                            min={1}
                            required
                        />
                    </div>
                </div>
                <p className="mt-4 text-base md:text-lg text-gray-700">
                    Nutritional values per serving (without additional fillings).
                </p>

                {/* Nutrition Data */}
                <div className="bg-orange-100 p-4 mt-4 rounded-lg shadow-sm border border-orange-200">
                    {[
                        { label: "Calories", value: nutritionData.calories },
                        { label: "Carbs", value: nutritionData.carbs, unit: "g" },
                        { label: "Protein", value: nutritionData.protein, unit: "g" },
                        { label: "Fat", value: nutritionData.fat, unit: "g" }
                    ].map((item, index) => (
                        <div key={index} className={`flex justify-between py-2 text-base md:text-lg ${index !== 0 ? 'border-t border-orange-300' : ''}`}>
                            <span>{item.label}</span>
                            <span className="font-bold text-nutmeg">{(item.value * ratio).toFixed(2)} {item.unit || ''}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ingredients Section */}
            <div className="mt-8">
                <h3 className="font-fancy text-2xl md:text-3xl text-nutmeg font-semibold">
                    Ingredients
                </h3>
                <ul className="list-disc marker:text-nutmeg mt-4 ml-4 md:ml-6 text-base md:text-lg text-gray-700">
                    {recipeData.ingredients.map(ingredient => (
                        <li key={ingredient.ingredientId} className="pl-2 md:pl-4 mt-2">{displayIngredient(ingredient)}</li>
                    ))}
                </ul>
            </div>

            <div className="w-full h-1 bg-orange-300 mx-auto mt-8 rounded-full"></div>
        </div>
    );
}
