type Recipe = {
    id: string;
    title: string;
    description: string;
    servings: number;
    prepTime: string;
    cookTime: string;
    difficulty: string;
    ingredients: Ingredient[];
    instructions: string[];
    tags: string[];
    dateAdded: string;
    dietaryRestrictions: string[]
};

type Ingredient = {
    ingredientId: string;
    amount: string;
    unit: string;
};

type IngredientDetails = {
    id: string;
    name: string;
    category: string;
    nutrition: Nutrition;
    commonAllergens: string[];
    dietary: string[];
};

type Nutrition = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

type RecipeDataResponse = {
    recipe: Recipe[],
    ingredients: IngredientDetails[],
    nutrition: Nutrition
}