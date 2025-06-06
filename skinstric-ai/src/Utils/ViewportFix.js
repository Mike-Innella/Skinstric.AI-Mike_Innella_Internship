/**
 * ViewportFix.js
 * 
 * This utility helps ensure proper viewport sizing on mobile devices
 * by setting a CSS custom property that represents the true viewport height.
 * This is especially useful for iOS Safari and other mobile browsers
 * where 100vh can be inconsistent.
 */

// Sets the --vh custom property based on the actual viewport height
export function setViewportHeight() {
  // Get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  
  // Set the value in the --vh custom property
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Call once on load and then on resize
export function initViewportFix() {
  // Set the height initially
  setViewportHeight();
  
  // Add event listener to update on resize
  window.addEventListener('resize', () => {
    setViewportHeight();
  });
  
  // Update on orientation change too
  window.addEventListener('orientationchange', () => {
    // Small timeout to ensure the browser has completed the resize
    setTimeout(() => {
      setViewportHeight();
    }, 100);
  });
}

export default initViewportFix;
