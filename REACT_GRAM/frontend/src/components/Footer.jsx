import "./Footer.css"
import { useLocation } from "react-router-dom";

const Footer = () => {

  const location = useLocation();
  const isMessagesRoute =
    location.pathname.startsWith('/contacts/') || location.pathname.startsWith('/messages/');

  if (isMessagesRoute) {
    return null; // Renderiza nada se estiver em uma rota de mensagens
  }

  return (
    <footer id="footer">
      <p>ReactGram &copy; 2024</p>
    </footer>
  );
}

export default Footer