import React, { act } from "react";
import { createRoot } from "react-dom/client";
import emailjs from "@emailjs/browser";
import Contact from "@/components/Contact";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("@emailjs/browser", () => ({
  __esModule: true,
  default: { sendForm: jest.fn() },
}));

jest.mock("framer-motion", () => {
  const ReactModule = require("react");
  const components = new Map();
  const motion = new Proxy({}, {
    get: (_, tag) => {
      if (!components.has(tag)) {
        components.set(tag, ReactModule.forwardRef(({ variants, initial, whileInView, viewport, ...props }, ref) => ReactModule.createElement(tag, { ...props, ref })));
      }
      return components.get(tag);
    },
  });
  return { motion };
});

jest.mock("@/motionKit", () => {
  const ReactModule = require("react");
  return {
    ChapterHeading: ({ children }) => ReactModule.createElement("h2", null, children),
    Magnetic: ({ as: Component = "a", children, ...props }) => ReactModule.createElement(Component, props, children),
    reveal: {},
    stagger: {},
    viewportOnce: {},
  };
});

const setField = (container, name, value) => {
  const field = container.querySelector(`[name="${name}"]`);
  const prototype = field instanceof HTMLTextAreaElement
    ? HTMLTextAreaElement.prototype
    : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, "value").set.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
};

const submit = async (container) => {
  await act(async () => {
    container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
};

describe("Contact form", () => {
  let host;
  let root;

  beforeEach(async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    await act(async () => root.render(<Contact />));
    emailjs.sendForm.mockReset();
    delete process.env.REACT_APP_EMAILJS_SERVICE_ID;
    delete process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    delete process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
  });

  test("rejects an empty form before any network request", async () => {
    await submit(host);
    expect(host.querySelector("[data-testid='contact-form-status']").textContent).toContain("Please enter your name");
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  test("rejects an invalid email before any network request", async () => {
    setField(host, "user_name", "Alok Test");
    setField(host, "user_email", "not-an-email");
    setField(host, "message", "A valid message with enough characters.");
    await submit(host);
    expect(host.querySelector("[data-testid='contact-form-status']").textContent).toContain("valid email address");
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  test("does not fake success when delivery is not configured", async () => {
    setField(host, "user_name", "Alok Test");
    setField(host, "user_email", "test@example.com");
    setField(host, "message", "A valid message with enough characters.");
    await submit(host);
    const status = host.querySelector("[data-testid='contact-form-status']");
    expect(status.textContent).toContain("not configured yet");
    expect(status.classList.contains("is-success")).toBe(false);
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  test("locks duplicates and shows success only after EmailJS resolves", async () => {
    process.env.REACT_APP_EMAILJS_SERVICE_ID = "service";
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID = "template";
    process.env.REACT_APP_EMAILJS_PUBLIC_KEY = "public";
    let resolveSend;
    emailjs.sendForm.mockReturnValue(new Promise((resolve) => { resolveSend = resolve; }));
    setField(host, "user_name", "Alok Test");
    setField(host, "user_email", "test@example.com");
    setField(host, "message", "A valid message with enough characters.");

    await act(async () => {
      const form = host.querySelector("form");
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
    expect(host.querySelector("[data-testid='contact-form-status']").textContent).toContain("Transmitting");

    await act(async () => resolveSend({ status: 200 }));
    expect(host.querySelector("[data-testid='contact-form-status']").textContent).toContain("Message sent");
    expect(host.querySelector("[data-testid='contact-form-status']").classList.contains("is-success")).toBe(true);
  });

  test("keeps form values and reports an error when EmailJS rejects delivery", async () => {
    process.env.REACT_APP_EMAILJS_SERVICE_ID = "service";
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID = "template";
    process.env.REACT_APP_EMAILJS_PUBLIC_KEY = "public";
    emailjs.sendForm.mockResolvedValue({ status: 500 });
    setField(host, "user_name", "Alok Test");
    setField(host, "user_email", "test@example.com");
    setField(host, "message", "A valid message that must remain after failure.");

    await submit(host);
    await act(async () => Promise.resolve());

    const status = host.querySelector("[data-testid='contact-form-status']");
    expect(status.textContent).toContain("could not be sent");
    expect(status.classList.contains("is-success")).toBe(false);
    expect(host.querySelector("[name='message']").value).toContain("must remain");
  });
});
