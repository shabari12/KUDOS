(function() {
  // Find the widget container
  const widgetContainer = document.getElementById('testimonial-widget');
  if (!widgetContainer) return;
  
  // Get the space ID from the data attribute
  const spaceId = widgetContainer.getAttribute('data-space-id');
  if (!spaceId) {
    console.error('Testimonial widget: No space ID provided');
    return;
  }
  
  // Create widget styles
  const style = document.createElement('style');
  style.textContent = `
    .testimonial-widget {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 100%;
    }
    .testimonial-widget__header {
      margin-bottom: 1rem;
      text-align: center;
    }
    .testimonial-widget__title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 0.5rem 0;
    }
    .testimonial-widget__items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    .testimonial-widget__item {
      background-color: #f7fafc;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .testimonial-widget__quote {
      font-style: italic;
      color: #4a5568;
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }
    .testimonial-widget__author {
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }
    .testimonial-widget__date {
      color: #718096;
      font-size: 0.875rem;
      margin: 0.25rem 0 0 0;
    }
    .testimonial-widget__media {
      margin-top: 1rem;
      max-width: 100%;
      border-radius: 0.25rem;
    }
    .testimonial-widget__footer {
      margin-top: 1rem;
      text-align: center;
      font-size: 0.75rem;
      color: #a0aec0;
    }
    .testimonial-widget__link {
      color: #4299e1;
      text-decoration: none;
    }
    .testimonial-widget__link:hover {
      text-decoration: underline;
    }
    .testimonial-widget__empty {
      text-align: center;
      padding: 2rem;
      color: #718096;
      font-style: italic;
    }
  `;
  document.head.appendChild(style);
  
  // Function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
  
  // Fetch testimonials from localStorage (in a real app, this would be an API call)
  function fetchTestimonials() {
    try {
      const spacesJson = localStorage.getItem('spaces');
      if (!spacesJson) return [];
      
      const spaces = JSON.parse(spacesJson);
      const space = spaces.find(s => s.id === spaceId);
      
      return space ? space.testimonials : [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  }
  
  // Render the widget
  function renderWidget() {
    const testimonials = fetchTestimonials();
    
    // Create widget container
    const widget = document.createElement('div');
    widget.className = 'testimonial-widget';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'testimonial-widget__header';
    
    const title = document.createElement('h3');
    title.className = 'testimonial-widget__title';
    title.textContent = 'What Our Customers Say';
    header.appendChild(title);
    
    widget.appendChild(header);
    
    // Create testimonials container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'testimonial-widget__items';
    
    if (testimonials.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'testimonial-widget__empty';
      emptyMessage.textContent = 'No testimonials available yet.';
      widget.appendChild(emptyMessage);
    } else {
      // Add testimonials
      testimonials.forEach(testimonial => {
        const item = document.createElement('div');
        item.className = 'testimonial-widget__item';
        
        const quote = document.createElement('p');
        quote.className = 'testimonial-widget__quote';
        quote.textContent = `"${testimonial.feedback}"`;
        item.appendChild(quote);
        
        const author = document.createElement('p');
        author.className = 'testimonial-widget__author';
        author.textContent = testimonial.name;
        item.appendChild(author);
        
        const date = document.createElement('p');
        date.className = 'testimonial-widget__date';
        date.textContent = formatDate(testimonial.date);
        item.appendChild(date);
        
        if (testimonial.mediaUrl) {
          const media = document.createElement('img');
          media.className = 'testimonial-widget__media';
          media.src = testimonial.mediaUrl;
          media.alt = `Media from ${testimonial.name}`;
          item.appendChild(media);
        }
        
        itemsContainer.appendChild(item);
      });
      
      widget.appendChild(itemsContainer);
    }
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'testimonial-widget__footer';
    footer.innerHTML = 'Powered by <a href="/" class="testimonial-widget__link" target="_blank">TestiCollect</a>';
    widget.appendChild(footer);
    
    // Add the widget to the container
    widgetContainer.appendChild(widget);
  }
  
  // Initialize the widget
  renderWidget();
})();