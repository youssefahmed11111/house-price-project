import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    carpet_area_sqft: "",
    floor_num: "",
    bathroom: "",
    balcony: "",
    furnishing: "Semi-Furnished",
    transaction: "Resale",
    ownership: "Freehold",
    facing: "East",
    location: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const predictPrice = async () => {
    setError("");
    setPrediction(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          carpet_area_sqft: Number(form.carpet_area_sqft),
          floor_num: Number(form.floor_num),
          bathroom: Number(form.bathroom),
          balcony: Number(form.balcony)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setPrediction(data.predicted_price);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>House Price Prediction</h1>
        <p>Enter the property details below.</p>

        <input
          name="carpet_area_sqft"
          placeholder="Carpet Area (sq ft)"
          value={form.carpet_area_sqft}
          onChange={handleChange}
        />

        <input
          name="floor_num"
          placeholder="Floor Number"
          value={form.floor_num}
          onChange={handleChange}
        />

        <input
          name="bathroom"
          placeholder="Bathrooms"
          value={form.bathroom}
          onChange={handleChange}
        />

        <input
          name="balcony"
          placeholder="Balconies"
          value={form.balcony}
          onChange={handleChange}
        />

        <select name="furnishing" value={form.furnishing} onChange={handleChange}>
          <option>Semi-Furnished</option>
          <option>Furnished</option>
          <option>Unfurnished</option>
        </select>

        <select name="transaction" value={form.transaction} onChange={handleChange}>
          <option>Resale</option>
          <option>New Property</option>
        </select>

        <select name="ownership" value={form.ownership} onChange={handleChange}>
          <option>Freehold</option>
          <option>Leasehold</option>
        </select>

        <select name="facing" value={form.facing} onChange={handleChange}>
          <option>East</option>
          <option>West</option>
          <option>North</option>
          <option>South</option>
        </select>

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <button onClick={predictPrice}>
          Predict Price
        </button>

        {prediction !== null && (
          <div className="result">
            Predicted Price: {prediction.toLocaleString()}
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;