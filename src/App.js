import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login'
import Messenger from "./pages/Messenger";
import Signup from './pages/Signup'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Messenger />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;