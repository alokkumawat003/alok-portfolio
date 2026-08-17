import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { fadeUp, Magnetic, SectionHeading, staggerParent, viewportOnce } from "@/motionKit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR = "Something went wrong. Please email me directly instead.";

export default function Contact() {
  const formRef = useRef(null);
  const mountedAt = useRef(Date.now());
  const [status, setStatus] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const form = formRef.current;

    // Honeypot: bots fill hidden fields — silently accept and drop.
    if (form.company_website && form.company_website.value) {
      setStatus("Message sent — I’ll be in touch soon.");
      form.reset();
      return;
    }

    // Timing check: real humans take a few seconds to fill the form.
    if (Date.now() - mountedAt.current < 2500) {
      setStatus("Please take a moment, then send your message.");
      return;
    }

    const name = form.user_name.value.trim();
    const email = form.user_email.value.trim();
    const message = form.message.value.trim();

    if (name.length < 2 || name.length > 80) {
      setStatus("Please enter your name (2–80 characters).");
      return;
    }
    if (!EMAIL_RE.test(email) || email.length > 120) {
      setStatus("Please enter a valid email address.");
      return;
    }
    if (message.length < 10 || message.length > 1500) {
      setStatus("Your message should be between 10 and 1500 characters.");
      return;
    }

    const service = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const template = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const key = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    if (!service || !template || !key) {
      setStatus("Add EmailJS keys in frontend/.env to activate this form.");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(service, template, form, { publicKey: key });
      setStatus("Message sent — I’ll be in touch soon.");
      form.reset();
    } catch {
      setStatus(GENERIC_ERROR);
    }
  };

  return (
    <section id="contact" className="section contact-section" data-testid="contact-section">
      <motion.div className="container contact-grid" variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce}>
        <motion.div variants={fadeUp}>
          <SectionHeading index="07 / contact" compact>Let’s build<br /><span>what’s next.</span></SectionHeading>
          <p className="contact-copy">Open to conversations about Java, Cloud, DevOps, and the opportunities in between.</p>
          <div className="contact-details">
            <a href="mailto:alokkumawat2004@gmail.com" data-testid="email-link"><Mail size={17} /> alokkumawat2004@gmail.com</a>
            <a href="tel:+919782216089" data-testid="phone-link"><Phone size={17} /> +91 9782216089</a>
            <span data-testid="location-detail"><MapPin size={17} /> Jaipur, Rajasthan, India</span>
          </div>
          <div className="socials">
            <a href="https://www.linkedin.com/in/alok-kumawat-342511250/" target="_blank" rel="noreferrer" data-testid="linkedin-link"><Linkedin size={18} /></a>
            <a href="https://github.com/alokkumawat003" target="_blank" rel="noreferrer" data-testid="github-link"><Github size={18} /></a>
          </div>
        </motion.div>
        <motion.form className="contact-form" variants={fadeUp} ref={formRef} onSubmit={submit} noValidate data-testid="contact-form">
          <label>Your name<input name="user_name" required minLength={2} maxLength={80} placeholder="How should I call you?" data-testid="contact-name-input" /></label>
          <label>Your email<input name="user_email" type="email" required maxLength={120} placeholder="you@company.com" data-testid="contact-email-input" /></label>
          <label>Message<textarea name="message" required minLength={10} maxLength={1500} rows="4" placeholder="Tell me a little about the opportunity..." data-testid="contact-message-input" /></label>
          {/* Honeypot — hidden from humans, catches bots */}
          <input className="hp-field" type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <Magnetic as="button" className="button button-primary submit-button" type="submit" disabled={status === "sending"} data-testid="contact-submit-button">
            {status === "sending" ? "Sending..." : <>Send message <Send size={15} /></>}
          </Magnetic>
          {status && <p className={`form-status ${status.startsWith("Message") ? "success" : ""}`} role="status" data-testid="contact-form-status">{status}</p>}
        </motion.form>
      </motion.div>
    </section>
  );
}
