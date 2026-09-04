import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

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

            <input type="text" placeholder="Food name" />
            <input type="number" placeholder="Quantity" />
            <input type="text" placeholder="Location" />
            <input type="date" />

            <button>Submit Donation</button>

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
              {foodItems.map((food, index) => (
                <div className="food-card" key={index}>
                  <h2>{food.name}</h2>

                  <p>📦 Quantity: {food.quantity}</p>

                  <p>📍 Location: {food.location}</p>

                  <p>📅 Available: {food.date}</p>

                  <button>Request Food</button>
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