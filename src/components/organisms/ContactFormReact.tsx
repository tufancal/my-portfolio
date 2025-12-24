import Input from "@/src/components/atoms/Input";
import Select, { type SelectOption } from "@/src/components/atoms/Select";
import Textarea from "@/src/components/atoms/Textarea";
import emailjs from "@emailjs/browser";
import { useRef, useState, type FormEvent } from "react";

export interface ContactFormProps {
  submitButtonText?: string;
  serviceId: string;
  templateId: string;
  publicKey: string;
}

interface FormData {
  name: string;
  email: string;
  website: string;
  package: string;
  budget: string;
  message: string;
  privacyAccepted: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  privacyAccepted?: string;
}

const packageOptions: SelectOption[] = [
  { value: "light", label: "💡 Light Paket (1.100 €)" },
  { value: "premium", label: "🚀 Premium Paket (2.200 €)" },
  { value: "business", label: "🧭 Business Paket (3.900 €)" },
  { value: "consultation", label: "Beratung nötig" },
];

const budgetOptions: SelectOption[] = [
  { value: "under-1500", label: "Unter 1.500 €" },
  { value: "2000-3000", label: "2.000–3.000 €" },
  { value: "4000-plus", label: "4.000 €+" },
  { value: "open", label: "Offen" },
];

export default function ContactFormReact({
  submitButtonText = "Anfrage senden",
  serviceId,
  templateId,
  publicKey,
}: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    website: "",
    package: "",
    budget: "",
    message: "",
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Bitte geben Sie Ihren Namen ein";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Bitte geben Sie Ihre E-Mail ein";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Bitte geben Sie eine gültige E-Mail ein";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Bitte geben Sie eine Nachricht ein";
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted =
        "Bitte akzeptieren Sie die Datenschutzerklärung";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || !formRef.current) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Send email using EmailJS - sendForm method uses the form element directly
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);

      setSubmitStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        website: "",
        package: "",
        budget: "",
        message: "",
        privacyAccepted: false,
      });
      setErrors({});
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
      {submitStatus === "success" && (
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Ich melde
            mich bald bei Ihnen.
          </span>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.
          </span>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Name / Firma"
          name="name"
          type="text"
          placeholder="Max Mustermann GmbH"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          aria-required="true"
        />

        <Input
          label="E-Mail"
          name="email"
          type="email"
          placeholder="mail@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          aria-required="true"
        />
      </div>

      <Input
        label="Aktuelle Webseite (falls vorhanden)"
        name="website"
        type="url"
        placeholder="https://www.example.com"
        value={formData.website}
        onChange={handleChange}
      />

      <Select
        label="Welches Paket passt am besten?"
        name="package"
        options={packageOptions}
        value={formData.package}
        onChange={handleChange}
      />

      <Select
        label="Projekt-Budget"
        name="budget"
        options={budgetOptions}
        value={formData.budget}
        onChange={handleChange}
      />

      <Textarea
        label="Nachricht"
        name="message"
        className="h-32"
        placeholder="Erzählen Sie mir kurz von Ihrem Projekt..."
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        required
        aria-required="true"
      />

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={handleChange}
            className="checkbox checkbox-primary"
            aria-required="true"
          />
          <span className="label-text">
            Ich habe die{" "}
            <a
              href="/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              Datenschutzerklärung
            </a>{" "}
            gelesen.
          </span>
        </label>
        {errors.privacyAccepted && (
          <div className="label-text-alt text-error">
            {errors.privacyAccepted}
          </div>
        )}
      </div>

      <div className="form-control">
        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Wird gesendet...
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
}
