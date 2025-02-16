import { useState, useEffect } from "react";

/** 
 * Custom Hook to utilize local storage
 * Input: Key: key of the local storage value
 *        Value: Array of strings you want to store
 * 
 * Output: StoredArray: The stored array associated with the key within local storage
 *         setValue: Allows you to directly set StoredArray to any array value
 *         addItem: Add a item to the Stored Array
 *         removeItem: Removes the item given, within the stored array
 * **/

function useLocalStorageArray(key: string, initialValue: string[]) {
    const [storedArray, setStoredArray] = useState<string[] | null>(null);

    // Ensures that this function only runs on the client side to prevent hydration error 
    useEffect(() => {
        if (typeof window !== "undefined") {
            const item = localStorage.getItem(key);
            const parsedItem = item ? JSON.parse(item) : initialValue;

            // Only update state if the localStorage value has changed
            if (!storedArray || JSON.stringify(parsedItem) !== JSON.stringify(storedArray)) {
                setStoredArray(parsedItem);
            }
        }
    }, [key, initialValue]);

    const setValue = (value: string[]) => {
        setStoredArray(value);
        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    const addItem = (item: string) => {
        if (storedArray && !storedArray.includes(item)) {
            setValue([...storedArray, item]);
        }
    };

    const removeItem = (item: string) => {
        if (storedArray) {
            setValue(storedArray.filter((i) => i !== item));
        }
    };

    // If state is not set yet, return an empty array
    return [storedArray ?? [], setValue, addItem, removeItem] as const;
}

export default useLocalStorageArray;
