import axios from 'axios';

export default function Login() {
  const login = () => {
  window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
};

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Analytics Platform</h1>
      <button onClick={login} style={{ padding: '10px 20px', fontSize: '18px' }}>
        Login with Google
      </button>
    </div>
  );
}