import Input from "@/src/components/atoms/Input";
import Select, { type SelectOption } from "@/src/components/atoms/Select";
import Textarea from "@/src/components/atoms/Textarea";
import emailjs from "@emailjs/browser";
import { useRef, useState, type FormEvent } from "react";

export interface ProjectIntakeFormProps {
  submitButtonText?: string;
  serviceId: string;
  templateId: string;
  publicKey: string;
}

interface FormData {
  sender_name: string;
  sender_email: string;
  company_industry: string;
  target_audience: string;
  services: string;
  contact_info: string;
  call_to_action: string;
  material_available: string;
  style_reference: string;
  domain_available: string;
  additional_notes: string;
  privacy_accepted: boolean;
  withdrawal_accepted: boolean;
}

interface FormErrors {
  sender_name?: string;
  sender_email?: string;
  company_industry?: string;
  target_audience?: string;
  services?: string;
  contact_info?: string;
  call_to_action?: string;
  material_available?: string;
  domain_available?: string;
  privacy_accepted?: string;
  withdrawal_accepted?: string;
}

const yesNoOptions: SelectOption[] = [
  { value: "ja", label: "Ja" },
  { value: "nein", label: "Nein" },
];

const initialFormData: FormData = {
  sender_name: "",
  sender_email: "",
  company_industry: "",
  target_audience: "",
  services: "",
  contact_info: "",
  call_to_action: "",
  material_available: "",
  style_reference: "",
  domain_available: "",
  additional_notes: "",
  privacy_accepted: false,
  withdrawal_accepted: false,
};

