import RecipesDisplay from "./components/RecipesDisplay";

export default async function Home() {
    const data = await fetch(process.env.NEXT_PUBLIC_DOMAIN + "/api/recipes");
    const allRecipes: Recipe[] = await data.json()
    return (
        <>
            <RecipesDisplay allRecipes={allRecipes} />
        </>
    )
}