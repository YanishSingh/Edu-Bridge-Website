import React, { useState, useEffect, useRef } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaYoutube, FaAward, FaBuilding, FaHandshake, FaGlobe, FaPlane, FaUsers, FaGraduationCap, FaUniversity, FaFileAlt, FaClipboardCheck, FaComments, FaDollarSign, FaSuitcase, FaUserCheck, FaStar, FaCheckCircle, FaChevronDown, FaRegFileAlt, FaRegBuilding, FaRegClipboard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import NavigationBar from "../components/NavigationBar";
import HeroSearchBar from "../components/HeroSearchBar";
import { contentApi, API_ORIGIN } from "../utils/api";
import heroImageSvg from "../assets/images/hero-image.svg";
import formImage from "../assets/images/form-image.png";
import b2bImage from "../assets/images/b2b-image.png";
import logo from "../assets/images/logo.svg";

const SOCIAL_ICONS = [
  { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { Icon: FaTiktok, label: "TikTok", href: "https://tiktok.com" },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
  { Icon: FaYoutube, label: "YouTube", href: "https://youtube.com" },
];

// Fallback avatars (South Asian appearing – randomuser portraits)
const ALUMNI_AVATARS_FALLBACK = [
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/76.jpg",
  "https://randomuser.me/api/portraits/men/77.jpg",
  "https://randomuser.me/api/portraits/women/78.jpg",
];

const STATS = [
  { value: "26+", label: "Years of Excellence", Icon: FaAward },
  { value: "12", label: "Branches Worldwide", Icon: FaBuilding },
  { value: "100+", label: "Partnered Universities", Icon: FaHandshake },
  { value: "15+", label: "Countries to Choose From", Icon: FaGlobe },
  { value: "98%", label: "Visa Success Rate", Icon: FaPlane },
  { value: "10K+", label: "Success Stories", Icon: FaUsers },
];

const SERVICES = [
  { Icon: FaGraduationCap, title: "Career Counseling", desc: "Aligning your study path with long-term career aspirations and global market trends." },
  { Icon: FaUniversity, title: "University Selection", desc: "Finding the perfect match for your academic goals based on your profile and preferences." },
  { Icon: FaFileAlt, title: "Documentation Assistance", desc: "Expert help with documentation, interview preparation, and filing to ensure success." },
  { Icon: FaClipboardCheck, title: "Test Preparation", desc: "Comprehensive coaching for IELTS." },
  { Icon: FaComments, title: "Interview Preparation", desc: "Personalized coaching to excel in university and embassy interviews." },
  { Icon: FaDollarSign, title: "Scholarship Guidance", desc: "Identifying and applying for financial aid and scholarships to fund your education." },
  { Icon: FaSuitcase, title: "Pre-Departure Briefing", desc: "Comprehensive guidance on accommodation, travel, insurance, and cultural adaptation." },
  { Icon: FaUserCheck, title: "Post-Departure Assistance", desc: "Continuous support and resources after your arrival to help you settle in and thrive." },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Profile Assessment", desc: "We evaluate your academic background and interests to chart your path." },
  { step: 2, title: "University Selection", desc: "Select from top-ranked universities that match your profile." },
  { step: 3, title: "Application Filing", desc: "We handle the paperwork ensuring error-free application submission." },
  { step: 4, title: "Visa & Departure", desc: "Get your visa approved and fly to your dream destination." },
];

const STUDY_DESTINATIONS_FALLBACK = [
  "United Kingdom", "Canada", "Australia", "The United States", "Europe",
  "Uzbekistan", "UAE", "China", "India", "Bangladesh",
];

const EDUCATION_LEVELS = [
  "Foundation",
  "Diploma",
  "Undergraduate / Bachelor's",
  "Postgraduate / Master's",
  "PhD / Doctorate",
  "Other",
];

// Partner universities – logos for marquee (replace logo URLs with real assets as needed)
const UNIVERSITIES = [
  { name: "University of London", logo: "https://placehold.co/140x70/0F4570/white?text=UoL" },
  { name: "University of Melbourne", logo: "https://placehold.co/140x70/0F4570/white?text=UoM" },
  { name: "University of Toronto", logo: "https://placehold.co/140x70/0F4570/white?text=UoT" },
  { name: "Stanford University", logo: "https://placehold.co/140x70/0F4570/white?text=Stanford" },
  { name: "MIT", logo: "https://placehold.co/140x70/0F4570/white?text=MIT" },
  { name: "University of Sydney", logo: "https://placehold.co/140x70/0F4570/white?text=USyd" },
  { name: "McGill University", logo: "https://placehold.co/140x70/0F4570/white?text=McGill" },
  { name: "University of Manchester", logo: "https://placehold.co/140x70/0F4570/white?text=UoM" },
  { name: "Monash University", logo: "https://placehold.co/140x70/0F4570/white?text=Monash" },
  { name: "University of Birmingham", logo: "https://placehold.co/140x70/0F4570/white?text=UoB" },
];

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  interestedCountry: "",
  educationLevel: "",
  interestedCourse: "",
};

