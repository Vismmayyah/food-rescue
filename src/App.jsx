import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/donations";

function App() {
  const [page, setPage] = useState("home");

  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [popup, setPopup] = useState({
  show: false,
  title: "",
  message: ""
});
const showPopup = (title, message) => {
  setPopup({
    show: true,
    title: title,
    message: message
  });
};
  const [quantityPopup, setQuantityPopup] = useState({
  show: false,
  value: "",
  food: null
});

const closePopup = () => {
  setPopup({
    show: false,
    title: "",
    message: ""
  });
};
const openQuantityPopup = (food) => {
  setQuantityPopup({
    show: true,
    value: "",
     food: food

  });
};
const submitFoodRequest = async (food, quantity) => {
  try {
    const formData = new URLSearchParams();

    formData.append(
      "donationId",
      food.foodId
    );

    formData.append(
      "quantity",
      quantity
    );

    const response = await fetch(
      "http://localhost:8080/api/food-requests",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      }
    );

    const result = await response.json();

    if (!response.ok) {
      showPopup(
        "Request Failed",
        result.message ||
          "Failed to request food."
      );
      return;
    }

    showPopup(
      "Request Submitted",
      result.message ||
        "Your food request was submitted successfully!"
    );

  } catch (error) {
    console.error(
      "Request Food error:",
      error
    );

    showPopup(
      "Connection Error",
      "Could not connect to the Java server."
    );
  }
};

  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [donorContact, setDonorContact] = useState("");
  const [preparationDate, setPreparationDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [editingFoodId, setEditingFoodId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================
  // LOAD DONATIONS
  // ============================

  const loadDonations = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load donations");
      }

      const data = await response.json();
      setDonations(data);
    } catch (error) {
  console.error("Load error:", error);
  showPopup(
  "Load Error",
  error.message
);
}
  };
  // ============================
  // LOAD REQUESTS
  // ============================

  const loadRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/food-requests"
      );

      if (!response.ok) {
        throw new Error("Failed to load requests");
      }

      const data = await response.json();

      setRequests(data);

    } catch (error) {
      console.error(
        "Request load error:",
        error
      );

   showPopup(
  "Request Error",
  error.message
);
    }
  };
  // ============================
// FIND REQUEST FOR DONATION
// ============================