export default function ProjectIntakeFormReact({
  submitButtonText = "Angaben senden",
  serviceId,
  templateId,
  publicKey,
}: ProjectIntakeFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sender_name.trim()) {
      newErrors.sender_name = "Bitte gib deinen Namen ein";
    }

    if (!formData.sender_email.trim()) {
      newErrors.sender_email = "Bitte gib deine E-Mail ein";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sender_email)) {
      newErrors.sender_email = "Bitte gib eine gültige E-Mail ein";
    }

    if (!formData.company_industry.trim()) {
      newErrors.company_industry =
        "Bitte beschreibe Firmenname und Branche";
    }

    if (!formData.target_audience.trim()) {
      newErrors.target_audience = "Bitte beschreibe deine Zielgruppe";
    }

    if (!formData.services.trim()) {
      newErrors.services = "Bitte nenne deine wichtigsten Leistungen";
    }

    if (!formData.contact_info.trim()) {
      newErrors.contact_info = "Bitte gib die Kontaktdaten an";
    }

    if (!formData.call_to_action.trim()) {
      newErrors.call_to_action = "Bitte gib die gewünschte Aktion an";
    }

    if (!formData.material_available.trim()) {
      newErrors.material_available = "Bitte triff eine Auswahl";
    }

    if (!formData.domain_available.trim()) {
      newErrors.domain_available = "Bitte triff eine Auswahl";
    }

    if (!formData.privacy_accepted) {
      newErrors.privacy_accepted =
        "Bitte akzeptiere die Datenschutzerklärung";
    }

    if (!formData.withdrawal_accepted) {
      newErrors.withdrawal_accepted =
        "Bitte bestätige die Zustimmung zum vorzeitigen Vertragsbeginn";
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
      setFormData(initialFormData);
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
    setSubmitStatus("idle");
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isConfigMissing = !serviceId || !templateId || !publicKey;

  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={handleSubmit}
      noValidate
    >
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
            Vielen Dank! Deine Angaben wurden erfolgreich gesendet. Ich melde
            mich bald mit den nächsten Schritten bei dir.
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
            Ein Fehler ist aufgetreten. Bitte versuche es später erneut.
          </span>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Dein Name"
          name="sender_name"
          type="text"
          placeholder="Max Mustermann"
          value={formData.sender_name}
          onChange={handleChange}
          error={errors.sender_name}
          required
          aria-required="true"
        />

        <Input
          label="Deine E-Mail"
          name="sender_email"
          type="email"
          placeholder="mail@example.com"
          value={formData.sender_email}
          onChange={handleChange}
          error={errors.sender_email}
          required
          aria-required="true"
        />
      </div>

      <Textarea
        label="Firmenname & Branche"
        name="company_industry"
        className="h-24"
        placeholder="z. B. Mustermann GmbH – wir sind ein Handwerksbetrieb für ..."
        helperText="Was macht ihr genau? 1–2 Sätze reichen."
        value={formData.company_industry}
        onChange={handleChange}
        error={errors.company_industry}
        required
        aria-required="true"
      />

      <Textarea
        label="Zielgruppe"
        name="target_audience"
        className="h-24"
        placeholder="Wer soll über die Seite angesprochen werden?"
        value={formData.target_audience}
        onChange={handleChange}
        error={errors.target_audience}
        required
        aria-required="true"
      />

      <Textarea
        label="Wichtigste Leistungen/Angebote"
        name="services"
        className="h-24"
        placeholder="Stichpunktartig, max. 3–5"
        helperText="Stichpunktartig, max. 3–5"
        value={formData.services}
        onChange={handleChange}
        error={errors.services}
        required
        aria-required="true"
      />

      <Textarea
        label="Kontaktdaten für die Seite"
        name="contact_info"
        className="h-24"
        placeholder="Telefon, E-Mail, Adresse, Öffnungszeiten"
        helperText="Was soll davon auf der Seite sichtbar sein?"
        value={formData.contact_info}
        onChange={handleChange}
        error={errors.contact_info}
        required
        aria-required="true"
      />

      <Input
        label="Call-to-Action"
        name="call_to_action"
        type="text"
        placeholder="z. B. Anrufen, WhatsApp, Termin buchen, Formular ausfüllen …"
        helperText="Was soll der Besucher tun?"
        value={formData.call_to_action}
        onChange={handleChange}
        error={errors.call_to_action}
        required
        aria-required="true"
      />

      <div>
        <Select
          label="Material vorhanden?"
          name="material_available"
          options={yesNoOptions}
          helperText="Logo, Fotos, Texte?"
          value={formData.material_available}
          onChange={handleChange}
          error={errors.material_available}
          required
          aria-required="true"
        />
        {formData.material_available === "ja" && (
          <div className="alert alert-info mt-3">
            <span>
              Schick mir Logo, Fotos & Texte am besten direkt per E-Mail
              oder WhatsApp – über das Formular können leider keine Dateien
              verschickt werden.
            </span>
          </div>
        )}
      </div>

      <Input
        label="Stil-Referenz"
        name="style_reference"
        type="text"
        placeholder="Link zu einer Seite, die dir gefällt (oder 'keine Präferenz')"
        value={formData.style_reference}
        onChange={handleChange}
      />

      <div>
        <Select
          label="Domain vorhanden?"
          name="domain_available"
          options={yesNoOptions}
          value={formData.domain_available}
          onChange={handleChange}
          error={errors.domain_available}
          required
          aria-required="true"
        />
        {formData.domain_available === "nein" && (
          <div className="alert alert-info mt-3">
            <span>
              Kein Problem – ich übernehme die Registrierung für dich.
              Zusatzkosten: +120 €/Jahr für die Domain.
            </span>
          </div>
        )}
      </div>

      <Textarea
        label="Sonstiges / Wünsche"
        name="additional_notes"
        className="h-24"
        placeholder="Freitext..."
        value={formData.additional_notes}
        onChange={handleChange}
      />

      <div className="form-control">
        <label className="label cursor-pointer items-start justify-start gap-3 whitespace-normal!">
          <input
            type="checkbox"
            name="privacy_accepted"
            value="Ja"
            checked={formData.privacy_accepted}
            onChange={handleChange}
            className="checkbox checkbox-primary mt-1"
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
        {errors.privacy_accepted && (
          <div className="label-text-alt text-error">
            {errors.privacy_accepted}
          </div>
        )}
      </div>

      <div className="form-control">
        <label className="label cursor-pointer items-start justify-start gap-3 whitespace-normal!">
          <input
            type="checkbox"
            name="withdrawal_accepted"
            value="Ja"
            checked={formData.withdrawal_accepted}
            onChange={handleChange}
            className="checkbox checkbox-primary mt-1"
            aria-required="true"
          />
          <span className="label-text">
            Ich stimme ausdrücklich zu, dass mit der Ausführung der
            Webdesign-Dienstleistung vor Ablauf der 14-tägigen
            Widerrufsfrist begonnen wird. Mir ist bekannt, dass mein
            Widerrufsrecht bei vollständiger Erfüllung des Vertrags
            erlischt.
          </span>
        </label>
        {errors.withdrawal_accepted && (
          <div className="label-text-alt text-error">
            {errors.withdrawal_accepted}
          </div>
        )}
      </div>

      <div className="form-control">
        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          disabled={isSubmitting || isConfigMissing}
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
        {isConfigMissing && (
          <p className="text-base-content/60 mt-2 text-center text-sm">
            Formular ist noch nicht vollständig konfiguriert.
          </p>
        )}
      </div>
    </form>
  );
}
