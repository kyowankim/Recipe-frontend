import RecipesDisplay from "./components/RecipesDisplay";

export default async function Home() {
    const data = await fetch("http://54.90.201.128:8080/api/recipes");
    const allRecipes: Recipe[] = await data.json()
    return (
        <>
            <RecipesDisplay allRecipes={allRecipes} />
        </>
    )
}