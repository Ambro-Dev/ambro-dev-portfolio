"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  Phone,
  XCircle,
  Briefcase,
  Calendar,
  Code,
  Cloud,
  Shield,
  Server,
  Activity,
} from "lucide-react";

// Form fields interface
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  budget: string;
  timeline: string;
  service: string;
}

// Form errors interface
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

// Service type definition
interface ServiceOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Budget option definition
interface BudgetOption {
  id: string;
  label: string;
}

// Timeline option definition
interface TimelineOption {
  id: string;
  label: string;
}

// Form step interface
interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

// Floating particle effect
const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={i}
          className="absolute rounded-full bg-blue-500/20 blur-sm"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
          }}
        />
      ))}
    </div>
  );
};

// Input field component
const InputField: React.FC<{
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}> = ({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}

        {type !== "textarea" ? (
          <input
            type={type}
            id={name}
            name={name}
            className={`w-full px-4 py-3 ${
              icon ? "pl-10" : "pl-4"
            } bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white ${
              error ? "border-red-500" : "border-gray-700"
            }`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        ) : (
          <textarea
            id={name}
            name={name}
            rows={5}
            className={`w-full px-4 py-3 ${
              icon ? "pl-10" : "pl-4"
            } bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white ${
              error ? "border-red-500" : "border-gray-700"
            }`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-xs mt-1 flex items-center gap-1"
            >
              <XCircle size={12} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Service selection component
const ServiceSelection: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  // Define available services
  const services: ServiceOption[] = [
    { id: "devops", label: "DevOps / CI/CD", icon: <Code size={20} /> },
    { id: "cloud", label: "Cloud Solutions", icon: <Cloud size={20} /> },
    { id: "security", label: "Security Services", icon: <Shield size={20} /> },
    {
      id: "servers",
      label: "Server Administration",
      icon: <Server size={20} />,
    },
    {
      id: "monitoring",
      label: "Monitoring Solutions",
      icon: <Activity size={20} />,
    },
    { id: "consulting", label: "IT Consulting", icon: <Briefcase size={20} /> },
  ];

  return (
    <div className="mb-6">
      <span className="block text-sm font-medium text-gray-300 mb-3">
        Jakiego rodzaju usługi potrzebujesz?
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service) => (
          <motion.div
            key={service.id}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              value === service.id
                ? "bg-blue-500/20 border border-blue-500"
                : "bg-gray-800/50 border border-gray-700 hover:bg-gray-800/80"
            }`}
            onClick={() => onChange(service.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  value === service.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {service.icon}
              </div>
              <span
                className={
                  value === service.id ? "text-blue-300" : "text-gray-300"
                }
              >
                {service.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Budget selection component
const BudgetSelection: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  // Define budget options
  const budgetOptions: BudgetOption[] = [
    { id: "small", label: "Do 10 000 PLN" },
    { id: "medium", label: "10 000 - 50 000 PLN" },
    { id: "large", label: "50 000 - 100 000 PLN" },
    { id: "enterprise", label: "Powyżej 100 000 PLN" },
    { id: "undetermined", label: "Do ustalenia" },
  ];

  return (
    <div className="mb-6">
      <span className="block text-sm font-medium text-gray-300 mb-3">
        Preferowany budżet projektu
      </span>

      <div className="flex flex-wrap gap-3">
        {budgetOptions.map((option) => (
          <motion.div
            key={option.id}
            className={`px-4 py-2 rounded-full cursor-pointer text-sm ${
              value === option.id
                ? "bg-blue-500/20 border border-blue-500 text-blue-300"
                : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800/80"
            }`}
            onClick={() => onChange(option.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Timeline selection component
const TimelineSelection: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  // Define timeline options
  const timelineOptions: TimelineOption[] = [
    { id: "urgent", label: "Pilne (< 2 tygodnie)" },
    { id: "month", label: "W ciągu miesiąca" },
    { id: "quarter", label: "W tym kwartale" },
    { id: "flexible", label: "Elastyczne" },
  ];

  return (
    <div className="mb-6">
      <span className="block text-sm font-medium text-gray-300 mb-3">
        Preferowane ramy czasowe
      </span>

      <div className="flex flex-wrap gap-3">
        {timelineOptions.map((option) => (
          <motion.div
            key={option.id}
            className={`px-4 py-2 rounded-full cursor-pointer text-sm flex items-center gap-2 ${
              value === option.id
                ? "bg-blue-500/20 border border-blue-500 text-blue-300"
                : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800/80"
            }`}
            onClick={() => onChange(option.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar size={14} />
            {option.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Progress bar component
const ProgressBar: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className={`text-xs font-medium ${
              index < currentStep
                ? "text-blue-400"
                : index === currentStep
                ? "text-white"
                : "text-gray-500"
            }`}
          >
            Krok {index + 1}
          </div>
        ))}
      </div>

      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

// Success animation component
const SuccessAnimation: React.FC<{
  onReset: () => void;
}> = ({ onReset }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, times: [0, 0.8, 1] }}
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <title>Checkmark</title>
          <polyline points="20 6 9 17 4 12" />
        </motion.svg>
      </motion.div>

      <motion.h3
        className="text-2xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Wiadomość wysłana!
      </motion.h3>

      <motion.p
        className="text-gray-300 mb-8 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Dziękuję za kontakt. Odpowiem na Twoją wiadomość najszybciej jak to
        możliwe, zwykle w ciągu 24 godzin.
      </motion.p>

      <motion.button
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
        onClick={onReset}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Wyślij kolejną wiadomość
      </motion.button>
    </motion.div>
  );
};

// Main contact form component
const EnhancedContactForm: React.FC = () => {
  // Form steps
  const formSteps: FormStep[] = [
    {
      id: "basic",
      title: "Podstawowe informacje",
      description:
        "Wprowadź swoje dane kontaktowe, abym mógł się z Tobą skontaktować.",
      fields: ["name", "email", "phone"],
    },
    {
      id: "project",
      title: "Informacje o projekcie",
      description: "Powiedz mi więcej o swoim projekcie i potrzebach.",
      fields: ["service", "budget", "timeline"],
    },
    {
      id: "details",
      title: "Szczegóły projektu",
      description: "Opisz dokładniej swój projekt i oczekiwania.",
      fields: ["subject", "message"],
    },
  ];

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    budget: "",
    timeline: "",
    service: "",
  });

  // Form errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Current step
  const [currentStep, setCurrentStep] = useState(0);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animation controls
  const formControls = useAnimation();

  // Form container ref for animation
  const formRef = useRef<HTMLDivElement>(null);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the field when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  // Handle service selection
  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  // Handle budget selection
  const handleBudgetChange = (value: string) => {
    setFormData((prev) => ({ ...prev, budget: value }));
  };

  // Handle timeline selection
  const handleTimelineChange = (value: string) => {
    setFormData((prev) => ({ ...prev, timeline: value }));
  };

  // Validate current step
  const validateStep = (): boolean => {
    const currentFields = formSteps[currentStep].fields;
    const newErrors: FormErrors = {};

    // Basic validation for required fields
    for (const field of currentFields) {
      if (field === "name" && !formData.name) {
        newErrors.name = "Imię i nazwisko jest wymagane";
      }

      if (field === "email") {
        if (!formData.email) {
          newErrors.email = "Email jest wymagany";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Nieprawidłowy format adresu email";
        }
      }

      if (field === "subject" && !formData.subject) {
        newErrors.subject = "Temat jest wymagany";
      }

      if (field === "message" && !formData.message) {
        newErrors.message = "Wiadomość jest wymagana";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Go to next step
  const handleNextStep = () => {
    if (validateStep()) {
      if (currentStep < formSteps.length - 1) {
        formControls
          .start({
            opacity: 0,
            x: -50,
            transition: { duration: 0.3 },
          })
          .then(() => {
            setCurrentStep((prev) => prev + 1);
            formControls.start({
              opacity: 1,
              x: 0,
              transition: { duration: 0.3 },
            });
          });
      } else {
        handleSubmit();
      }
    }
  };

  // Go to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      formControls
        .start({
          opacity: 0,
          x: 50,
          transition: { duration: 0.3 },
        })
        .then(() => {
          setCurrentStep((prev) => prev - 1);
          formControls.start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 },
          });
        });
    }
  };

  // Submit form
  const handleSubmit = () => {
    if (validateStep()) {
      setIsSubmitting(true);

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        console.log("Form submitted:", formData);
      }, 2000);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      budget: "",
      timeline: "",
      service: "",
    });
    setErrors({});
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  // Set initial animation
  useEffect(() => {
    formControls.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    });
  }, [formControls]);

  return (
    <div
      className="py-16 px-4 bg-gray-900 rounded-xl border border-gray-800 shadow-xl relative overflow-hidden"
      id="contact"
    >
      {/* Background particles */}
      <FloatingParticles />

      {/* Content overlay */}
      <div className="relative z-10">
        <div className="text-center mb-8">
          <motion.h2
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
              Skontaktuj się ze mną
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Masz projekt do omówienia? Potrzebujesz wsparcia w zakresie DevOps
            lub architektury IT? Wypełnij formularz, a odpowiem najszybciej jak
            to możliwe.
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700">
            {isSubmitted ? (
              <SuccessAnimation onReset={resetForm} />
            ) : (
              <>
                <ProgressBar
                  currentStep={currentStep}
                  totalSteps={formSteps.length}
                />

                <div className="mb-6 text-left">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {formSteps[currentStep].title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {formSteps[currentStep].description}
                  </p>
                </div>

                <motion.div
                  ref={formRef}
                  initial={{ opacity: 0, x: 50 }}
                  animate={formControls}
                >
                  {currentStep === 0 && (
                    <>
                      <InputField
                        name="name"
                        label="Imię i nazwisko"
                        placeholder="Jan Kowalski"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        icon={<User size={18} />}
                        required
                      />

                      <InputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="jan@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        icon={<Mail size={18} />}
                        required
                      />

                      <InputField
                        name="phone"
                        label="Telefon"
                        placeholder="+48 123 456 789"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        icon={<Phone size={18} />}
                      />
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <ServiceSelection
                        value={formData.service}
                        onChange={handleServiceChange}
                      />

                      <BudgetSelection
                        value={formData.budget}
                        onChange={handleBudgetChange}
                      />

                      <TimelineSelection
                        value={formData.timeline}
                        onChange={handleTimelineChange}
                      />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <InputField
                        name="subject"
                        label="Temat"
                        placeholder="Temat wiadomości"
                        value={formData.subject}
                        onChange={handleChange}
                        error={errors.subject}
                        required
                      />

                      <InputField
                        name="message"
                        label="Wiadomość"
                        type="textarea"
                        placeholder="Opisz swój projekt, cele i oczekiwania..."
                        value={formData.message}
                        onChange={handleChange}
                        error={errors.message}
                        icon={<MessageSquare size={18} />}
                        required
                      />
                    </>
                  )}
                </motion.div>

                <div className="flex justify-between mt-8">
                  {currentStep > 0 ? (
                    <motion.button
                      type="button"
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                      onClick={handlePrevStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSubmitting}
                    >
                      Wstecz
                    </motion.button>
                  ) : (
                    <div /> // Empty div to maintain layout with justify-between
                  )}

                  <motion.button
                    type="button"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg text-white flex items-center gap-2"
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        <span>Wysyłanie...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {currentStep === formSteps.length - 1
                            ? "Wyślij wiadomość"
                            : "Dalej"}
                        </span>
                        <Send size={16} />
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </div>

          {/* Alternative contact methods */}
          <motion.div
            className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>kontakt@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>+48 123 456 789</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedContactForm;
