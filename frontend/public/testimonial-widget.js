document.addEventListener("DOMContentLoaded", async function () {
  // Inject CSS into the document
  const style = document.createElement("style");
  style.textContent = `
    .testimonial-carousel {
      width: 80%;
      margin: auto;
      overflow: hidden;
      position: relative;
      background: #f9f9f9;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .slider-wrapper {
      justify-content: center;
      align-items: center;
      display: flex;
      transition: transform 0.5s ease-in-out;
    }

    .slide-container {
      display: flex;
      gap: 20px;
      justify-content: center;
      width: 80%;
    }

    .slide {
      flex: 1;
      min-width: 30%;
      padding: 20px;
      text-align: center;
      background: white;
      border-radius: 10px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .user-info img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ddd;
    }

    .user-name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }

    .user-email {
      font-size: 12px;
      color: #777;
    }

    .rating {
      display: flex;
      justify-content: center;
      margin: 10px 0;
    }

    .star {
      font-size: 20px;
      color: #ffcc00;
      margin: 0 2px;
    }

    .empty-star {
      color: #ddd;
    }

    .feedback-text {
      font-size: 14px;
      color: #555;
      font-style: italic;
      margin: 10px 0;
    }

    .submitted-date {
      font-size: 12px;
      color: #999;
      margin-top: 10px;
    }
  `;
  document.head.appendChild(style);

  const scriptElement = document.querySelector("script[data-space-id]");

  if (!scriptElement) {
    console.error("Script element not found.");
    return;
  }

  const spaceId = scriptElement.getAttribute("data-space-id");

  if (!spaceId) {
    console.error("data-space-id attribute is missing.");
    return;
  }

  console.log("Space ID:", spaceId);

  try {
    const response = await fetch(`http://localhost:4000/feedback/get-feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spaceId: spaceId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Testimonials Data:", data);
    const sliderContainer = document.querySelector(".testimonial-carousel");
    const sliderWrapper = document.createElement("div");
    sliderWrapper.classList.add("slider-wrapper");

    if (data.feedbacks && Array.isArray(data.feedbacks)) {
      let testimonials = data.feedbacks;

      // If there are fewer than 3 testimonials, duplicate them
      while (testimonials.length < 3) {
        testimonials = [...testimonials, ...testimonials].slice(0, 3);
      }

      // Group testimonials into sets of 3
      const groupedTestimonials = [];
      for (let i = 0; i < testimonials.length; i += 3) {
        groupedTestimonials.push(testimonials.slice(i, i + 3));
      }

      // Function to generate HTML for a group of 3 testimonials
      function generateSlideHtml(group) {
        return `
          <div class="slide-container">
            ${group
              .map(
                (testimonial) => `
                <div class="slide">
                  <div class="user-info">
                    ${
                      testimonial.feedbackuserLogo
                        ? `<img src="${testimonial.feedbackuserLogo}" alt="User">`
                        : ""
                    }
                    <div>
                      <p class="user-name">${testimonial.name}</p>
                      <p class="user-email">${testimonial.email}</p>
                    </div>
                  </div>

                  <div class="rating">
                    ${[...Array(5)]
                      .map(
                        (_, index) =>
                          `<span class="star ${
                            index < testimonial.rating ? "" : "empty-star"
                          }">★</span>`
                      )
                      .join("")}
                  </div>

                  <p class="feedback-text">"${testimonial.feedback}"</p>
                  <p class="submitted-date">Submitted on: ${new Date(
                    testimonial.createdAt
                  ).toLocaleString()}</p>
                </div>
              `
              )
              .join("")}
          </div>
        `;
      }

      // Generate slides and append them
      let currentIndex = 0;
      function updateSlider() {
        sliderWrapper.innerHTML = generateSlideHtml(
          groupedTestimonials[currentIndex]
        );
        currentIndex = (currentIndex + 1) % groupedTestimonials.length;
      }

      updateSlider(); // Show first set of 3 testimonials
      sliderContainer.appendChild(sliderWrapper);
      setInterval(updateSlider, 3000); // Change slides every 3 seconds
    } else {
      console.error("Testimonials data is missing or invalid:", data);
      sliderContainer.innerHTML =
        '<p class="text-gray-500 italic">No testimonials to display.</p>';
    }
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    document.querySelector(".testimonial-carousel").innerHTML =
      '<p class="text-gray-500 italic">Failed to load testimonials. Please try again later.</p>';
  }
});