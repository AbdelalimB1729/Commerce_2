
import React from 'react';
import { useSprings, animated } from '@react-spring/web';
import '../CSS/PopularBooks.css';

const PopularBooks = () => {
  const books = [
    { title: 'Thérese Raquin', author: 'Zola', imageUrl: '../Books/1462516-f.jpg' },
    { title: 'Le Dernier Jour D un Condamné', author: 'Hugo', imageUrl: '../Books/2162278-f.jpg' },
    { title: 'La Nausée', author: 'Jean-Paul Sartre', imageUrl: '../Books/la_nausse.jpg' },
  ];

  const springs = useSprings(
    books.length,
    books.map((_, index) => ({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
      delay: index * 150,
    }))
  );

  return (
    <section className="popular-books">
      <h3>Popular Books</h3>
      <div className="books-list">
        {springs.map((springStyle, index) => (
          <animated.div style={springStyle} className="book-card" key={index}>
            <img src={books[index].imageUrl} alt={books[index].title} />
            <h4>{books[index].title}</h4>
            <p>{books[index].author}</p>
          </animated.div>
        ))}
      </div>
    </section>
  );
};

export default PopularBooks;
