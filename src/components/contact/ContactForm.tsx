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
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  description: string;
}

// Budget option definition
interface BudgetOption {
  id: string;
  label: string;
  value: string;
}

// Timeline option definition
interface TimelineOption {
  id: string;
  label: string;
  value: string;
}

// Form step interface
interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

// Particle effect component
const ParticleEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            i
          }`}
          className="absolute rounded-full bg-blue-500/10 blur-xl"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3 + 0.1,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            width: `${Math.random() * 300 + 50}px`,
            height: `${Math.random() * 300 + 50}px`,
          }}
        />
      ))}
    </div>
  );
};

// Form field component with improved shadcn/ui components
const FormField: React.FC<{
  id: string;
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
  id,
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
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1.5">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-gray-200 flex items-center gap-1.5"
        >
          {icon && <span className="text-blue-400">{icon}</span>}
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
      </div>

      <div className="relative">
        {type !== "textarea" ? (
          <Input
            type={type}
            id={id}
            name={id}
            className={`bg-gray-800/50 border ${
              error ? "border-red-500" : "border-gray-700"
            } text-white transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        ) : (
          <Textarea
            id={id}
            name={id}
            className={`bg-gray-800/50 border ${
              error ? "border-red-500" : "border-gray-700"
            } text-white min-h-[120px] transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
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
  // Define available services with descriptions
  const services: ServiceOption[] = [
    {
      id: "devops",
      label: "DevOps / CI/CD",
      icon: <Code size={20} />,
      description:
        "Automatyzacja procesów, zarządzanie infrastrukturą jako kod, ciągła integracja i wdrażanie.",
    },
    {
      id: "cloud",
      label: "Cloud Solutions",
      icon: <Cloud size={20} />,
      description:
        "Migracja do chmury, architektura chmurowa, optymalizacja kosztów, multi-cloud i hybrydowa chmura.",
    },
    {
      id: "security",
      label: "Security Services",
      icon: <Shield size={20} />,
      description:
        "Zabezpieczenia infrastruktury, audyty bezpieczeństwa, szyfrowanie, zarządzanie tożsamością i dostępem.",
    },
    {
      id: "servers",
      label: "Server Administration",
      icon: <Server size={20} />,
      description:
        "Zarządzanie serwerami, wirtualizacja, konfiguracja, optymalizacja wydajności, monitoring.",
    },
    {
      id: "monitoring",
      label: "Monitoring Solutions",
      icon: <Activity size={20} />,
      description:
        "Kompleksowy monitoring infrastruktury i aplikacji, alerty, dashboardy, analiza wydajności.",
    },
    {
      id: "consulting",
      label: "IT Consulting",
      icon: <Briefcase size={20} />,
      description:
        "Doradztwo w zakresie architektury IT, strategii technologicznych i transformacji cyfrowej.",
    },
  ];

  return (
    <div className="mb-8">
      <Label className="block text-sm font-medium text-gray-200 mb-3">
        Jakiego rodzaju usługi potrzebujesz?
      </Label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <TooltipProvider key={service.id}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <motion.div
                  className={`p-4 rounded-lg cursor-pointer transition-all backdrop-blur-sm ${
                    value === service.id
                      ? "bg-blue-500/20 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "bg-gray-800/50 border border-gray-700 hover:bg-gray-800/80 hover:border-gray-600"
                  }`}
                  onClick={() => onChange(service.id)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
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
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[200px] bg-gray-900 border-gray-700 text-white text-xs"
              >
                {service.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

// Budget selection component using shadcn/ui Select
const BudgetSelection: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  // Define budget options
  const budgetOptions: BudgetOption[] = [
    { id: "small", label: "Do 10 000 PLN", value: "small" },
    { id: "medium", label: "10 000 - 50 000 PLN", value: "medium" },
    { id: "large", label: "50 000 - 100 000 PLN", value: "large" },
    { id: "enterprise", label: "Powyżej 100 000 PLN", value: "enterprise" },
    { id: "undetermined", label: "Do ustalenia", value: "undetermined" },
  ];

  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium text-gray-200 mb-3">
        Preferowany budżet projektu
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 text-white">
          <SelectValue placeholder="Wybierz preferowany budżet" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          {budgetOptions.map((option) => (
            <SelectItem key={option.id} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Timeline selection component with improved badges
const TimelineSelection: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  // Define timeline options
  const timelineOptions: TimelineOption[] = [
    { id: "urgent", label: "Pilne (< 2 tygodnie)", value: "urgent" },
    { id: "month", label: "W ciągu miesiąca", value: "month" },
    { id: "quarter", label: "W tym kwartale", value: "quarter" },
    { id: "flexible", label: "Elastyczne", value: "flexible" },
  ];

  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium text-gray-200 mb-3">
        Preferowane ramy czasowe
      </Label>

      <div className="flex flex-wrap gap-3">
        {timelineOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant={value === option.id ? "default" : "outline"}
              className={`px-4 py-2 cursor-pointer text-sm ${
                value === option.id
                  ? "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500 text-blue-300"
                  : "bg-gray-800/50 hover:bg-gray-800/80 border-gray-700 text-gray-300"
              }`}
              onClick={() => onChange(option.id)}
            >
              <Calendar size={14} className="mr-1.5" />
              {option.label}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Progress bar component with animated steps
const ProgressBar: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={`step-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            className="flex flex-col items-center"
          >
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                index < currentStep
                  ? "bg-blue-500 text-white"
                  : index === currentStep
                  ? "bg-blue-500/20 border border-blue-500 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: index <= currentStep ? 1 : 0.8,
                opacity: index <= currentStep ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? (
                <CheckCircle2 size={16} />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </motion.div>
            <div
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
          </div>
        ))}
      </div>

      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

