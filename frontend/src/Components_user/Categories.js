import React from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import '../CSS/Categories.css';

const Categories = () => {
  const categories = [
    { name: 'Fiction', icon: '📖' },
    { name: 'Non-Fiction', icon: '📚' },
    { name: 'Science', icon: '🔬' },
    { name: 'History', icon: '🏛️' },
    { name: 'Biographies', icon: '👤' },
  ];
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3, 
  });

  const springs = useSprings(
    categories.length,
    categories.map((_, index) => ({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' },
      delay: index * 150,
      config: { tension: 180, friction: 12 },
    }))
  );

  return (
    <section className="categories" ref={ref}>
      <h3>Browse Categories</h3>
      <div className="category-list">
        {springs.map((springStyle, index) => (
          <animated.div style={springStyle} className="category-card" key={index}>
            <span className="category-icon">{categories[index].icon}</span>
            <p>{categories[index].name}</p>
          </animated.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
