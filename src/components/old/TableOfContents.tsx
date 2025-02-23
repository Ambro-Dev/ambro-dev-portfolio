"use client";

import type React from "react";

interface TableOfContentsProps {
  structure: {
    title: string;
    display: boolean;
    items: string[];
  }[];
  about: {
    tableOfContent: {
      display: boolean;
      subItems: boolean;
    };
  };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  structure,
  about,
}) => {
  const scrollTo = (id: string, offset: number) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (!about.tableOfContent.display) return null;

  return (
    <nav className="fixed left-0 top-1/2 -translate-y-1/2 pl-6 space-y-8 whitespace-nowrap hidden lg:block">
      {structure
        .filter((section) => section.display)
        .map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
              onClick={() => scrollTo(section.title, 80)}
            >
              <div className="h-px w-4 bg-gray-400"></div>
              <span>{section.title}</span>
            </div>
            {about.tableOfContent.subItems && (
              <div className="pl-6 space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => scrollTo(item, 80)}
                  >
                    <div className="h-px w-2 bg-gray-400"></div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </nav>
  );
};

export default TableOfContents;
