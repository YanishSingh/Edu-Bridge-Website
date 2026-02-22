# Edu-Bridge Frontend Design Plan

## Design Philosophy
- **Minimal & Professional**: Clean layouts with ample whitespace
- **Color Harmony**: Professional color palette reflecting Edu-Bridge brand
- **Consistent UI/UX**: Reusable components with clear visual hierarchy
- **Fully Responsive**: Mobile-first approach for all screen sizes
- **Smooth Animations**: Subtle Framer Motion animations for enhanced UX

## Color Scheme
- **Primary**: Deep Blue/Navy (Trust, Professionalism)
- **Secondary**: Accent color (CTA buttons, highlights)
- **Neutral**: Grays for text and backgrounds
- **White**: Clean backgrounds and contrast

## Typography
- **Headings**: Bold, clear hierarchy (H1 > H2 > H3)
- **Body**: Readable sans-serif font
- **Sizes**: Responsive typography scale

## Component Structure

### 1. Navigation Bar
- **Desktop**: Horizontal menu with logo, main nav items, login/CTA button
- **Mobile**: Hamburger menu with slide-out drawer
- **Sticky**: Fixed at top on scroll
- **Features**: 
  - Logo (left)
  - Navigation links (Home, About, Services, Countries, News, Contact)
  - Login/User menu (right)
  - Mobile responsive hamburger

### 2. Home Page Sections

#### Hero Section
- **Layout**: Full-width with background image/gradient
- **Content**: 
  - Main headline
  - Subheading/description
  - Primary CTA button
  - Secondary CTA (optional)
- **Animation**: Fade-in and slide-up on load

#### Featured Destinations
- **Layout**: Grid of country cards (3-4 columns desktop, 1-2 mobile)
- **Content**: Country flag, name, key highlights
- **Interaction**: Hover effects, click to country page
- **Animation**: Stagger fade-in

#### Testimonials
- **Layout**: Carousel/slider or grid
- **Content**: Student photo, quote, name, destination
- **Animation**: Smooth transitions

#### Quick CTAs
- **Layout**: Horizontal cards or buttons
- **Content**: "Apply Now", "Book Consultation", "Download Brochure"
- **Design**: Prominent, accessible

#### Latest Events/News Highlights
- **Layout**: Card grid (2-3 columns)
- **Content**: Event image, title, date, excerpt
- **Interaction**: Click to full news/event page
- **Animation**: Hover lift effect

## Layout Structure
```
<App>
  <NavigationBar />
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/countries" element={<CountriesPage />} />
    <Route path="/news" element={<NewsPage />} />
    <Route path="/contact" element={<ContactPage />} />
  </Routes>
  <Footer />
</App>
```

## Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Animation Guidelines
- **Entrance**: Fade + slide (subtle, not distracting)
- **Hover**: Scale, shadow, color transitions
- **Page Transitions**: Smooth fade between routes
- **Loading**: Skeleton screens or subtle spinners

## Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states visible
- Alt text for images
- Proper heading hierarchy

