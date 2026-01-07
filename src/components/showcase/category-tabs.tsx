import React from 'react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((tab) => (
        <button
          key={tab}
          onClick={() => onCategoryChange(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border border-border
            ${
              tab === activeCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};