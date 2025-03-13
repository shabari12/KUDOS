document.addEventListener('DOMContentLoaded', function () {
    const widgetContainer = document.getElementById('testimonial-widget');
    const spaceId = widgetContainer?.getAttribute('data-space-id');
  
    if (!spaceId) {
      console.error('Space ID is missing.');
      return;
    }
  
    // Fetch testimonials for the given space ID
    fetch(`${window.location.origin}/api/get-testimonials?spaceId=${spaceId}`)
      .then(response => response.json())
      .then(data => {
        const swiperWrapper = document.createElement('div');
        swiperWrapper.className = 'swiper-wrapper';
  
        data.testimonials.forEach(testimonial => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
  
          const testimonialCard = document.createElement('div');
          testimonialCard.className = 'p-6 bg-white rounded-lg shadow-sm border border-gray-100';
  
          // User Info and Image
          const userInfo = document.createElement('div');
          userInfo.className = 'flex items-center space-x-4';
  
          if (testimonial.feedbackuserLogo) {
            const userImage = document.createElement('img');
            userImage.src = testimonial.feedbackuserLogo;
            userImage.alt = 'User';
            userImage.className = 'w-12 h-12 rounded-full object-cover border-2 border-gray-200';
            userInfo.appendChild(userImage);
          }
  
          const userDetails = document.createElement('div');
          const userName = document.createElement('p');
          userName.className = 'text-lg font-semibold text-gray-900';
          userName.textContent = testimonial.name;
  
          const userEmail = document.createElement('p');
          userEmail.className = 'text-sm text-gray-500';
          userEmail.textContent = testimonial.email;
  
          userDetails.appendChild(userName);
          userDetails.appendChild(userEmail);
          userInfo.appendChild(userDetails);
          testimonialCard.appendChild(userInfo);
  
          // Star Rating
          if (testimonial.rating) {
            const starRating = document.createElement('div');
            starRating.className = 'flex items-center mt-4';
  
            for (let i = 0; i < 5; i++) {
              const star = document.createElement('span');
              star.className = i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300';
              star.textContent = '★';
              starRating.appendChild(star);
            }
  
            testimonialCard.appendChild(starRating);
          }
  
          // Feedback
          const feedback = document.createElement('p');
          feedback.className = 'mt-4 text-gray-700 italic';
          feedback.textContent = `"${testimonial.feedback}"`;
          testimonialCard.appendChild(feedback);
  
          // Submitted Time
          const submittedTime = document.createElement('p');
          submittedTime.className = 'mt-4 text-sm text-gray-500';
          submittedTime.textContent = `Submitted on: ${new Date(testimonial.createdAt).toLocaleString()}`;
          testimonialCard.appendChild(submittedTime);
  
          slide.appendChild(testimonialCard);
          swiperWrapper.appendChild(slide);
        });
  
        const swiperContainer = document.createElement('div');
        swiperContainer.className = 'testimonial-carousel swiper-container overflow-hidden';
        swiperContainer.appendChild(swiperWrapper);
  
        const pagination = document.createElement('div');
        pagination.className = 'swiper-pagination';
        swiperContainer.appendChild(pagination);
  
        widgetContainer.appendChild(swiperContainer);
  
        // Initialize Swiper
        new Swiper('.testimonial-carousel', {
          slidesPerView: 3,
          spaceBetween: 16,
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });
      })
      .catch(error => console.error('Error fetching testimonials:', error));
  });