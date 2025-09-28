document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;
        if (details.category === "sports") {
          activityCard.classList.add("sports");
        } else if (details.category === "artistic") {
          activityCard.classList.add("artistic");
        } else if (details.category === "intellectual") {
          activityCard.classList.add("intellectual");
        }
        // Add sample activities if not present
        if (Object.keys(activities).length === 1 && name === "Soccer") {
          activities["Basketball"] = {
            description: "Join a friendly basketball match for all skill levels.",
            schedule: "Saturdays, 4pm-6pm",
            max_participants: 12,
            participants: [],
            category: "sports"
          };
          activities["Swimming"] = {
            description: "Group swimming sessions with a coach.",
            schedule: "Fridays, 5pm-6pm",
            max_participants: 10,
            participants: [],
            category: "sports"
          };
          activities["Painting"] = {
            description: "Explore your creativity with painting workshops.",
            schedule: "Wednesdays, 3pm-5pm",
            max_participants: 8,
            participants: [],
            category: "artistic"
          };
          activities["Photography"] = {
            description: "Learn photography basics and go on photo walks.",
            schedule: "Sundays, 10am-12pm",
            max_participants: 10,
            participants: [],
            category: "artistic"
          };
          activities["Chess Club"] = {
            description: "Weekly chess club for all levels.",
            schedule: "Mondays, 6pm-8pm",
            max_participants: 16,
            participants: [],
            category: "intellectual"
          };
          activities["Book Discussion"] = {
            description: "Join our monthly book discussion group.",
            schedule: "Last Thursday of the month, 7pm-8:30pm",
            max_participants: 20,
            participants: [],
            category: "intellectual"
          };
        }
        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
