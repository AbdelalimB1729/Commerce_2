import '../CSS/Navbar.css';
import Banner from '../Components_user/Banner';
import Navbar from '../Components_user/Nav';
import Footer from '../Components_user/Footer';
import PopularBooks from '../Components_user/PopularBooks';
import Categories from '../Components_user/Categories';
import Testimonials from '../Components_user/Testimonials';
function Home() {
  return (
    <div className="Home">
      <Navbar />
      <Banner />
      <PopularBooks />
      <Categories />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Home;
