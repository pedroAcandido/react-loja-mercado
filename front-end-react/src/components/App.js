import "../css/style.css";
import Dashboard from "./Dashboard";
import Login from "./Login";
import {useState} from "react"

async function getLogin(){

}

export default function App() {  
  const [userForm, setUserForm] = useState({ name: '', password: '' });
  const [isLogin, setIsLogin] = useState(false);

  const handleUserFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await getLogin(userForm);
      setIsLogin(true);
      console.log(user);
    } catch (error) {
      console.log(error);
      setIsLogin(false);
    }
  };
  
  return (
    <div>
      {isLogin ? (
        <Dashboard />
      ) : (
        <Login
          userForm={userForm}
          setUserForm={setUserForm}
          handleUserFormSubmit={handleUserFormSubmit}
        />
      )}
    </div>
  );
}