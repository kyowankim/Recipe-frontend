"use client";
import React, { useState, useEffect } from "react";
import useLocalStorageArray from "../hooks/localStorageHook";
import { useRouter } from "next/navigation";

export default function ShoppingListPage() {
    const [shoppingList] = useLocalStorageArray("shopping", []);
    const [data, setData] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();


    //Fetching ingredients data for all recipe Ids in the shoppingList
    //With more time I would have liked to implement React Query to reduce boilerplate code and 
    //have a better state management, as well as introduced caching 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = "http://localhost:8080/api/shoppinglist";
                const response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify({ shoppingList }),
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error("There was an error fetching the shopping list ingredients");
                }

                const responseData = await response.json();
                setData(responseData.data);
            } catch (err: any) {
                setIsError(true);
                setError(err.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        if (shoppingList.length > 0) {
            fetchData();
        }
    }, [shoppingList]);

    if (isLoading) return <div className="text-center text-gray-500 mt-10">Loading ingredients...</div>;
    if (isError) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-4">
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 transition duration-200"
                >
                    Go Back To Home
                </button>
            </div>

            {/* Shopping List */}
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Shopping List</h2>

                {data.length === 0 ? (
                    <p className="text-gray-500 text-center">Your shopping list is empty.</p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                        {data.map((ingredient, index) => (
                            <li key={index} className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm text-center">
                                {ingredient}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
