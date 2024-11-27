/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [idOrigin, setIdOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [idDestination, setIdDestination] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<
    { placeId: string; text: string }[]
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    { placeId: string; text: string }[]
  >([]);
  const [showMap, setShowMap] = useState(false);
  const [estimate, setEstimate] = useState<{ distance?: string; duration?: string }>({});
  const [drivers, setDrivers] = useState([]);

  const handleShowMap = () => {
    console.log(estimate);
    console.log(drivers);
    fetchEstimate();
    setShowMap(true);
  }

  const apiUrl = "https://places.googleapis.com/v1/places:autocomplete";
  const apiKey = "AIzaSyBksGdBkFTkZMVflOExM4Sdh4qPYW4uTy8";
  const IframeUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=place_id:${idOrigin}&destination=place_id:${idDestination}&avoid=highways`;

  const fetchEstimate = async () => {
    const response = await fetch('http://localhost:4000/ride/estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_id: customerId,
        origin: idOrigin,
        destination: idDestination
      })
    })
    const data = await response.json();
    setDrivers(data.response.options[0]);
    setEstimate(data.response);
  }

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
          <label htmlFor="origin">ID Usuário</label>
          <input
            id="customer_id"
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Digite o ID do Usuário"
          />
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
                  setIdOrigin(suggestion.placeId);
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
                  setIdDestination(suggestion.placeId);
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
            onClick={() => { handleShowMap() }}
          >
            Calcular
          </button>
        </div>
      </main>
      {showMap && (
        <div className="row-start-3 flex flex-col gap-6 flex-wrap items-center justify-center m-6 border rounded-md bg-white shadow-md p-2 font-medium">
          <h2 className="flex gap-4 border rounded-md bg-white shadow-md p-2 font-medium m-2">Opções de viagem</h2>
          <div className="flex gap-4 border rounded-md bg-white shadow-md m-4 font-medium">

            <iframe
              width="400"
              height="350"
              src={IframeUrl}
            ></iframe>
          </div>

          <div className="flex flex-col items-center gap-4 border rounded-md bg-white shadow-md p-2 font-medium">
            <h2 className="font-semibold">Estimativa de viagem</h2>
            <div className="flex gap-2">
              <span><strong>Distância:</strong> {estimate.distance}</span>
              <span><strong>Tempo:</strong> {estimate.duration}</span>
            </div>
          </div>

          <div className="flex flex-col text-justify items-center">
            <h2 className="text-lg font-medium text-gray-900">Motoristas disponíveis</h2>
            <ul>
              {drivers.map((driver: any, index: number) => (
                <li key={index} className="flex flex-col mt-1 max-w-2xl text-sm text-gray-500 p-2 m-2 border rounded-md bg-white shadow-md">
                  <span><strong>Nome:</strong> {driver.name}</span>
                  <span><strong>Descrição:</strong> {driver.description}</span>
                  <span><strong>Veículo:</strong> {driver.vehicle}</span>
                  <span><strong>Avaliação:</strong> {driver.review.rating}</span>
                  <span><strong>Preço:</strong> {driver.value} R$ </span>
                  <button className="bg-blue-500 text-white font-semibold py-2 px-4 m-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed ">Escolher</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
