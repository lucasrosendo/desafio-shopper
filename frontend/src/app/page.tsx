"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<
    { placeId: string; text: string }[]
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    { placeId: string; text: string }[]
  >([]);

  const apiUrl = "https://places.googleapis.com/v1/places:autocomplete";
  const apiKey = "AIzaSyBksGdBkFTkZMVflOExM4Sdh4qPYW4uTy8";

  const fetchSuggestions = async (
    input: string,
    type: "origin" | "destination"
  ) => {
    if (!input.trim()) return;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();

      const suggestions =
        data?.suggestions?.map((item: any) => ({
          placeId: item.placePrediction.placeId,
          text: item.placePrediction.text.text, // Corrigido para acessar o campo "text" corretamente
        })) || [];

      if (type === "origin") {
        setOriginSuggestions(suggestions);
      } else {
        setDestinationSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions(origin, "origin");
  }, [origin]);

  useEffect(() => {
    fetchSuggestions(destination, "destination");
  }, [destination]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 m-4">
      <main className="flex flex-col items-center sm:items-start p-4">
        <div className="flex flex-col gap-4 p-2">
          <label htmlFor="origin">Origem</label>
          <input
            id="origin"
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Digite a origem"
          />
          <ul className="border rounded-md bg-white shadow-md">
            {originSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setOrigin(suggestion.text);
                  setOriginSuggestions([]);
                }}
              >
                {suggestion.text}
              </li>
            ))}
          </ul>

          <label htmlFor="destination">Destino</label>
          <input
            id="destination"
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Digite o destino"
          />
          <ul className="border rounded-md bg-white shadow-md">
            {destinationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setDestination(suggestion.text);
                  setDestinationSuggestions([]);
                }}
              >
                {suggestion.text}
              </li>
            ))}
          </ul>

          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!origin || !destination}
          >
            Calcular
          </button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center m-6">
        <iframe
          width="500"
          height="350"
          src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyBksGdBkFTkZMVflOExM4Sdh4qPYW4uTy8&origin=place_id:ChIJvS5CUCARFgcRndtzlTaEHPc&destination=place_id:ChIJ--IExB6rOQcRZysfWJNymsk&avoid=highways"
        ></iframe>
      </footer>
    </div>
  );
}
