// src/app/uslugi/[serviceId]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { serviceCategories, type ServiceCategory } from "@/data/services";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { TiltCard } from "@/components/ambro-ui/tilt-card";
import { ScrollProgress } from "@/components/ambro-ui/scroll-progress";
import { SectionDivider } from "@/components/ambro-ui/section-divider";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";
import { HighlightText } from "@/components/ambro-ui/highlight-text";
import { CodeBlock } from "@/components/ambro-ui/code-block";
import ServiceProcessSteps from "@/components/services/service-process-steps";
import ServiceBenefitsChart from "@/components/services/service-benefits-chart";
import ServiceCTA from "@/components/service-cta";
import ServiceComparisonTable from "@/components/services/service-comparison-table";
import ServiceTechStack from "@/components/services/service-tech-stack";

const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState<ServiceCategory[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Fetch service details based on URL param
  useEffect(() => {
    if (params?.serviceId) {
      const serviceId = Array.isArray(params.serviceId)
        ? params.serviceId[0]
        : params.serviceId;

      const foundService = serviceCategories.find((s) => s.id === serviceId);

      if (foundService) {
        setService(foundService);

        // Find related services from the same category
        const isDevOps =
          serviceId !== "webapps" && serviceId !== "architecture";
        const related = serviceCategories
          .filter((s) => {
            const sIsDevOps = s.id !== "webapps" && s.id !== "architecture";
            return s.id !== serviceId && sIsDevOps === isDevOps;
          })
          .slice(0, 3);

        setRelatedServices(related);
      }

      setIsLoading(false);
    }
  }, [params?.serviceId]);

  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // Function to determine primary and secondary colors
  const getPrimaryColor = () => {
    if (!service) return "indigo";

    const colorClasses = service.color.split(" ")[0];
    return colorClasses.replace("from-", "");
  };

  const getSecondaryColor = () => {
    if (!service) return "purple";

    const colorClasses = service.color.split(" ")[1];
    return colorClasses.replace("to-", "");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4">Usługa nie znaleziona</h1>
        <p className="mb-8 text-gray-400">
          Nie mogliśmy znaleźć szukanej usługi.
        </p>
        <Link href="/uslugi">
          <EnhancedButton variant="tech">
            Wróć do wszystkich usług
          </EnhancedButton>
        </Link>
      </div>
    );
  }

  const primaryColor = getPrimaryColor();
  const secondaryColor = getSecondaryColor();

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16 relative">
      {/* Progress bar */}
      <ScrollProgress
        position="top"
        color={`bg-gradient-to-r from-${primaryColor}-500 via-${secondaryColor}-500 to-${primaryColor}-500`}
      />

      {/* Hero Header */}
      <motion.div
        ref={headerRef}
        className="relative w-full h-[40vh] min-h-[300px] max-h-[500px] mb-16 overflow-hidden"
        style={{
          opacity: headerOpacity,
          scale: headerScale,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${
                primaryColor === "indigo"
                  ? "6366f1"
                  : primaryColor === "emerald"
                  ? "10b981"
                  : primaryColor === "pink"
                  ? "ec4899"
                  : "6366f1"
              }' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Service Icon */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg shadow-${primaryColor}-600/20`}
          >
            <service.icon className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Service Title */}
        <motion.div
          className="absolute bottom-10 left-0 right-0 text-center z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <GradientText
              from={primaryColor}
              to={secondaryColor}
              glowEffect
              glowIntensity={20}
            >
              {service.title}
            </GradientText>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto px-6">
            {service.description}
          </p>
        </motion.div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Navigation Bar */}
        <div className="mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-24 z-30 bg-gray-900/95 p-4 rounded-lg backdrop-blur-sm border border-gray-800/50 shadow-lg">
          <EnhancedButton variant="outline" size="sm" onClick={handleBack}>
            ← Wróć do wszystkich usług
          </EnhancedButton>

          <div className="flex flex-wrap gap-3">
            <a
              href="#overview"
              className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-gray-800/50"
            >
              Przegląd
            </a>
            <a
              href="#process"
              className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-gray-800/50"
            >
              Proces
            </a>
            <a
              href="#benefits"
              className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-gray-800/50"
            >
              Korzyści
            </a>
            <a
              href="#technology"
              className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-gray-800/50"
            >
              Technologie
            </a>
            <a
              href="#comparison"
              className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-gray-800/50"
            >
              Porównanie
            </a>
          </div>
        </div>

        {/* Overview Section */}
        <section id="overview" className="mb-20">
          <AnimatedSection animation="fadeIn">
            <SectionHeading
              title="Przegląd usługi"
              subtitle={`Wszystko co musisz wiedzieć o ${service.title}`}
              alignment="left"
              size="lg"
              gradient
              gradientFrom={primaryColor}
              gradientTo={secondaryColor}
              animation="slide"
              titleClassName="mb-4"
            />

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2">
                <Card3D
                  interactive={false}
                  glowEffect
                  glowColor={`rgba(${
                    primaryColor === "indigo"
                      ? "99, 102, 241"
                      : primaryColor === "emerald"
                      ? "16, 185, 129"
                      : primaryColor === "sky"
                      ? "14, 165, 233"
                      : primaryColor === "purple"
                      ? "168, 85, 247"
                      : primaryColor === "amber"
                      ? "245, 158, 11"
                      : primaryColor === "pink"
                      ? "236, 72, 153"
                      : "99, 102, 241"
                  }, 0.4)`}
                  shadow
                  bgColor="bg-gray-900/50"
                  borderColor={`border-${primaryColor}-500/30`}
                >
                  <div className="p-6">
                    <div className="prose prose-invert max-w-none">
                      <RevealText delay={0.3} staggerLines>
                        <p className="text-lg leading-relaxed">
                          {service.longDescription ||
                            `Usługa ${service.title} to kompleksowe rozwiązanie pozwalające na optymalizację procesów IT w Twojej firmie. Dzięki wieloletniemu doświadczeniu i wykorzystaniu najnowszych technologii, mogę zaoferować niezawodne i skalowalne rozwiązanie odpowiadające na potrzeby Twojego biznesu.`}
                        </p>
                        <p>
                          Wdrożenie tej usługi pozwala na znaczące zwiększenie
                          wydajności operacyjnej, redukcję kosztów utrzymania
                          infrastruktury oraz zapewnienie najwyższego poziomu
                          bezpieczeństwa. Każdy projekt jest realizowany z
                          uwzględnieniem indywidualnych wymagań klienta oraz
                          najlepszych praktyk branżowych.
                        </p>
                      </RevealText>

                      <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Dla kogo?</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            "Małe i średnie przedsiębiorstwa",
                            "Startupy technologiczne",
                            "Firmy rozwijające własne aplikacje",
                            "Przedsiębiorstwa z rozbudowaną infrastrukturą IT",
                          ].map((item, i) => (
                            <div
                              key={`audience-${
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                i
                              }`}
                              className="flex items-center gap-3"
                            >
                              <div
                                className={`w-8 h-8 rounded-full bg-${primaryColor}-900/30 flex items-center justify-center`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`w-4 h-4 text-${primaryColor}-400`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <title>User group</title>
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                                </svg>
                              </div>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </div>

              <div>
                <AnimatedGradientBorder
                  borderWidth={1}
                  borderColor={`from-${primaryColor}-500 via-${secondaryColor}-500 to-${primaryColor}-500`}
                  glowEffect
                  glowIntensity={5}
                  animated
                  backgroundColor="bg-gray-900/50"
                  className="h-full"
                >
                  <div className="p-6 h-full flex flex-col">
                    <h3 className="text-xl font-bold mb-6">Kluczowe funkcje</h3>
                    <ul className="space-y-4 flex-grow">
                      {service.bulletPoints.map(
                        (point: string, index: number) => (
                          <motion.li
                            key={`feature-${
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              index
                            }`}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <span
                              className={`w-6 h-6 rounded-full bg-${primaryColor}-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 text-${primaryColor}-400`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <title>Checkmark</title>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                            <span className="text-gray-300">{point}</span>
                          </motion.li>
                        )
                      )}
                    </ul>

                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <Link href="/kontakt" className="block">
                        <EnhancedButton
                          variant="tech"
                          size="md"
                          magneticEffect
                          glowOnHover
                          fullWidth
                        >
                          Zapytaj o szczegóły
                        </EnhancedButton>
                      </Link>
                    </div>
                  </div>
                </AnimatedGradientBorder>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <SectionDivider
          className="my-16"
          variant="tech"
          dotColor={`bg-${primaryColor}-500`}
        />

        {/* Process Section */}
        <section id="process" className="mb-20">
          <AnimatedSection animation="fadeIn">
            <SectionHeading
              title="Proces realizacji"
              subtitle="Jak wygląda wdrożenie usługi krok po kroku"
              alignment="left"
              size="lg"
              gradient
              gradientFrom={primaryColor}
              gradientTo={secondaryColor}
              animation="slide"
            />

            <div className="mt-8">
              <ServiceProcessSteps
                serviceId={service.id}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            </div>

            {/* Example Code Block (for technical services) */}
            {(service.id === "deployment" ||
              service.id === "infrastructure" ||
              service.id === "servers" ||
              service.id === "webapps") && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">
                  <HighlightText color={`bg-${primaryColor}-500/10`}>
                    Przykład implementacji
                  </HighlightText>
                </h3>

                <CodeBlock
                  code={
                    service.id === "deployment"
                      ? `// Przykładowy plik konfiguracyjny CI/CD (pipeline.yml)
name: Deployment Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build
      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: |
          echo "Deploying to staging environment"
          # Tutaj kod do wdrożenia na środowisko testowe
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: |
          echo "Deploying to production environment"
          # Tutaj kod do wdrożenia na środowisko produkcyjne`
                      : service.id === "infrastructure"
                      ? `# Przykładowy kod Terraform do tworzenia infrastruktury AWS
provider "aws" {
  region = "eu-central-1"
}

# Definicja sieci VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "main-vpc"
    Environment = "production"
  }
}

# Tworzenie subnets w różnych strefach dostępności
resource "aws_subnet" "public" {
  count = 3
  
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.20.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "public-subnet-24"
    Type = "Public"
  }
}

# Tworzenie grupy bezpieczeństwa
resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Allow web traffic"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Output ważnych wartości
output "vpc_id" {
  value = aws_vpc.main.id
}`
                      : service.id === "servers"
                      ? `# Przykładowy playbook Ansible do konfiguracji serwera
---
- name: Konfiguracja serwera produkcyjnego
  hosts: web_servers
  become: yes
  
  vars:
    app_name: example-app
    app_user: www-data
    app_dir: "/var/www/{{ app_name }}"
    
  tasks:
    - name: Instalacja wymaganych pakietów
      apt:
        name:
          - nginx
          - nodejs
          - npm
          - certbot
          - python3-certbot-nginx
        state: present
        update_cache: yes
      
    - name: Konfiguracja Nginx
      template:
        src: templates/nginx.conf.j2
        dest: "/etc/nginx/sites-available/{{ app_name }}"
      notify: restart nginx
      
    - name: Włączenie konfiguracji Nginx
      file:
        src: "/etc/nginx/sites-available/{{ app_name }}"
        dest: "/etc/nginx/sites-enabled/{{ app_name }}"
        state: link
      notify: restart nginx
      
    - name: Konfiguracja certyfikatu SSL
      command: certbot --nginx -d example.com -d www.example.com --non-interactive --agree-tos -m admin@example.com
      
    - name: Uruchomienie aplikacji
      systemd:
        name: "{{ app_name }}"
        state: started
        enabled: yes
        
  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted`
                      : `// Przykładowy kod React + TypeScript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <motion.div
            key={user.id}
            className="p-4 border rounded-lg shadow-sm"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;`
                  }
                  language={
                    service.id === "deployment" ||
                    service.id === "infrastructure" ||
                    service.id === "servers"
                      ? "yaml"
                      : "typescript"
                  }
                  fileName={
                    service.id === "deployment"
                      ? "pipeline.yml"
                      : service.id === "infrastructure"
                      ? "main.tf"
                      : service.id === "servers"
                      ? "server_config.yml"
                      : "UserDashboard.tsx"
                  }
                  showLineNumbers
                  theme="tech"
                  highlightLines={
                    service.id === "deployment" ? [10, 11, 19, 20, 21] : []
                  }
                  wrapLines
                  copyButton
                  rounded="rounded-lg"
                  maxHeight="400px"
                />
              </div>
            )}
          </AnimatedSection>
        </section>

        <SectionDivider
          className="my-16"
          variant="tech"
          dotColor={`bg-${primaryColor}-500`}
        />

        {/* Benefits Section */}
        <section id="benefits" className="mb-20">
          <AnimatedSection animation="fadeIn">
            <SectionHeading
              title="Korzyści dla biznesu"
              subtitle="Jakie wartości zyskuje Twoja firma"
              alignment="left"
              size="lg"
              gradient
              gradientFrom={primaryColor}
              gradientTo={secondaryColor}
              animation="slide"
            />

            <div className="mt-10">
              <ServiceBenefitsChart
                serviceId={service.id}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            </div>
          </AnimatedSection>
        </section>

        <SectionDivider
          className="my-16"
          variant="tech"
          dotColor={`bg-${primaryColor}-500`}
        />

        {/* Technology Section */}
        <section id="technology" className="mb-20">
          <AnimatedSection animation="fadeIn">
            <SectionHeading
              title="Wykorzystywane technologie"
              subtitle="Narzędzia i platformy używane w realizacji"
              alignment="left"
              size="lg"
              gradient
              gradientFrom={primaryColor}
              gradientTo={secondaryColor}
              animation="slide"
            />

            <div className="mt-10">
              <ServiceTechStack
                technologies={service.tags}
                primaryColor={primaryColor}
              />
            </div>
          </AnimatedSection>
        </section>

        <SectionDivider
          className="my-16"
          variant="tech"
          dotColor={`bg-${primaryColor}-500`}
        />

        {/* Comparison Section */}
        <section id="comparison" className="mb-20">
          <AnimatedSection animation="fadeIn">
            <SectionHeading
              title="Porównanie rozwiązań"
              subtitle="Dlaczego warto wybrać moje usługi"
              alignment="left"
              size="lg"
              gradient
              gradientFrom={primaryColor}
              gradientTo={secondaryColor}
              animation="slide"
            />

            <div className="mt-10">
              <ServiceComparisonTable
                serviceId={service.id}
                primaryColor={primaryColor}
              />
            </div>
          </AnimatedSection>
        </section>

        {/* CTA Section */}
        <section className="mb-20">
          <ServiceCTA
            serviceName={service.title}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mb-10">
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <SectionHeading
                title="Powiązane usługi"
                subtitle="Kompleksowe rozwiązania dla Twojego biznesu"
                alignment="left"
                size="lg"
                gradient
                gradientFrom={primaryColor}
                gradientTo={secondaryColor}
                animation="slide"
              />

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {relatedServices.map((relService) => (
                  <motion.div
                    key={relService.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={`/uslugi/${relService.id}`}
                      className="block h-full"
                    >
                      <TiltCard
                        className="h-full"
                        tiltAmount={5}
                        glareOpacity={0.1}
                        borderGlow={false}
                        backgroundEffect="gradient"
                      >
                        <div className="p-5 h-full">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${relService.color} flex items-center justify-center mb-4`}
                          >
                            <relService.icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold mb-2">
                            {relService.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {relService.description}
                          </p>
                        </div>
                      </TiltCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </section>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailPage;
