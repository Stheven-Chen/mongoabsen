import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Overlay } from '../component/ui';

interface LoginProps {
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;}

const Login: React.FC<LoginProps> = ({ setNames, username, setUsername , setIsLoggedIn}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('https://server-production-9d59.up.railway.app/users', {
        method: 'GET',
      });
      const data = await res.json();
      const trimUsername = username.trim().toLowerCase();
      const filterUser = data.find((item: { user: string }) => item.user === trimUsername);

      if (!filterUser) {
        setError('Username yang dimasukkan salah.');
        setIsLoading(false);
        return;
      }else if(filterUser.nama ==="Admin"){
        navigate('/admin');
        setIsLoggedIn(true);
        setIsLoading(false);
        return;      }

      const extractedName = filterUser.nama;
      setNames([extractedName]);
      setIsLoggedIn(true);
      setIsLoading(false);
      navigate(`/absen`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseAlert = () => {
    setError('');
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center font-bold text-2xl mb-4">Halaman Login</h2>
      <img src="/login.svg" alt="Login" className="mx-auto mb-4 max-w-full w-full lg:w-1/3 h-auto" />

      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Masukkan Nama"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-64 px-4 py-2 border border-gray-300 rounded-md mb-4"
          name="user"
        />

        <Button onClick={handleLogin} buttonText="Masuk" className="w-48" />
      </div>

      {isLoading && <Overlay text="Loading..." />}

      {error && <Alert onClick={handleCloseAlert} text={error} />}
    </div>
  );
};

export default Login;
