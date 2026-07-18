import { useEffect, useRef } from 'react';

export function useScrollAnimation(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) {
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Allow observing the ref element itself if it has the class
    if (ref.current && ref.current.classList.contains('animate-fade-up')) {
       observer.observe(ref.current);
    }
    
    // Also observe any children with the class
    const children = ref.current?.querySelectorAll('.animate-fade-up') || [];
    children.forEach(el => observer.observe(el));
    
    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);
  
  return ref;
}
