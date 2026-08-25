import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { PROFILE } from "@/data/portfolio";
import { ChapterHeading, Magnetic, reveal, stagger, viewportOnce } from "@/motionKit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAILJS_OK = 200;
const INITIAL_STATUS = { type: "idle", message: "" };

const errorStatus = (message) => ({ type: "error", message });

export default function Contact() {
  const formRef = useRef(null);
  const submittingRef = useRef(false);
  const [status, setStatus] = useState(INITIAL_STATUS);

  const rejectSubmission = (message, field) => {
    setStatus(errorStatus(message));
    field?.focus();
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = formRef.current;

    if (!form || submittingRef.current) return;

    if (form.company_website?.value) {
      rejectSubmission("Message could not be sent. Please refresh the page and try again.");
      return;
    }

    const name = form.user_name.value.trim();
    const email = form.user_email.value.trim();
    const message = form.message.value.trim();
    if (name.length < 2 || name.length > 80) {
      rejectSubmission("Please enter your name (2–80 characters).", form.user_name);
      return;
    }
    if (!EMAIL_RE.test(email) || email.length > 120) {
      rejectSubmission("Please enter a valid email address.", form.user_email);
      return;
    }
    if (message.length < 10 || message.length > 1500) {
      rejectSubmission("Your message should be between 10 and 1500 characters.", form.message);
      return;
    }

    form.user_name.value = name;
    form.user_email.value = email;
    form.message.value = message;

    const service = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const template = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    if (!service || !template || !publicKey) {
      rejectSubmission(`Message delivery is not configured yet. Please email me at ${PROFILE.email}.`);
      return;
    }

    submittingRef.current = true;
    setStatus({ type: "sending", message: "Transmitting your message…" });
    try {
      const response = await emailjs.sendForm(service, template, form, { publicKey });
      if (response.status !== EMAILJS_OK) throw response;

      setStatus({ type: "success", message: "Message sent — I’ll be in touch soon." });
      form.reset();
    } catch (error) {
      const message = error?.status === 429
        ? "Too many attempts. Please wait a moment and try again."
        : `Message could not be sent. Please try again or email me at ${PROFILE.email}.`;
      setStatus(errorStatus(message));
    } finally {
      submittingRef.current = false;
    }
  };

  const isSending = status.type === "sending";

  return (
    <section id="contact" className="chapter contact-runtime" data-testid="contact-section">
      <div className="chapter-frame container">
        <ChapterHeading
          number="07"
          eyebrow="Open channel / direct"
          description="Open to full-time opportunities and conversations about Cloud, DevOps, Java, and practical software systems."
        >Initialize<br />a conversation.</ChapterHeading>

        <div className="contact-layout">
          <motion.div className="contact-channel" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={reveal}>DIRECT COORDINATES / VERIFIED</motion.p>
            <motion.a variants={reveal} href={`mailto:${PROFILE.email}`} data-testid="email-link"><Mail size={17} /><span>{PROFILE.email}</span><ArrowUpRight /></motion.a>
            <motion.a variants={reveal} href={PROFILE.phoneHref} data-testid="phone-link"><Phone size={17} /><span>{PROFILE.phoneDisplay}</span><ArrowUpRight /></motion.a>
            <motion.div variants={reveal} data-testid="location-detail"><MapPin size={17} /><span>{PROFILE.location}</span></motion.div>
            <motion.div className="contact-socials" variants={reveal}>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="Alok Kumawat on LinkedIn" data-testid="linkedin-link"><Linkedin size={18} /> LinkedIn</a>
              <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="Alok Kumawat on GitHub" data-testid="github-link"><Github size={18} /> GitHub</a>
            </motion.div>
          </motion.div>

          <motion.form
            className="contact-form ph-no-capture"
            ref={formRef}
            onSubmit={submit}
            noValidate
            aria-busy={isSending}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            data-testid="contact-form"
          >
            <motion.label variants={reveal}><span>01 / Your name</span><input name="user_name" required minLength={2} maxLength={80} placeholder="How should I call you?" data-testid="contact-name-input" /></motion.label>
            <motion.label variants={reveal}><span>02 / Your email</span><input name="user_email" type="email" required maxLength={120} placeholder="you@company.com" data-testid="contact-email-input" /></motion.label>
            <motion.label variants={reveal}><span>03 / Message</span><textarea name="message" required minLength={10} maxLength={1500} rows="4" placeholder="Tell me a little about the opportunity..." data-testid="contact-message-input" /></motion.label>
            <input className="hp-field" type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <motion.div variants={reveal}>
              <Magnetic as="button" className="runtime-action is-primary submit-action" type="submit" disabled={isSending} aria-disabled={isSending} data-testid="contact-submit-button">
                {isSending ? "TRANSMITTING..." : <>TRANSMIT MESSAGE <Send size={16} /></>}
              </Magnetic>
            </motion.div>
            {status.message ? (
              <p
                className={`form-status ${status.type === "success" ? "is-success" : ""}`}
                role={status.type === "error" ? "alert" : "status"}
                aria-live={status.type === "error" ? "assertive" : "polite"}
                data-testid="contact-form-status"
              >
                {status.message}
              </p>
            ) : null}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
