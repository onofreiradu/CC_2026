import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Home</h1>
      <Link
        to="/profile"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          padding: '0.7rem 1.3rem',
          borderRadius: '10px',
          textDecoration: 'none',
          color: '#fff',
          backgroundColor: '#1f6feb',
          fontWeight: 600,
        }}
      >
        Go to Profile
      </Link>
    </div>
  );
};

export default Home;