const FAQ_ITEMS = [
  { q: "When should I start applying for abroad studies?", a: "We recommend starting at least 12–18 months before your intended intake. This gives you time to shortlist universities, prepare for language tests (IELTS/TOEFL), gather documents, and meet application deadlines." },
  { q: "What documents do I need for a student visa?", a: "Typically you need: offer letter from the university, proof of funds, passport, academic transcripts, English test scores, and a valid visa application form. Requirements vary by country—our team will guide you through the exact checklist for your destination." },
  { q: "How do I choose the right country and university?", a: "Consider your course, budget, post-study work options, and lifestyle. We help you compare destinations, rankings, fees, and career outcomes so you can make an informed choice that fits your goals." },
  { q: "What are the English language requirements (IELTS/TOEFL)?", a: "Most universities require IELTS (often 6.0–7.0) or TOEFL. Some accept other tests like PTE. Minimum scores depend on the course and institution. We can advise on which test to take and support you with preparation resources." },
  { q: "Can I work while studying abroad?", a: "Yes, in most popular destinations (e.g. UK, Canada, Australia) students can work part-time during term and full-time during breaks, within set hours. Rules vary by country—we’ll explain what’s allowed for your chosen destination." },
];


const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
};
const staggerContainer = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function HomePage() {
  const [alumniAvatars, setAlumniAvatars] = useState(ALUMNI_AVATARS_FALLBACK);
  const [journeyForm, setJourneyForm] = useState(initialFormState);
  const [journeyFormErrors, setJourneyFormErrors] = useState({});
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [homeContent, setHomeContent] = useState(null);
  const scrollTargetRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const scrollAnimRef = useRef(null);
  const destinationsCardsRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const howItWorksRef = useRef(null);
  const destinationsRef = useRef(null);
  const formRef = useRef(null);
  const testimonialsRef = useRef(null);
  const universitiesRef = useRef(null);
  const partnerRef = useRef(null);
  const faqRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.1 });
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.1 });
  const destinationsInView = useInView(destinationsRef, { once: true, amount: 0.1 });
  const formInView = useInView(formRef, { once: true, amount: 0.1 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.1 });
  const universitiesInView = useInView(universitiesRef, { once: true, amount: 0.1 });
  const partnerInView = useInView(partnerRef, { once: true, amount: 0.1 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.1 });

  useEffect(() => {
    fetch("https://randomuser.me/api/?nat=in&results=4")
      .then((res) => res.json())
      .then((data) => {
        const urls = data.results?.map((u) => u.picture.large) ?? ALUMNI_AVATARS_FALLBACK;
        setAlumniAvatars(urls);
      })
      .catch(() => setAlumniAvatars(ALUMNI_AVATARS_FALLBACK));
  }, []);

  useEffect(() => {
    contentApi.getHome()
      .then(setHomeContent)
      .catch(() => setHomeContent(null));
  }, []);

  const statsList = homeContent?.stats?.length === 6
    ? STATS.map((s, i) => ({ ...s, value: homeContent.stats[i].value, label: homeContent.stats[i].label }))
    : STATS;
  const servicesList = homeContent?.services?.length
    ? homeContent.services.map((s, i) => ({ ...SERVICES[i % SERVICES.length], title: s.title, desc: s.description }))
    : SERVICES;
  const howItWorksList = homeContent?.howItWorksSteps?.length
    ? homeContent.howItWorksSteps.map((s, i) => ({ step: i + 1, title: s.title, desc: s.description }))
    : HOW_IT_WORKS;
  const studyDestinationsList = homeContent?.studyDestinations?.length
    ? homeContent.studyDestinations.map((d) => {
        const raw = (d && d.imageUrl != null && String(d.imageUrl).trim() !== '') ? String(d.imageUrl).trim() : null;
        let imageUrl = null;
        if (raw) {
          if (raw.startsWith('http')) imageUrl = raw;
          else if (raw.startsWith('/')) imageUrl = `${API_ORIGIN}${raw}`;
          else imageUrl = `${API_ORIGIN}/uploads/destinations/${raw}`;
        }
        return { name: (d && d.name) || '', imageUrl };
      })
    : STUDY_DESTINATIONS_FALLBACK.map((name) => ({ name, imageUrl: null }));
  const servicesSubtitle = homeContent?.servicesSubtitle ?? "What We Offer";
  const servicesHeading = homeContent?.servicesHeading ?? "Comprehensive Guidance For Your Journey";
  const servicesParagraph = homeContent?.servicesParagraph ?? "We support you at every step of your abroad journey, from choosing a course to landing in your dream country";
  const howItWorksHeading = homeContent?.howItWorksHeading ?? "How It Works";
  const howItWorksSubtitle = homeContent?.howItWorksSubtitle ?? "Your journey to international education in 4 simple steps.";
  const studyDestinationsHeading = homeContent?.studyDestinationsHeading ?? "Study Destinations";
  const studyDestinationsSubheading = homeContent?.studyDestinationsSubheading ?? "Explore opportunities in top educational hubs worldwide";

  const buildLogoImageUrl = (raw) => {
    if (!raw || String(raw).trim() === '') return null;
    const r = String(raw).trim();
    if (r.startsWith('http')) return r;
    if (r.startsWith('/')) return `${API_ORIGIN}${r}`;
    return `${API_ORIGIN}/uploads/destinations/${r}`;
  };
  const universityRow1 = (homeContent?.universityLogosRow1 || []).filter((d) => buildLogoImageUrl(d?.imageUrl));
  const universityRow2 = (homeContent?.universityLogosRow2 || []).filter((d) => buildLogoImageUrl(d?.imageUrl));
  const placeholderLogos = UNIVERSITIES.map((u) => ({ name: u.name, imageUrl: u.logo }));
  const universityRow1Display = universityRow1.length > 0 ? universityRow1 : (universityRow2.length > 0 ? [] : placeholderLogos);
  const universityRow2Display = universityRow2.length > 0 ? universityRow2 : [];

  useEffect(() => {
    const container = destinationsCardsRef.current;
    if (!container) return undefined;
    container.scrollLeft = 0;

    scrollTargetRef.current = container.scrollLeft;

    const animateScroll = () => {
      const { scrollWidth, clientWidth } = container;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);

      // apply velocity with friction
      scrollVelocityRef.current *= 0.92;
      const nextTarget = Math.min(
        maxScroll,
        Math.max(0, scrollTargetRef.current + scrollVelocityRef.current)
      );
      scrollTargetRef.current = nextTarget;

      const current = container.scrollLeft;
      const diff = scrollTargetRef.current - current;
      container.scrollLeft = current + diff * 0.18;
      const stillMoving = Math.abs(scrollVelocityRef.current) > 0.05 || Math.abs(diff) > 0.5;
      if (stillMoving) {
        scrollAnimRef.current = requestAnimationFrame(animateScroll);
      } else {
        container.scrollLeft = scrollTargetRef.current;
        scrollAnimRef.current = null;
      }
    };

    const handleDestinationsWheel = (event) => {
      const { scrollWidth, clientWidth } = container;
      if (scrollWidth <= clientWidth) return;

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;

      event.preventDefault();
      event.stopPropagation();

      scrollVelocityRef.current += delta * 0.65;
      if (!scrollAnimRef.current) {
        scrollAnimRef.current = requestAnimationFrame(animateScroll);
      }
    };

    container.addEventListener("wheel", handleDestinationsWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleDestinationsWheel);
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
    };
  }, []);

  const sanitizeInput = (value, maxLength = 1000) => {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
  };

  const handleJourneyFormChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    const maxLengths = {
      firstName: 100,
      lastName: 100,
      email: 255,
      phone: 20,
      address: 200,
      interestedCourse: 200,
    };
    if (maxLengths[name]) {
      sanitizedValue = sanitizeInput(value, maxLengths[name]);
    }
    setJourneyForm((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (journeyFormErrors[name]) {
      setJourneyFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateJourneyForm = () => {
    const errors = {};
    const { firstName, lastName, email, phone, address, interestedCountry, educationLevel } = journeyForm;

    if (!firstName?.trim()) errors.firstName = "First name is required.";
    else if (firstName.length > 100) errors.firstName = "First name must be 100 characters or less.";

    if (!lastName?.trim()) errors.lastName = "Last name is required.";
    else if (lastName.length > 100) errors.lastName = "Last name must be 100 characters or less.";

    if (!email?.trim()) errors.email = "Email is required.";
    else if (email.length > 255) errors.email = "Email must be 255 characters or less.";
    else if (!EMAIL_REGEX.test(email.trim())) errors.email = "Please enter a valid email address.";

    const digitsOnly = (phone || "").replace(/\D/g, "");
    if (!phone?.trim()) errors.phone = "Phone number is required.";
    else if (digitsOnly.length !== 10) errors.phone = "Phone number must be 10 digits.";
    else if (phone.length > 20) errors.phone = "Phone number must be 20 characters or less.";

    if (!address?.trim()) errors.address = "Address is required.";
    else if (address.length > 200) errors.address = "Address must be 200 characters or less.";

    if (!interestedCountry?.trim()) errors.interestedCountry = "Please select a country.";
    if (!educationLevel?.trim()) errors.educationLevel = "Please select a level of education.";

    if (journeyForm.interestedCourse && journeyForm.interestedCourse.length > 200) {
      errors.interestedCourse = "Interested course must be 200 characters or less.";
    }

    setJourneyFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleJourneySubmit = (e) => {
    e.preventDefault();
    if (!validateJourneyForm()) return;
    // TODO: send to backend or email service
    console.log("Journey form submitted:", journeyForm);
    setJourneyForm(initialFormState);
    setJourneyFormErrors({});
  };

  const toggleReviewExpanded = (i) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section className="w-full min-h-screen bg-white">
      {/* Hero only: white space on left/right (padding + max-width) */}
      <div className="pt-1 sm:pt-2 px-1 sm:px-2 w-full">
        <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[24px] border-t-[3px] sm:border-t-[4px] md:border-t-[5px] border-l-[3px] sm:border-l-[4px] md:border-l-[5px] border-r-[3px] sm:border-r-[4px] md:border-r-[5px] border-white bg-white flex flex-col" style={{ height: "calc(100vh - 8px)", minHeight: "600px" }}>
        {/* First view = 100vh: hero with notch bottom + social + alumni cards */}
        <div className="flex flex-col h-full relative">
          {/* Hero SVG with frame, rounded corners, and notch */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
            style={{ 
              backgroundImage: `url(${heroImageSvg})`,
              backgroundPosition: "center bottom",
              backgroundSize: "cover"
            }}
          />
          <NavigationBar transparent />

          <motion.div
            className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 md:pt-12 pb-4 md:pb-6 flex-1 min-h-0"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
          >
            <motion.h1
              className="max-w-4xl text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight px-2"
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Lorem ipsum dolor sit amet consectetur.
            </motion.h1>
            <motion.p
              className="mt-3 sm:mt-4 md:mt-6 max-w-3xl text-white/90 text-xs sm:text-sm md:text-base leading-relaxed px-2"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Lorem ipsum dolor sit amet consectetur. Aliquet sed adipiscing
              ultrices vulputate consectetur. Egestas rhoncus dictum ac nulla
              pulvinar ac risus vulputate consequat. Amet nibh rhoncus proin et
              malesuada commodo.
            </motion.p>
            <motion.div
              className="mt-6 sm:mt-8 md:mt-12 w-full max-w-5xl px-2"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <HeroSearchBar />
            </motion.div>
          </motion.div>

        {/* Social media icons and alumni - positioned on outside edges, 8px from notch */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-2 left-0 right-0 z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between px-3 sm:px-6 md:px-10 lg:px-14 gap-3 sm:gap-0">
          {/* Left – social media icons on outside left, rightmost icon 8px from center/notch */}
          <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-1" style={{ maxWidth: "calc(50% - 4px)" }}>
            {SOCIAL_ICONS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition-opacity"
                aria-label={label}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>
          {/* Right – alumni photos and text positioned 8px from right side of notch */}
          <div className="flex items-center gap-2 sm:gap-4 order-1 sm:order-2 mb-0 sm:mb-2" style={{ marginLeft: "0", marginBottom: "4px" }}>
            <div className="flex -space-x-2 sm:-space-x-4 flex-shrink-0">
              {alumniAvatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-lg object-cover"
                />
              ))}
            </div>
            <div>
              <div className="font-semibold text-xl sm:text-2xl md:text-[32px] text-black">10,000+</div>
              <div className="text-xs sm:text-sm md:text-[16px] text-gray-600">Trusted Students Alumni</div>
       </div>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Stats bar – full width, top padding only, segmented grid lines */}
      <section ref={statsRef} className="w-full bg-white pt-8 sm:pt-12 md:pt-16">
        <motion.div
          className="w-full bg-secondary relative py-8 sm:py-12 md:py-16"
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 w-full">
            {statsList.map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center justify-center py-4 sm:py-6 md:py-8 px-2 sm:px-4 text-white text-center"
                variants={staggerItem}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ scale: 1.02 }}
              >
                <item.Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-white" aria-hidden />
                <span className="text-xl sm:text-2xl md:text-3xl font-bold">{item.value}</span>
                <span className="text-xs sm:text-sm mt-0.5 sm:mt-1 font-normal px-1">{item.label}</span>
              </motion.div>
            ))}
          </div>
          {/* Segmented vertical lines (thin, do not touch horizontal line) */}
          <div className="absolute top-[15%] bottom-[15%] left-1/3 w-px bg-white/30 pointer-events-none" aria-hidden />
          <div className="absolute top-[15%] bottom-[15%] left-2/3 w-px bg-white/30 pointer-events-none" aria-hidden />
          {/* Segmented horizontal line (thicker, does not touch vertical lines) */}
          <div className="absolute left-[10%] right-[10%] top-1/2 h-0.5 -translate-y-1/2 bg-white/30 pointer-events-none" aria-hidden />
        </motion.div>
      </section>

      {/* What We Offer – light gray background, generous padding */}
      <section ref={servicesRef} className="w-full bg-gray-100 py-16 md:py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14 md:mb-16"
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              {servicesSubtitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 max-w-3xl mx-auto">
              {servicesHeading}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {servicesParagraph}
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {servicesList.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm"
                variants={staggerItem}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.12)" }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-secondary mb-1.5 sm:mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works – white background, consistent padding */}
      <section ref={howItWorksRef} className="w-full bg-white py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-3 md:mb-4 px-2">
              {howItWorksHeading}
            </h2>
            <p className="text-black text-sm sm:text-base max-w-2xl mx-auto px-2">
              {howItWorksSubtitle}
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {howItWorksList.map(({ step, title, desc }) => (
              <motion.div
                key={step}
                className="flex flex-col items-center text-center"
                variants={staggerItem}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                  <span className="text-white text-xl sm:text-2xl font-bold">{step}</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-secondary mb-1.5 sm:mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-black leading-relaxed px-2">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Study Destinations – normal section, horizontal scroll for cards */}
      <section ref={destinationsRef} className="w-full bg-gray-100 py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={destinationsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-2 sm:mb-3 md:mb-4 px-2">
            {studyDestinationsHeading}
          </h2>
          <p className="text-black text-sm sm:text-base text-center mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2">
            {studyDestinationsSubheading}
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16">
          <motion.div
            ref={destinationsCardsRef}
            initial={{ opacity: 0 }}
            animate={destinationsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-4 pr-2 sm:pr-4 md:pr-6 lg:pr-12 xl:pr-16 scrollbar-hide destinations-scroll"
          >
            {studyDestinationsList.map(({ name, imageUrl }, index) => (
              <a
                key={`${name}-${index}`}
                href={`/countries?q=${encodeURIComponent(name)}`}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden min-w-[180px] sm:min-w-[200px] md:min-w-[220px] h-[260px] sm:h-[300px] md:h-[340px] flex-shrink-0 bg-gray-300 shadow-lg block"
              >
                <img
                  src={imageUrl || `https://picsum.photos/600/400?random=${index}`}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  onError={(e) => {
                    if (e.target.src !== `https://picsum.photos/600/400?random=${index}`) {
                      e.target.src = `https://picsum.photos/600/400?random=${index}`;
                    }
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <h3 className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white font-semibold text-sm sm:text-base md:text-lg drop-shadow-md">
                  {name}
                </h3>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Begin your abroad study journey – student form */}
      <section ref={formRef} className="w-full bg-gray-50 py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={formInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-2 sm:mb-3 md:mb-4 px-2">
            Begin Your Abroad Study Journey With Us
          </h2>
          <p className="text-text text-sm sm:text-base text-center mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2">
            Share your details and we&apos;ll help you find the right path.
          </p>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Form – left */}
            <div className="min-w-0">
            <form
              onSubmit={handleJourneySubmit}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-text mb-1.5">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={journeyForm.firstName}
                    onChange={handleJourneyFormChange}
                    placeholder="Your first name"
                    maxLength={100}
                    className={`w-full px-4 py-2.5 rounded-lg border text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${journeyFormErrors.firstName ? "border-red-500" : "border-gray-200"}`}
                  />
                  {journeyFormErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{journeyFormErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-text mb-1.5">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={journeyForm.lastName}
                    onChange={handleJourneyFormChange}
                    placeholder="Your last name"
                    maxLength={100}
                    className={`w-full px-4 py-2.5 rounded-lg border text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${journeyFormErrors.lastName ? "border-red-500" : "border-gray-200"}`}
                  />
                  {journeyFormErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{journeyFormErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={journeyForm.email}
                    onChange={handleJourneyFormChange}
                    placeholder="you@example.com"
                    maxLength={255}
                    className={`w-full px-4 py-2.5 rounded-lg border text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${journeyFormErrors.email ? "border-red-500" : "border-gray-200"}`}
                  />
                  {journeyFormErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{journeyFormErrors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text mb-1.5">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={journeyForm.phone}
                    onChange={handleJourneyFormChange}
                    placeholder="Number must be 10 digit"
                    maxLength={20}
                    className={`w-full px-4 py-2.5 rounded-lg border text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${journeyFormErrors.phone ? "border-red-500" : "border-gray-200"}`}
                  />
                  {journeyFormErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{journeyFormErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-5">
                <label htmlFor="address" className="block text-sm font-medium text-text mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={journeyForm.address}
                  onChange={handleJourneyFormChange}
                  placeholder="City, country"
                  maxLength={200}
                  className={`w-full px-4 py-2.5 rounded-lg border text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${journeyFormErrors.address ? "border-red-500" : "border-gray-200"}`}
                />
                {journeyFormErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{journeyFormErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5">
                <div>
                  <label htmlFor="interestedCountry" className="block text-sm font-medium text-text mb-1.5">
                    Interested country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="interestedCountry"
                    name="interestedCountry"
                    value={journeyForm.interestedCountry}
                    onChange={handleJourneyFormChange}
                    className={`w-full px-4 py-2.5 rounded-lg border text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${journeyFormErrors.interestedCountry ? "border-red-500" : "border-gray-200"}`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D6212A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1.25rem", paddingRight: "2.5rem" }}
                  >
                    <option value="">Select a country</option>
                    {studyDestinationsList.map(({ name }) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  {journeyFormErrors.interestedCountry && (
                    <p className="text-red-500 text-xs mt-1">{journeyFormErrors.interestedCountry}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="educationLevel" className="block text-sm font-medium text-text mb-1.5">
                    Level of Education <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={journeyForm.educationLevel}
                    onChange={handleJourneyFormChange}
                    className={`w-full px-4 py-2.5 rounded-lg border text-text bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer ${journeyFormErrors.educationLevel ? "border-red-500" : "border-gray-200"}`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D6212A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1.25rem", paddingRight: "2.5rem" }}
                  >
                    <option value="">Select level</option>
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {journeyFormErrors.educationLevel && (
                    <p className="text-red-500 text-xs mt-1">{journeyFormErrors.educationLevel}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-5">
                <label htmlFor="interestedCourse" className="block text-sm font-medium text-text mb-1.5">
                  Interested course <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="interestedCourse"
                  name="interestedCourse"
                  value={journeyForm.interestedCourse}
                  onChange={handleJourneyFormChange}
                  placeholder="e.g. Computer Science, MBA"
                  maxLength={200}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full mt-6 md:mt-8 py-3 rounded-lg bg-primary text-white font-semibold text-sm md:text-base hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Submit
              </motion.button>
            </form>
            </div>

            {/* Image – right, vertically centered with form */}
            <div className="hidden lg:flex items-center justify-center flex-shrink-0">
              <img
                src={formImage}
                alt="Student planning abroad study"
                className="max-h-[480px] w-auto object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Google Reviews – testimonials */}
      <section ref={testimonialsRef} className="w-full bg-secondary py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden">
        {/* Background decorative elements – outlined icons */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <FaGraduationCap className="absolute top-[10%] left-[5%] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white/5 rotate-[-15deg] [&_path]:fill-none [&_path]:stroke-current [&_path]:stroke-[1.5]" />
          <FaAward className="absolute top-[15%] right-[8%] w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white/5 rotate-[10deg] [&_path]:fill-none [&_path]:stroke-current [&_path]:stroke-[1.5]" />
          <FaRegFileAlt className="absolute bottom-[20%] left-[3%] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white/5 rotate-[5deg]" />
          <FaGraduationCap className="absolute bottom-[15%] right-[6%] w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white/5 rotate-[-8deg] [&_path]:fill-none [&_path]:stroke-current [&_path]:stroke-[1.5]" />
          <FaRegBuilding className="absolute top-[50%] left-[2%] w-10 h-10 sm:w-14 sm:h-14 text-white/5 rotate-[-5deg]" />
          <FaRegClipboard className="absolute top-[45%] right-[4%] w-12 h-12 sm:w-16 sm:h-16 text-white/5 rotate-[12deg]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-2">
              What Our Students Say
            </h2>
            <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto px-2">
              Real experiences from students who chose Edu-Bridge for their abroad study journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {[
              {
                name: "Anup Shrestha",
                meta: "1 review",
                stars: 5,
                time: "4 weeks ago",
                text: "Innovative Solution, Communication was consistently clear, always available, transparent, and made a complex process feel simple and stress-free. Deep industry knowledge, giving us complete peace of mind. I clearly state to work with them again and recommend them. 🙏🙏",
              },
              {
                name: "Apsara Neupane",
                meta: "2 reviews",
                stars: 5,
                time: "A week ago",
                isNew: true,
                text: "They helped me with my entire abroad application process from start to finish with utter professionalism and care. I couldn't have asked for anything better!",
              },
              {
                name: "Dikshya Katwal",
                meta: "2 reviews",
                stars: 5,
                time: "4 months ago",
                text: "Professional and reliable consultancy. They provided clear guidance, quick responses, and helped me with the whole process smoothly. Highly recommended!",
              },
              {
                name: "Dibas Basyal",
                meta: "2 reviews",
                stars: 5,
                time: "3 days ago",
                isNew: true,
                text: "The only most helpful and genuine consultancy I have ever seen in chitwan and Kathmandu. As per my experience many consultancy misguided me and handling my applications carelessly but at the same time I got to know about edu bridge, and they helped me like more than my expectations. So I am very much lucky to get to know about edu bridge and made my application done through EDU BRIDGE. The most satisfying thing is their responses and staff behavior. So if anyone is facing hurdles in shaping their further abroad study, edu bridge is the most perfect place for everyone.",
              },
            ].map((review, i) => {
              const isExpanded = expandedReviews.has(i);
              const needsReadMore = review.text.length > 160;
              return (
                <motion.div
                  key={i}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border border-gray-100 flex flex-col"
                  variants={staggerItem}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary text-sm sm:text-base font-semibold">
                        {review.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text text-sm sm:text-base truncate">{review.name}</p>
                        <p className="text-xs sm:text-sm text-text-light">{review.meta}</p>
                      </div>
                    </div>
                    {review.isNew && (
                      <span className="flex-shrink-0 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: review.stars }).map((_, j) => (
                        <FaStar key={j} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-text-light">{review.time}</span>
                  </div>
                  <div className={needsReadMore && !isExpanded ? "min-h-[5.5rem] flex flex-col" : ""}>
                    <p
                      className={`text-text text-xs sm:text-sm md:text-base leading-relaxed ${needsReadMore && !isExpanded ? "line-clamp-3" : ""}`}
                    >
                      {review.text}
                    </p>
                    {needsReadMore && (
                      <button
                        type="button"
                        onClick={() => toggleReviewExpanded(i)}
                        className="mt-2 text-secondary font-medium text-xs sm:text-sm hover:underline self-start"
                      >
                        {isExpanded ? "Read less" : "Read more"}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Our Universities – two rows, opposite scroll */}
      <section ref={universitiesRef} className="w-full bg-gray-100 py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={universitiesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-2 sm:mb-3 md:mb-4 px-2">
            Proudly Representing Our Universities
          </h2>
          <p className="text-text text-center max-w-2xl mx-auto">
            Connect with world-class institutions through Edu-Bridge.
          </p>
        </motion.div>
        {(universityRow1Display.length > 0 || universityRow2Display.length > 0) && (
          <div className="relative w-full overflow-hidden space-y-4 sm:space-y-6">
            {universityRow1Display.length > 0 && (
              <div className="flex w-max animate-marquee-reverse gap-8 sm:gap-12 md:gap-16 pl-4 sm:pl-6 md:pl-12 lg:pl-16">
                {[...universityRow1Display, ...universityRow1Display].map((item, i) => (
                  <div
                    key={`row1-${i}-${item.name || i}`}
                    className="flex-shrink-0 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-5 h-16 sm:h-20 md:h-24 w-[120px] sm:w-[140px] md:w-[160px]"
                  >
                    <img
                      src={buildLogoImageUrl(item.imageUrl) || item.imageUrl}
                      alt={item.name || 'University'}
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
            {universityRow2Display.length > 0 && (
              <div className="flex w-max animate-marquee gap-8 sm:gap-12 md:gap-16 pl-4 sm:pl-6 md:pl-12 lg:pl-16">
                {[...universityRow2Display, ...universityRow2Display].map((item, i) => (
                  <div
                    key={`row2-${i}-${item.name || i}`}
                    className="flex-shrink-0 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-5 h-16 sm:h-20 md:h-24 w-[120px] sm:w-[140px] md:w-[160px]"
                  >
                    <img
                      src={buildLogoImageUrl(item.imageUrl) || item.imageUrl}
                      alt={item.name || 'University'}
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Become Our Partner – B2B section */}
      <section ref={partnerRef} className="w-full bg-gray-50 py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={partnerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Image – left */}
          <div className="hidden lg:flex items-center justify-center flex-shrink-0 order-2 lg:order-1">
            <img
              src={b2bImage}
              alt="Become our partner"
              className="max-h-[420px] w-auto object-contain"
            />
          </div>

          {/* Content – right */}
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-3 md:mb-4 px-2 lg:px-0">
              Become Our Partner
            </h2>
            <p className="text-text text-sm sm:text-base mb-6 sm:mb-8 md:mb-10 max-w-2xl px-2 lg:px-0">
              Join our network of institutions and agents with dedicated support and exclusive tools.
            </p>

            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                { title: "Access to Our Official Partner Portal", desc: "Manage applications, track progress, and access resources in one central dashboard." },
                { title: "Dedicated Relationship Manager", desc: "A single point of contact for personalised support and strategic guidance." },
                { title: "Exclusive Training & Resource Library", desc: "Training modules, marketing collateral, and compliance tools to grow your business." },
                { title: "Priority Support & Compliance Assistance", desc: "Priority assistance and guidance to meet regulatory and institutional requirements." },
              ].map((item, i) => (
                <li key={i} className="flex gap-2 sm:gap-3">
                  <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <span className="font-semibold text-text text-sm sm:text-base block">{item.title}</span>
                    <span className="text-text-light text-xs sm:text-sm md:text-base">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/partner"
                className="inline-block bg-secondary text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
              >
                Sign up as a partner
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FAQ – modern layout, numbered accordion */}
      <section ref={faqRef} className="w-full bg-gray-50 py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start"
          initial={{ opacity: 0, y: 24 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:sticky lg:top-24">
            <span className="inline-block text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-2 sm:mb-3 md:mb-4 leading-tight px-2 lg:px-0">
              Frequently Asked Questions
            </h2>
            <p className="text-text-light text-sm sm:text-base leading-relaxed px-2 lg:px-0">
              Got questions? We&apos;ve got answers. Top questions from students planning to study abroad.
            </p>
          </div>

          <div className="space-y-0">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`border-b border-gray-200/80 transition-colors ${faqOpenIndex === i ? "bg-white rounded-t-lg sm:rounded-t-xl shadow-sm" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setFaqOpenIndex(faqOpenIndex === i ? null : i)}
                  className="w-full flex items-start gap-2 sm:gap-3 md:gap-4 py-4 sm:py-5 md:py-6 text-left group px-1 sm:px-0"
                >
                  <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 text-primary font-semibold text-xs sm:text-sm flex items-center justify-center mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-semibold text-text text-xs sm:text-sm md:text-base group-hover:text-primary transition-colors pt-0.5">
                    {item.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary transition-all duration-200 ${faqOpenIndex === i ? "rotate-180 bg-primary/10" : "group-hover:bg-primary/5"}`}
                    aria-hidden
                  >
                    <FaChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {faqOpenIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-8 sm:pl-10 md:pl-12 lg:pl-14 pr-4 sm:pr-8 md:pr-12 lg:pr-14 pb-4 sm:pb-5 md:pb-6">
                        <p className="text-text-light text-xs sm:text-sm md:text-base leading-relaxed border-l-2 border-primary/30 pl-3 sm:pl-4">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </section>
  );
}