// Success animation component with confetti effect
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
      {/* Success checkmark animation */}
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/20"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.6, times: [0, 0.8, 1], ease: "easeOut" }}
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
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <title>Checkmark</title>
          <polyline points="20 6 9 17 4 12" />
        </motion.svg>
      </motion.div>

      {/* Success message */}
      <motion.h3
        className="text-2xl font-bold text-white mb-2 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Wiadomość wysłana!
      </motion.h3>

      <motion.p
        className="text-gray-300 mb-8 text-center max-w-md leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Dziękuję za kontakt. Odpowiem na Twoją wiadomość najszybciej jak to
        możliwe, zwykle w ciągu 24 godzin.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Button
          className="px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg text-white font-medium flex items-center gap-2"
          onClick={onReset}
        >
          <span>Wyślij kolejną wiadomość</span>
          <ArrowRight size={16} />
        </Button>
      </motion.div>

      {/* Confetti animation */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`confetti-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            i
          }`}
          className="fixed w-2 h-2 rounded-full pointer-events-none"
          style={{
            background: [
              "#4361EE",
              "#3A86FF",
              "#FF006E",
              "#FB5607",
              "#FFBE0B",
              "#06D6A0",
            ][Math.floor(Math.random() * 6)],
            top: "50%",
            left: "50%",
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
          }}
          animate={{
            x: Math.random() * 500 - 250,
            y: Math.random() * 500 - 150,
            scale: Math.random() * 1.5 + 0.5,
            opacity: [1, 0],
          }}
          transition={{
            duration: 2.5,
            delay: 0.3 + Math.random() * 0.5,
            ease: [0.1, 0.25, 0.5, 1],
          }}
        />
      ))}
    </motion.div>
  );
};

// Main contact form component
const ModernContactForm: React.FC = () => {
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
    <motion.div
      className="py-16 px-4 relative overflow-hidden isolate rounded-xl border border-gray-800 bg-gray-900/80 shadow-xl backdrop-blur-xl"
      id="contact"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background particles */}
      <ParticleEffect />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-indigo-950/20 pointer-events-none -z-10" />

      {/* Content overlay */}
      <div className="relative z-10">
        <div className="text-center mb-10">
          <motion.div
            className="inline-block mb-3 px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            KONTAKT
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-white mb-4 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
              Skontaktuj się ze mną
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Masz projekt do omówienia? Potrzebujesz wsparcia w zakresie DevOps
            lub architektury IT? Wypełnij formularz, a odpowiem najszybciej jak
            to możliwe.
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto relative">
          <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700/50 relative overflow-hidden">
            {/* Subtle light effect */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

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
                      <FormField
                        id="name"
                        label="Imię i nazwisko"
                        placeholder="Jan Kowalski"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        icon={<User size={16} />}
                        required
                      />

                      <FormField
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="jan@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        icon={<Mail size={16} />}
                        required
                      />

                      <FormField
                        id="phone"
                        label="Telefon"
                        placeholder="+48 123 456 789"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        icon={<Phone size={16} />}
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
                      <FormField
                        id="subject"
                        label="Temat"
                        placeholder="Temat wiadomości"
                        value={formData.subject}
                        onChange={handleChange}
                        error={errors.subject}
                        required
                      />

                      <FormField
                        id="message"
                        label="Wiadomość"
                        type="textarea"
                        placeholder="Opisz swój projekt, cele i oczekiwania..."
                        value={formData.message}
                        onChange={handleChange}
                        error={errors.message}
                        icon={<MessageSquare size={16} />}
                        required
                      />
                    </>
                  )}
                </motion.div>

                <div className="flex justify-between mt-8">
                  {currentStep > 0 ? (
                    <Button
                      variant="outline"
                      className="bg-gray-800/50 hover:bg-gray-700/70 text-white border-gray-700"
                      onClick={handlePrevStep}
                      disabled={isSubmitting}
                    >
                      Wstecz
                    </Button>
                  ) : (
                    <div /> // Empty div to maintain layout with justify-between
                  )}

                  <Button
                    className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all ${
                      isSubmitting ? "opacity-80" : ""
                    }`}
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
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
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Alternative contact methods */}
          <motion.div
            className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05, color: "#60a5fa" }}
            >
              <Mail size={16} />
              <span>kontakt@example.com</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05, color: "#60a5fa" }}
            >
              <Phone size={16} />
              <span>+48 123 456 789</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernContactForm;
