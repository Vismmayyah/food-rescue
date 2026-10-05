import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
const [donations, setDonations] = useState([]);
const [editingFoodId, setEditingFoodId] = useState(null);

useEffect(() => {
  fetch("http://localhost:8080/api/donations")
    .then((response) => response.json())
    .then((data) => {
      setDonations(data);
    })
    .catch((error) => {
      console.error("Error fetching donations:", error);
    });
}, []);

  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [preparationDate, setPreparationDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

const submitDonation = async () => {
  try {
    const formData = new URLSearchParams();

    formData.append("foodName", foodName);
    formData.append("foodType", foodType);
    formData.append("quantity", quantity);
    formData.append("location", location);
    formData.append("preparationDate", preparationDate);
    formData.append("expiryDate", expiryDate);

    const response = await fetch(
      "http://localhost:8080/api/donations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      setFoodName("");
      setFoodType("");
      setQuantity("");
      setLocation("");
      setPreparationDate("");
      setExpiryDate("");

      // Refresh donation list
      const updatedResponse = await fetch(
        "http://localhost:8080/api/donations"
      );
      const updatedData = await updatedResponse.json();
      setDonations(updatedData);

    } else {
      alert(result.message);
    }

  } catch (error) {
    console.error(error);
    alert("Could not connect to the Java server.");
  }
};

const deleteDonation = async (foodId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/donations?id=${foodId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      setDonations((prev) =>
        prev.filter((food) => food.foodId !== foodId)
      );
    } else {
      alert(result.message);
    }

  } catch (error) {
    console.error(error);
    alert("Could not connect to the Java server.");
  }
};
const updateDonation = async () => {
  try {
    const formData = new URLSearchParams();

    formData.append("foodName", foodName);
    formData.append("foodType", foodType);
    formData.append("quantity", quantity);
    formData.append("location", location);
    formData.append("preparationDate", preparationDate);
    formData.append("expiryDate", expiryDate);

    const response = await fetch(
      `http://localhost:8080/api/donations?id=${editingFoodId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      const updatedResponse = await fetch(
        "http://localhost:8080/api/donations"
      );

      const updatedData = await updatedResponse.json();
      setDonations(updatedData);

      setEditingFoodId(null);
      setFoodName("");
      setFoodType("");
      setQuantity("");
      setLocation("");
      setPreparationDate("");
      setExpiryDate("");

      setPage("find");
    } else {
      alert(result.message);
    }

  } catch (error) {
    console.error(error);
    alert("Could not connect to the Java server.");
  }
};

  const foodItems = [
    {
      name: "Vegetable Rice",
      quantity: "10 portions",
      location: "Kochi",
      date: "Today",
    },
    {
      name: "Chapati & Curry",
      quantity: "15 portions",
      location: "Ernakulam",
      date: "Today",
    },
    {
      name: "Bread & Fruits",
      quantity: "8 packets",
      location: "Kakkanad",
      date: "Tomorrow",
    },
  ];

  return (
    <div>
      {/* Navigation */}
      <nav>
        <h2>🍱 Food Rescue</h2>

        <div>
          <button onClick={() => setPage("home")}>Home</button>

          <button onClick={() => setPage("donate")}>
            Donate Food
          </button>

          <button onClick={() => setPage("find")}>
            Find Food
          </button>

          <button>Login</button>
        </div>
      </nav>

      {/* HOME */}
      {page === "home" && (
        <>
          <main>
            <h1>
              Rescue Food.
              <br />
              Reduce Waste.
            </h1>

            <p>
              Connect surplus food with people who need it.
              Together, we can reduce food waste and help our community.
            </p>

            <div>
              <button onClick={() => setPage("donate")}>
                Donate Food
              </button>

              <button onClick={() => setPage("find")}>
                Find Food
              </button>
            </div>
          </main>

          <section>
            <h2>How Food Rescue Works</h2>

            <div>
              <h3>🍲 1. Donate</h3>
              <p>Share your surplus food with people in need.</p>
            </div>

            <div>
              <h3>🔍 2. Find</h3>
              <p>Find available food donations near you.</p>
            </div>

            <div>
              <h3>❤️ 3. Share</h3>
              <p>Help reduce food waste and support your community.</p>
            </div>
          </section>
        </>
      )}

      {/* DONATE */}
      {page === "donate" && (
        <main>
          <div className="form-container">
            <h1>Donate Food 🍲</h1>

            <p>Fill in the details of your food donation.</p>

            <input
  type="text"
  placeholder="Food name"
  value={foodName}
  onChange={(e) => setFoodName(e.target.value)}
/>

<select
  value={foodType}
  onChange={(e) => setFoodType(e.target.value)}
>
  <option value="">Select Food Type</option>
  <option value="Vegetarian">Vegetarian</option>
  <option value="Non-Vegetarian">Non-Vegetarian</option>
</select>

<input
  type="number"
  placeholder="Quantity"
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
/>

<input
  type="text"
  placeholder="Location"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
/>

<label>Preparation Date</label>
<input
  type="date"
  value={preparationDate}
  onChange={(e) => setPreparationDate(e.target.value)}
/>

<label>Expiry Date & Time</label>
<input
  type="datetime-local"
  value={expiryDate}
  onChange={(e) => setExpiryDate(e.target.value)}
/>

            <button
  onClick={editingFoodId ? updateDonation : submitDonation}
>
  {editingFoodId ? "Update Donation" : "Submit Donation"}
</button>

            <button onClick={() => setPage("home")}>
              Back to Home
            </button>
          </div>
        </main>
      )}

      {/* FIND FOOD */}
      {page === "find" && (
        <main>
          <div className="food-page">
            <h1>Available Food 🍱</h1>

            <p>Find food donations available near you.</p>

            <div className="food-list">
              {donations.map((food, index) => (
                <div className="food-card" key={index}>
                  <h2>{food.foodName}</h2>

                  <p>📦 Quantity: {food.quantity}</p>

                  <p>📍 Location: {food.location}</p>

                  <p>📅 Available: {food.preparationDate}</p>

                  <button>Request Food</button>
<button
  onClick={() => {
    setEditingFoodId(food.foodId);
    setFoodName(food.foodName);
    setFoodType(food.foodType);
    setQuantity(food.quantity);
    setLocation(food.location);
    setPreparationDate(food.preparationDate || "");
    setExpiryDate(food.expiryDate || "");
    setPage("donate");
  }}
>
  Edit Donation
</button>
<button onClick={() => deleteDonation(food.foodId)}>
  Delete Donation
</button>
                </div>
              ))}
            </div>

            <button onClick={() => setPage("home")}>
              Back to Home
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;