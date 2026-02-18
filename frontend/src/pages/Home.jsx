import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Projects from "../components/Projects";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="bg-white">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Projects />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
