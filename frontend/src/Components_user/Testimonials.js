import React from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import '../CSS/Testimonials.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Testimonials = () => {
  const reviews = [
    { name: 'Rayane', imageUrl: '../FoundersImages/Rayane.jpg', rating: 5, text: 'Fantastic collection of books!' },
    { name: 'Tahir', imageUrl: '../FoundersImages/Tahir.jpg', rating: 4, text: 'Great customer service.' },
    { name: 'Mouhssine', imageUrl: '../FoundersImages/Mouhssine.jpg', rating: 5, text: 'Love the variety in genres!' },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3, 
  });

  const springs = useSprings(
    reviews.length,
    reviews.map((_, index) => ({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' },
      delay: index * 200,
      config: { tension: 180, friction: 12 },
    }))
  );

  return (
    <section className="testimonials" ref={ref}>
      <h3>What Our Customers Say</h3>
      <div className="testimonials-list">
        {springs.map((springStyle, index) => (
          <animated.div style={springStyle} className="testimonial-card" key={index}>
            <img src={reviews[index].imageUrl} alt={reviews[index].name} className="profile-pic" />
            <h4>{reviews[index].name}</h4>
            <div className="rating">
              {[...Array(reviews[index].rating)].map((_, i) => (
                <FontAwesomeIcon icon={faStar} key={i} />
              ))}
            </div>
            <p>{reviews[index].text}</p>
          </animated.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
