import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@shared/utils/cn';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  className,
  children
}) => {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
};

interface SectionProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  className,
  children,
  id
}) => {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      {children}
    </section>
  );
};

interface NavbarProps {
  className?: string;
  children: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ className, children }) => {
  return (
    <nav className={cn('bg-white shadow-sm fixed top-0 left-0 right-0 z-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {children}
        </div>
      </div>
    </nav>
  );
};

interface FooterProps {
  className?: string;
  children: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({ className, children }) => {
  return (
    <footer className={cn('bg-gray-900 text-white py-12', className)}>
      {children}
    </footer>
  );
};

interface LogoProps {
  to?: string;
  children: React.ReactNode;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ to = '/', children, className }) => {
  return (
    <Link to={to} className={cn('text-2xl font-bold', className)}>
      {children}
    </Link>
  );
};
