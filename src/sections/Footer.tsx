import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Heart,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing! You will receive our latest updates.');
      setEmail('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Scroll to section on home page
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(href);
    }
  };

  const footerLinks = [
    { label: t('footer.links.shop'), href: '/products' },
    { label: t('footer.links.about'), href: '#about' },
    { label: t('footer.links.contact'), href: '#contact' },
    { label: t('footer.links.faq'), href: '#' },
    { label: t('footer.links.shipping'), href: '#' },
    { label: t('footer.links.returns'), href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  ];

  const handleSocialClick = (href: string, label: string) => {
    toast.info(`Follow us on ${label}!`, {
      description: 'Opening social media page...',
    });
    window.open(href, '_blank');
  };

  return (
    <footer id="contact" className="relative w-full bg-[#211e0f] text-white overflow-hidden">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="#211e0f"
          />
        </svg>
      </div>

      <div className="w-full section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663271387062/VF4RMPmDrzh3fniVRJQ8RL/ak-store-logo-5Bhifpi6HoyoBum9BqZXBB.webp" 
                alt="AK Store Logo" 
                className="h-12 w-auto" 
              />
            </Link>
            <p className="text-white/60 mb-6">
              Morocco's favorite kids fashion destination. Quality clothes for happy kids.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  onClick={() => handleSocialClick(social.href, social.label)}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center
                           hover:bg-[#f6b638] hover:rotate-[360deg] transition-all duration-500 group"
                >
                  <social.icon className="w-5 h-5 text-white group-hover:text-[#211e0f] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#f6b638] font-playfair">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center gap-2 text-white/60 hover:text-[#f6b638] transition-colors duration-300 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#f6b638] font-playfair">
              {t('footer.contact.title')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f6b638]/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#f6b638]" />
                </div>
                <a 
                  href={`tel:${t('footer.contact.phone').replace(/\D/g, '')}`}
                  className="text-white/60 hover:text-[#f6b638] transition-colors"
                >
                  {t('footer.contact.phone')}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f6b638]/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#f6b638]" />
                </div>
                <a 
                  href={`mailto:${t('footer.contact.email')}`}
                  className="text-white/60 hover:text-[#f6b638] transition-colors"
                >
                  {t('footer.contact.email')}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#f6b638]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#f6b638]" />
                </div>
                <span className="text-white/60">{t('footer.contact.address')}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#f6b638] font-playfair">
              {t('footer.newsletter.title')}
            </h3>
            <p className="text-white/60 mb-4">
              {t('footer.newsletter.description')}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40
                         focus:border-[#f6b638] focus:ring-[#f6b638]"
              />
              <Button
                type="submit"
                className="bg-[#f6b638] hover:bg-[#f58a1f] text-[#211e0f] px-4"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center sm:text-left">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>in Morocco</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
