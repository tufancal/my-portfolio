import { useState, useRef, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import Input from "@/src/components/atoms/Input";
import Textarea from "@/src/components/atoms/Textarea";
import Select, { type SelectOption } from "@/src/components/atoms/Select";

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
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
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
      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      setSubmitStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        website: "",
        package: "",
        budget: "",
        message: "",
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
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
      {/* Success Message */}
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

      {/* Error Message */}
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
        {/* Name/Firma */}
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

        {/* E-Mail */}
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

      {/* Aktuelle Webseite */}
      <Input
        label="Aktuelle Webseite (falls vorhanden)"
        name="website"
        type="url"
        placeholder="https://www.example.com"
        value={formData.website}
        onChange={handleChange}
      />

      {/* Welches Paket */}
      <Select
        label="Welches Paket passt am besten?"
        name="package"
        options={packageOptions}
        value={formData.package}
        onChange={handleChange}
      />

      {/* Projekt-Budget */}
      <Select
        label="Projekt-Budget"
        name="budget"
        options={budgetOptions}
        value={formData.budget}
        onChange={handleChange}
      />

      {/* Nachricht */}
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

      {/* Submit Button */}
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
