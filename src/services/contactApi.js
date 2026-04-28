/**
 * Contact API service
 * Currently uses a dummy promise for simulation.
 * Easy to swap with real fetch/axios POST /api/v1/contact later.
 */

export const submitContactForm = (data) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      console.log("Submitted Data:", data);
      
      // In the future, replace this with a real API call:
      /*
      return fetch('https://api.indinexz.com/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json());
      */

      resolve({ 
        success: true, 
        message: "Your request has been submitted successfully" 
      });
    }, 1500);
  });
};

export default {
  submitContactForm,
};
