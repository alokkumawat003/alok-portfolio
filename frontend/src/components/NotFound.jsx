import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Terminal } from "lucide-react";
import { EASE } from "@/motionKit";

export default function NotFound() {
  return (
    <main className="notfound" data-testid="notfound-page">
      <motion.div
        className="notfound-inner"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <p className="eyebrow"><span className="status-dot" /> Error 404</p>
        <h1 className="notfound-title" data-testid="notfound-code">
          Lost in <span className="grad-text">the cloud.</span>
        </h1>
        <p className="notfound-copy">
          This route was never provisioned — or it has since been deprecated.
          Let’s get you back to safe ground.
        </p>
        <div className="notfound-terminal">
          <Terminal size={14} /> <span>404 · route_not_found</span>
        </div>
        <Link to="/" className="button button-primary" data-testid="notfound-home-button">
          <Home size={16} /> Back to home
        </Link>
      </motion.div>
    </main>
  );
}