const getDonationRequest = (foodId) => {

  const matchingRequests = requests.filter(
    (request) =>
      Number(request.donationId) === Number(foodId)
  );

  if (matchingRequests.length === 0) {
    return null;
  }

  return matchingRequests[matchingRequests.length - 1];
};
  useEffect(() => {
    loadDonations();
  }, []);

  // ============================
  // CLEAR FORM
  // ============================

  const clearForm = () => {
    setFoodName("");
    setFoodType("");
    setQuantity("");
    setLocation("");
    setDonorContact("");
    setPreparationDate("");
    setExpiryDate("");
    setEditingFoodId(null);
  };

  // ============================
  // SUBMIT NEW DONATION
  // ============================

  const submitDonation = async () => {
    if (
      !foodName ||
      !foodType ||
      !quantity ||
      !location ||
      !donorContact||
      !preparationDate ||
      !expiryDate
    ) {
      showPopup(
  "Missing Information",
  "Please fill in all the required fields."
);
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();

      formData.append("foodName", foodName);
      formData.append("foodType", foodType);
      formData.append("quantity", quantity);
      formData.append("location", location);
      formData.append("donorContact", donorContact);
      formData.append("preparationDate", preparationDate);

      // Convert 2026-09-21T18:00
      // to 2026-09-21 18:00
      formData.append(
        "expiryDate",
        expiryDate.replace("T", " ")
      );

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to save donation"
        );
      }
    showPopup(
  "Donation Successful",
  result.message || "Your food donation has been saved successfully."
);    
  

      clearForm();

      await loadDonations();

      setPage("find");
    } catch (error) {
      console.error("Submit error:", error);

    showPopup(
  "Connection Error",
  error.message ||
    "Could not connect to the Java server."
);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // START EDIT
  // ============================

  const startEdit = (food) => {
    setEditingFoodId(food.foodId);

    setFoodName(food.foodName || "");
    setFoodType(food.foodType || "");
    setQuantity(food.quantity || "");
    setLocation(food.location || "");
    setDonorContact(food.donorContact || "");
setPreparationDate(food.preparationDate
        ? String(food.preparationDate).substring(0, 10)
        : ""
    );

    let expiry = food.expiryDate || "";

    expiry = String(expiry)
      .substring(0, 16)
      .replace(" ", "T");

    setExpiryDate(expiry);

    setPage("donate");
  };

  // ============================
  // UPDATE DONATION
  // ============================

  const updateDonation = async () => {
  if (!editingFoodId) {
    showPopup(
  "No Donation Selected",
  "Please select a donation first."
);
    return;
  }

  if (
    !foodName ||
    !foodType ||
    !quantity ||
    !location ||
    !donorContact ||
    !preparationDate ||
    !expiryDate
  ) {
     showPopup(
    "Missing Information",
    "Please fill in all the required fields."
  );
    return;
  }

  try {
    const body =
      "foodName=" +
      encodeURIComponent(foodName) +
      "&foodType=" +
      encodeURIComponent(foodType) +
      "&quantity=" +
      encodeURIComponent(quantity) +
      "&location=" +
      encodeURIComponent(location) +
      "&donorContact=" +
      encodeURIComponent(donorContact) +
      "&preparationDate=" +
      encodeURIComponent(preparationDate) +
      "&expiryDate=" +
      encodeURIComponent(
        expiryDate.replace("T", " ")
      );

    const response = await fetch(
      "http://localhost:8080/api/donations?id=" +
        editingFoodId,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body: body
      }
    );

    const result = await response.json();

    if (!response.ok) {
      showPopup(
  "Update Failed",
  result.message ||
    "Donation update failed."
);
      return;
    }

    showPopup(
  "Donation Updated",
  "Your donation was updated successfully!"
);

    await loadDonations();

    clearForm();

    setPage("find");

  } catch (error) {
    console.error("UPDATE ERROR:", error);

  showPopup(
  "Update Failed",
  "Update failed: " + error.message
);
  }
};

  // ============================
  // DELETE DONATION
  // ============================

  const deleteDonation = async (foodId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    );

    if (!confirmDelete) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        API_URL + "?id=" + foodId,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete donation"
        );
      }

      showPopup(
         "Donation Deleted",
           result.message ||
             "Donation deleted successfully!"
              );
      await loadDonations();
    } catch (error) {
      console.error("Delete error:", error);

      showPopup(
  "Delete Failed",
  error.message ||
    "Could not delete donation."
);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // DATE FORMAT
  // ============================

  const formatDate = (value) => {
    if (!value) {
      return "Not specified";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ============================
  // DATE + TIME FORMAT
  // ============================

  const formatDateTime = (value) => {
    if (!value) {
      return "Not specified";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ============================
  // HOME PAGE
  // ============================

  const homePage = (
    <>
      <main>
        <h1>
          Rescue Food.
          <br />
          Reduce Waste.
        </h1>

        <p>
          Connect surplus food with people who need it.
          Together, we can reduce food waste and help our
          community.
        </p>

        <div>
          <button
            onClick={() => {
              clearForm();
              setPage("donate");
            }}
          >
            Donate Food
          </button>

          <button
            onClick={() => {
              loadDonations();
              setPage("find");
            }}
          >
            Find Food
          </button>
        </div>
      </main>

      <section>
        <h2>How Food Rescue Works</h2>

        <div>
          <h3>🍲 1. Donate</h3>
          <p>
            Share your surplus food with people in need.
          </p>
        </div>

        <div>
          <h3>🔍 2. Find</h3>
          <p>
            Find available food donations near you.
          </p>
        </div>

        <div>
          <h3>❤️ 3. Share</h3>
          <p>
            Help reduce food waste and support your
            community.
          </p>
        </div>
      </section>
    </>
  );

  // ============================
  // DONATE / EDIT PAGE
  // ============================

  const donatePage = (
    <main>
      <div className="form-container">

        <h1>
          {editingFoodId
            ? "Edit Donation ✏️"
            : "Donate Food 🍲"}
        </h1>

        <p>
          {editingFoodId
            ? "Update your food donation details."
            : "Fill in the details of your food donation."}
        </p>

        <input
          type="text"
          placeholder="Food name"
          value={foodName}
          onChange={(e) =>
            setFoodName(e.target.value)
          }
        />

        <select
          value={foodType}
          onChange={(e) =>
            setFoodType(e.target.value)
          }
        >
          <option value="">
            Select Food Type
          </option>

          <option value="Vegetarian">
            Vegetarian
          </option>

          <option value="Non-Vegetarian">
            Non-Vegetarian
          </option>
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />
        <input
         type="text"
         placeholder="Donor Contact"
         value={donorContact}
         onChange={(e) =>
            setDonorContact(e.target.value)
          }
        />

        <label>
          Preparation Date
        </label>

        <input
          type="date"
          value={preparationDate}
          onChange={(e) =>
            setPreparationDate(e.target.value)
          }
        />

        <label>
          Expiry Date & Time
        </label>

        <input
          type="datetime-local"
          value={expiryDate}
          onChange={(e) =>
            setExpiryDate(e.target.value)
          }
        />

        <button
          onClick={
            editingFoodId
              ? updateDonation
              : submitDonation
          }
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : editingFoodId
            ? "Update Donation"
            : "Submit Donation"}
        </button>

        <button
          onClick={() => {
            clearForm();
            setPage("home");
          }}
        >
          Back to Home
        </button>

      </div>
    </main>
  );

  // ============================
  // FIND FOOD PAGE
  // ============================

  const findFoodPage = (
    <main>
      <div className="food-page">

        <h1>
          Available Food 🍱
        </h1>

        <p>
          Find food donations available near you.
        </p>

        {donations.length === 0 ? (
          <p>
            No food donations available.
          </p>
        ) : (
          <div className="food-list">

            {donations.map((food) => {

  const request = getDonationRequest(food.foodId);

  return (
              
              <div
                className="food-card"
                key={food.foodId}
              >

                <h2>
                  {food.foodName}
                </h2>

                <p>
                  🍽️ Type: {food.foodType}
                </p>

                <p>
                  📦 Quantity: {food.quantity}
                </p>

                <p>
                  📍 Location: {food.location}
                </p>

                <p>
                  📞 Donor Contact: {food.donorContact}
                </p>
            
                <p>
                  📅 Prepared:{" "}
                  {formatDate(
                    food.preparationDate
                  )}
                </p>

                <p>
                  ⏰ Expires:{" "}
                  {formatDateTime(
                    food.expiryDate
                  )}
                </p>

                <p>
                  📌 Status:{" "}
                  {food.status || "Posted"}
                </p>
                <button
  onClick={ () => {
     openQuantityPopup(food);
  }}
>

  Request Food
</button>

                <button
                  onClick={() =>
                    startEdit(food)
                  }
                >
                  Edit Donation
                </button>

                <button
                  onClick={() =>
                    deleteDonation(
                      food.foodId
                    )
                  }
                >
                  Delete Donation
                </button>

              </div>
  );
})}

          </div>
        )}

        <button
          onClick={() =>
            setPage("home")
          }
        >
          Back to Home
        </button>

      </div>
    </main>
  );
  // ============================
// MY DONATIONS PAGE
// ============================

const myDonationsPage = (
  <main>
    <div className="my-donations-page">

      <h1>My Donations 🍲</h1>

      <p>
        View and track the food donations you have posted.
      </p>

      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="donations-list">

          {donations.map((food) => (
            <div
              key={food.foodId}
              className="donation-card"
            >

              <h2>{food.foodName}</h2>

              <p>
                🍴 Food Type: {food.foodType}
              </p>

              <p>
                📦 Quantity: {food.quantity}
              </p>

              <p>
                📍 Location: {food.location}
              </p>

              <p>
                📞 Donor Contact:{" "}
                {food.donorContact || "Not provided"}
              </p>

              <p>
                📅 Preparation Date:{" "}
                {formatDate(food.preparationDate)}
              </p>

              <p>
                ⏰ Expiry:{" "}
                {formatDateTime(food.expiryDate)}
              </p>

              <p>
                📌 Status:{" "}
                {food.status || "Posted"}
              </p>

            </div>
          ))}

        </div>
      )}

      <button
        onClick={() => setPage("home")}
      >
        Back to Home
      </button>

    </div>
  </main>
);
  // ============================
// REQUESTS PAGE
// ============================

const requestsPage = (
  <main>
    <div className="requests-page">

      <h1>🍱 Food Requests</h1>

      {requests.length === 0 ? (

        <p>No food requests yet.</p>

      ) : (

        <div className="requests-container">

          {requests.map((request) => (

            <div
              className="request-card"
              key={request.requestId}
            >

              <h3>
                🍱 Food Request #{request.requestId}
              </h3>

              <p>
                <strong>Donation ID:</strong>{" "}
                {request.donationId}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {request.quantity}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    request.status
                      .toLowerCase()
                      .replace(" ", "-")
                  }
                >
                  {request.status}
                </span>
              </p>

              <p>
                <strong>Requested:</strong>{" "}
                {request.requestDate}
              </p>


              {/* ACCEPT REQUEST */}

              {request.status === "Requested" && (

                <button
                  onClick={async () => {

                    try {

                      const response = await fetch(
                        `http://localhost:8080/api/food-requests?id=${request.requestId}`,
                        {
                          method: "PUT"
                        }
                      );

                      const result =
                        await response.json();

                      if (!response.ok) {
                        throw new Error(
                          result.message ||
                          "Failed to accept request"
                        );
                      }

                      showPopup(
                         "Success",
                         result.message
                         );

                      await loadRequests();

                    } catch (error) {

                      console.error(
                        "Accept request error:",
                        error
                      );

                      showPopup(
                           "Connection Error",
                        "Could not connect to the Java server."
                         );
                    }

                  }}
                >
                  Accept Request
                </button>

              )}


              {/* PICKED UP */}

              {request.status === "Accepted" && (

                <button
                  onClick={async () => {

                    try {

                      const response = await fetch(
                        `http://localhost:8080/api/food-requests?id=${request.requestId}&action=pickup`,
                        {
                          method: "PUT"
                        }
                      );

                      const result =
                        await response.json();

                      if (!response.ok) {
                        throw new Error(
                          result.message ||
                          "Failed to mark request as picked up"
                        );
                      }

                      showPopup(
                      "Success",
                     result.message
                      );

                      await loadRequests();

                    } catch (error) {

                      console.error(
                        "Pick up error:",
                        error
                      );

                      showPopup(
  "Connection Error",
  "Could not connect to the Java server."
);
                    }

                  }}
                >
                  Picked Up
                </button>

              )}


              {/* DELIVERED */}

              {request.status === "Picked Up" && (

                <button
                  onClick={async () => {

                    try {

                      const response = await fetch(
                        `http://localhost:8080/api/food-requests?id=${request.requestId}&action=deliver`,
                        {
                          method: "PUT"
                        }
                      );

                      const result =
                        await response.json();

                      if (!response.ok) {
                        throw new Error(
                          result.message ||
                          "Failed to mark request as delivered"
                        );
                      }

                      showPopup(
                      "Success",
                     result.message
                      );

                      await loadRequests();

                    } catch (error) {

                      console.error(
                        "Deliver request error:",
                        error
                      );

                      showPopup(
                       "Connection Error",
                       "Could not connect to the Java server."
                        );
                    }

                  }}
                >
                  Delivered
                </button>

              )}

            </div>

          ))}

        </div>

      )}

      <button
        onClick={() =>
          setPage("home")
        }
      >
        Back to Home
      </button>

    </div>
  </main>
);

  // ============================
  // MAIN APP
  // ============================

  return (
    <div>

      <nav>

        <h2>
          🍱 Food Rescue
        </h2>

        <div>

          <button
            onClick={() =>
              setPage("home")
            }
          >
            Home
          </button>

          <button
            onClick={() => {
              clearForm();
              setPage("donate");
            }}
          >
            Donate Food
          </button>

          <button
            onClick={() => {
              loadDonations();
              setPage("find");
            }}
          >
            Find Food
          </button>

          <button
            onClick={() =>
              showPopup(
             "Coming Soon",
             "Login feature will be added later."
                )
      
            }
          >
            Login
          </button>
          <button
            onClick={() => {
            loadRequests();
           setPage("requests");
           }}
>
  Requests
</button>   
<button
  onClick={async () => {
    await loadDonations();
    await loadRequests();
    setPage("myDonations");
  }}
>
  My Donations
</button>       
          
        </div>

      </nav>

      {page === "home" && homePage}

      {page === "donate" && donatePage}

      {page === "find" && findFoodPage}
      
      {page === "requests" && requestsPage}

    {page === "myDonations" && myDonationsPage}

    {popup.show && (
  <div className="popup-overlay">
    <div className="popup-box">

      <div className="popup-icon">
        ✓
      </div>

      <h2>{popup.title}</h2>

      <p>{popup.message}</p>

      <button onClick={closePopup}>
        OK
      </button>

    </div>
  </div>
)}
{quantityPopup.show && (
  <div className="quantity-popup-overlay">

    <div className="quantity-popup">

      <div className="popup-icon">
        🍲
      </div>

      <h2>Request Food</h2>

      <p>How many portions do you need?</p>

      <input
        type="number"
        min="1"
        value={quantityPopup.value}
        onChange={(e) =>
          setQuantityPopup({
            ...quantityPopup,
            value: e.target.value
          })
        }
        placeholder="Enter portions"
      />

      <div className="quantity-popup-buttons">

        <button
          onClick={() =>
            setQuantityPopup({
              show: false,
              value: "",
              food: null
            })
          }
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (!quantityPopup.value) {
              showPopup(
                "Invalid Quantity",
                "Please enter the number of portions."
              );
              return;
            }

            const selectedFood = quantityPopup.food;
            const selectedQuantity = quantityPopup.value;

            setQuantityPopup({
              show: false,
              value: "",
              food: null
            });

            submitFoodRequest(
              selectedFood,
              selectedQuantity
            );
          }}
        >
          Request Food
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}

export default App;