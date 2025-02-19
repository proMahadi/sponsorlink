import React, { useState, useRef, useEffect } from "react";
import Footer from "@/components/Footer/Footer";
import { Link } from "react-router-dom";
import '@/styles/Home.css';
import { Button } from "@geist-ui/core";

// Data Constants
const AUDIENCE_DATA = [
    {
        image: "https://plus.unsplash.com/premium_photo-1661772661721-b16346fe5b0f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Business",
        description: "Are you a business looking for business - to - business, brand, or influencer collaboration?",
        buttonText: "Join as Business"
    },
    {
        image: "https://plus.unsplash.com/premium_photo-1684017834450-21747b64d666?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Influencer",
        description: "Are you an influencer looking for business, brand, or influencer -to - influencer collaboration?.",
        buttonText: "Post a Project"
    },
    {
        image: "https://plus.unsplash.com/premium_photo-1661288439917-1542b58a962b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Individual",
        description: "Share your expertise and guide others while building your professional network.",
        buttonText: "Become a Mentor"
    }
];

const TEAM_DATA = [
    {
        name: "Peter Collier",
        role: "Platform Founder",
        image: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
        name: "Max Curtis",
        role: "Backend Lead",
        image: "https://randomuser.me/api/portraits/men/21.jpg"
    },
    {
        name: "James Nichols",
        role: "Backend Lead",
        image: "https://randomuser.me/api/portraits/men/72.jpg"
    },
    {
        name: "Charles McGuire",
        role: "Frontend Lead",
        image: "https://randomuser.me/api/portraits/men/88.jpg"
    }
];

const BLOG_DATA = Array(12).fill().map((_, index) => ({
  id: index + 1,
  image: `https://picsum.photos/seed/${index + 1}/400/300`,
  title: "Title of article",
  description: "dolor sit amet consectetur, adipisicing elit. Officiis nobis, aliquid consectetur dolorem illum at dolorum.",
  link: "#"
}));


// Utility Functions
const createCluster = () => {
    const centerX = Math.random() * window.innerWidth;
    const centerY = Math.random() * window.innerHeight;
    
    return Array(3).fill().map(() => ({
        id: Math.random(),
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        },
        src: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 100)}.jpg`
    }));
};

// Component Functions
const FloatingImages = () => {
    const [images, setImages] = useState([]);
    const containerRef = useRef(null);
    
    useEffect(() => {
        setImages([...createCluster(), ...createCluster()]);
        let animationFrameId;
        
        const animate = () => {
            setImages(prevImages => prevImages.map(img => {
                let newX = img.x + img.velocity.x;
                let newY = img.y + img.velocity.y;
                
                if (newX < 0 || newX > window.innerWidth) img.velocity.x *= -1;
                if (newY < 0 || newY > window.innerHeight) img.velocity.y *= -1;
                
                return { ...img, x: newX, y: newY };
            }));
            
            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="floating-background" ref={containerRef}>
            {images.map(img => (
                <div
                    key={img.id}
                    className="floating-image"
                    style={{
                        transform: `translate(${img.x}px, ${img.y}px)`,
                        position: 'absolute',
                        width: '55px',
                        height: '55px'
                    }}
                >
                    <img
                        src={img.src}
                        alt=""
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '2px solid var(--color-accent)',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

const AudienceCard = ({ image, name, description, buttonText }) => (
    <div className="audience-card prevent-select">
        <img src={image} alt={name} />
        <div className="audience-name">{name}</div>
        <div className="audience-description">{description}</div>
        <Link to="/signup" className="audience-btn">{buttonText}</Link>
    </div>
);

const BlogCard = ({ image, title, description }) => (
  <div className="blog-card prevent-select">
      <img src={image} alt={title} />
      <div className="blog-title">{title}</div>
      <div className="blog-description">{description}</div>
      <Link to="#" className="blog-btn">Read More</Link>
  </div>
);

const BlogSection = () => {
  const [visibleItems, setVisibleItems] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = () => {
      setIsLoading(true);
      setTimeout(() => {
          setVisibleItems(prev => Math.min(prev + 6, BLOG_DATA.length));
          setIsLoading(false);
      }, 800);
  };

  return (
      <div className="blog-section">
          <header>
              <div className="audience-title"><span>Press</span> release</div>
              <div className="audience-subtitle">Here are some recent articles about SponorLink-hosted projects.</div>
          </header>
          <div className="blog-cards">
              {BLOG_DATA.slice(0, visibleItems).map((blog) => (
                  <BlogCard key={blog.id} {...blog} />
              ))}
          </div>
          {visibleItems < BLOG_DATA.length && (
              <Button 
                  onClick={loadMore}
                  loading={isLoading}
                  style={{ margin: '2rem auto' }}
                  scale={0.9}
              >
                  Load More
              </Button>
          )}
      </div>
  );
};



// Main Component
export default function Home({isAuthenticated, setIsAuthenticated}) {
    const scrollToAudience = () => {
        const element = document.querySelector('.audience-section');
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - 68;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    };

    return (
        <>
            
            {/* Hero Section */}
            <div className="home-container">
                <div className="hero">
                    <FloatingImages />
                    <div className="hero-group">
                      <h1>Find your dream <br />collaboration <span>here</span>.</h1>
                      <h4>A professional community network built for collaboration.</h4>
                      <Link to="/signup" className="hero-button prevent-select">
                          Get Started
                      </Link>
                    </div>
                    <div className="down-arrow desktop-only" onClick={scrollToAudience} />
                </div>
            </div>

            {/* Audience Section */}
            <div className="audience-section">
                <header>
                    <div className="audience-title">The kind of <span>people</span> we help.</div>
                    <div className="audience-subtitle">You can join the platform as:</div>
                </header>
                <div className="audience-cards">
                    {AUDIENCE_DATA.map((audience, index) => (
                        <AudienceCard key={index} {...audience} />  
                    ))}
                </div>
            </div>

            {/* Work Section */}
            <div className="our-work-section">
                <h1>How <span>we</span> work:</h1>
                <div className="paragraph">
                    <p>We at SponsorLink are a professional community network built for collaboration. Our platform helps you contact without the need for a contract.</p>
                    
                    <p>Because of this, the service we offer involves uniting businesses / brands, influencers, and individuals alike to collaborate on any desired venture; inviting specialists from all over the world to unite.</p>
                    
                    <p>To get started, sign up, post a venture listing that others can apply to work on, then watch the collaboration requests come flooding in.
                    Alternatively, users can apply to collaborate on ventures listed, and monitor progress of these requests through our intuitive notification and reminder system.</p>
                    
                    <p>Upon creating an account, you can choose to share social media presence, a project portfolio and previous collaborations.</p>
                    
                    <p>Project listings are fully customisable, with the ability to score listings based on location, hybrid-work type, industry, specialism and more.</p>
                </div>
            </div>

            {/* Team Section */}
            <div className="team-section">
                <h1>Meet our <span>team</span></h1>
                <div className="team-cards prevent-select">
                    {TEAM_DATA.map((member, index) => (
                        <div key={index} className="team-card">
                            <img src={member.image} alt={member.name} />
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Blog Section */}
            <BlogSection />

            {/* Footer */}
            <Footer />
        </>
    );
}
