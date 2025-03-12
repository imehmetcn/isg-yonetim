"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  FileText,
  Bell,
  Users,
  CheckCircle,
  Star,
  BookOpen,
  MessageCircle,
  Database,
  Link,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Testimonial component
const Testimonial = ({ text, author, role }: { text: string; author: string; role: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className="flex gap-2 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 mb-4">{text}</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

// Animated Counter Component
const AnimatedCounter = ({ end, label }: { end: number; label: string }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl font-bold text-blue-600 mb-2">
        <CountUp end={end} duration={2.5} separator="," start={0} />
        {end.toString().includes("+") && "+"}
      </div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
};

// FAQ Accordion Item Component
const AccordionItem = ({
  faq,
  isOpen,
  onClick,
}: {
  faq: any;
  isOpen: boolean;
  onClick: () => void;
}) => (
  <motion.div initial={false} className="border-b border-gray-200 py-4">
    <button className="flex justify-between items-start w-full text-left" onClick={onClick}>
      <div className="flex items-start">
        <HelpCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-1" />
        <h3 className="text-xl font-semibold text-gray-900">{faq.question}</h3>
      </div>
      <ChevronDown
        className={`h-6 w-6 text-blue-600 transform transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-gray-600 mt-4 ml-8">{faq.answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Scroll Progress Indicator
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = window.scrollY;
      setScrollProgress((currentProgress / totalScroll) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-left"
      style={{ scaleX: scrollProgress / 100 }}
    />
  );
};

// Enhanced Parallax Background
const ParallaxBg = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50"
        style={{
          y: scrollY * 0.5,
        }}
      />
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{
          y: scrollY * 0.3,
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          y: scrollY * 0.4,
        }}
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
    </div>
  );
};

// Mouse Gradient Effect Component
const MouseGradient = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 opacity-50"
      animate={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.05), transparent 40%)`,
      }}
    />
  );
};

// Enhanced Floating Element
const EnhancedFloatingElement = ({
  children,
  delay = 0,
  duration = 4,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{
      y: [0, -20, 0],
      rotateZ: [-1, 1, -1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay,
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const features = [
    {
      icon: Users,
      title: "Profesyonel Profil",
      description:
        "Çalıştığınız firmaları, uzmanlık alanlarınızı ve sertifikalarınızı içeren profesyonel profilinizi oluşturun.",
    },
    {
      icon: FileText,
      title: "Firma Bazlı Çalışma Alanları",
      description:
        "Her firma için ayrı çalışma alanı oluşturun, belgelerinizi düzenli bir şekilde yönetin.",
    },
    {
      icon: Shield,
      title: "Risk Değerlendirme Araçları",
      description:
        "Hazır şablonlar ve özelleştirilebilir formlarla risk değerlendirmelerinizi kolayca yapın.",
    },
    {
      icon: MessageCircle,
      title: "Uzman İletişim Ağı",
      description:
        "Diğer İSG uzmanlarıyla iletişim kurun, deneyimlerinizi paylaşın ve sorularınıza yanıt bulun.",
    },
    {
      icon: Bell,
      title: "Akıllı Hatırlatmalar",
      description: "Önemli tarihleri, eğitimleri ve periyodik kontrolleri asla kaçırmayın.",
    },
    {
      icon: Database,
      title: "Belge Arşivi",
      description: "Tüm İSG dokümanlarınızı kategorize edin, etiketleyin ve güvenle saklayın.",
    },
  ];

  const statistics = [
    { number: "5000+", label: "İSG Uzmanı" },
    { number: "15000+", label: "Yönetilen Firma" },
    { number: "100000+", label: "Saklanan Belge" },
    { number: "50000+", label: "Risk Değerlendirmesi" },
  ];

  const integrations = [
    {
      title: "İSG-KATİP",
      description: "Resmi İSG kayıtlarınızı otomatik senkronize edin",
    },
    {
      title: "Belge Şablonları",
      description: "Hazır form ve kontrol listeleri",
    },
    {
      title: "Mobil Erişim",
      description: "iOS ve Android uygulamaları ile her yerden erişim",
    },
    {
      title: "Veri Yedekleme",
      description: "Otomatik yedekleme ve güvenli depolama",
    },
  ];

  const faqs = [
    {
      question: "Platformu nasıl kullanmaya başlayabilirim?",
      answer:
        "Ücretsiz hesap oluşturarak hemen başlayabilirsiniz. Profil bilgilerinizi girdikten sonra firma çalışma alanlarınızı oluşturabilir ve belgelerinizi yüklemeye başlayabilirsiniz.",
    },
    {
      question: "Birden fazla firma için çalışma alanı oluşturabilir miyim?",
      answer:
        "Evet, platformumuzda sınırsız sayıda firma için ayrı çalışma alanları oluşturabilirsiniz. Her firma için özel belgeler, risk değerlendirmeleri ve takip sistemleri oluşturabilirsiniz.",
    },
    {
      question: "Belgelerimi diğer uzmanlarla paylaşabilir miyim?",
      answer:
        "Evet, platform üzerinden diğer İSG uzmanlarıyla güvenli bir şekilde belge paylaşımı yapabilirsiniz. Ayrıca şablonlarınızı toplulukla paylaşarak meslektaşlarınıza yardımcı olabilirsiniz.",
    },
    {
      question: "Verilerimizin güvenliği nasıl sağlanıyor?",
      answer:
        "Tüm verileriniz SSL şifreleme ile korunur ve düzenli olarak yedeklenir. KVKK uyumlu sistemimiz ile verileriniz maksimum güvenlik altındadır. İstediğiniz zaman verilerinizi indirebilir veya silebilirsiniz.",
    },
  ];

  const blogPosts = [
    {
      title: "İSG Uzmanları İçin Dijital Araçlar",
      date: "1 Mart 2024",
      description:
        "İş güvenliği süreçlerini kolaylaştıran modern teknolojiler ve kullanım önerileri",
    },
    {
      title: "Etkili Risk Değerlendirmesi Nasıl Yapılır?",
      date: "28 Şubat 2024",
      description: "Adım adım risk değerlendirme metodolojisi ve örnek uygulamalar",
    },
    {
      title: "İSG Belgelerini Dijital Ortamda Yönetmek",
      date: "25 Şubat 2024",
      description: "Belge yönetimi ipuçları ve en iyi uygulamalar",
    },
  ];

  const testimonials = [
    {
      text: "Farklı firmalardaki tüm İSG süreçlerimi tek platformdan yönetebiliyorum. Belge düzenim ve takibim artık çok daha kolay.",
      author: "Ahmet Yılmaz",
      role: "A Sınıfı İSG Uzmanı",
    },
    {
      text: "Diğer uzmanlarla iletişim kurabilmek ve deneyim paylaşabilmek çok değerli. Platform sayesinde harika bir topluluk oluştu.",
      author: "Ayşe Kaya",
      role: "B Sınıfı İSG Uzmanı",
    },
    {
      text: "Risk değerlendirme şablonları ve hazır formlar işimi çok kolaylaştırıyor. Zaman kazanmama yardımcı oluyor.",
      author: "Mehmet Demir",
      role: "C Sınıfı İSG Uzmanı",
    },
  ];

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <MouseGradient />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 sm:pt-20 pb-10">
        <ParallaxBg />

        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-10 sm:mt-0"
            >
              <EnhancedFloatingElement delay={0.5} duration={5}>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 relative">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-size-200 animate-gradient-x leading-tight mb-2 px-4 sm:px-0"
                  >
                    İSG Uzmanları için
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-size-200 animate-gradient-x leading-tight px-4 sm:px-0"
                  >
                    Profesyonel Platform
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="block text-xl sm:text-3xl md:text-4xl mt-4 text-gray-700 px-4 sm:px-0"
                  >
                    Tüm İSG süreçleriniz tek platformda
                  </motion.span>
                  <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-100/50 via-indigo-100/50 to-blue-100/50 rounded-full blur-3xl opacity-30 animate-pulse" />
                </h1>
              </EnhancedFloatingElement>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto px-6 sm:px-0"
            >
              İş Sağlığı ve Güvenliği uzmanları için özel olarak tasarlanmış ücretsiz platform.
              Belgelerinizi düzenleyin, değerlendirmelerinizi yapın, meslektaşlarınızla iletişim
              kurun.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12 px-6 sm:px-0"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-size-200 animate-gradient-x text-white transition-all duration-300 ease-in-out shadow-lg px-8 relative overflow-hidden group hover:shadow-blue-500/25 hover:shadow-2xl"
                  aria-label="Hemen Katıl"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-45"
                    initial={{ x: "100%" }}
                    whileHover={{ x: "-100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  Hemen Katıl
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 ease-in-out px-8 hover:shadow-lg backdrop-blur-sm"
                >
                  Nasıl Çalışır?
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mx-4 sm:mx-auto"
            >
              {[
                { icon: CheckCircle, text: "Tamamen Ücretsiz" },
                { icon: Users, text: "Profesyonel Profil" },
                { icon: FileText, text: "Belge Yönetimi" },
                { icon: Shield, text: "Güvenli Depolama" },
              ].map((item, index) => (
                <EnhancedFloatingElement key={index} delay={index * 0.2} duration={4 + index}>
                  <motion.div
                    className="text-center transform transition-all duration-300 hover:scale-105 group"
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 mb-3 mx-auto w-12 h-12 flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                    >
                      <item.icon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {item.text}
                    </p>
                  </motion.div>
                </EnhancedFloatingElement>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Enhanced Decorative Elements */}
        <motion.div
          className="absolute -bottom-10 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/50 to-white z-10"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </section>

      {/* Statistics Section with Enhanced Design */}
      <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <AnimatedCounter end={parseInt(stat.number)} label={stat.label} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Animations */}
      <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16 relative"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Neler Sunuyoruz?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              İş güvenliği süreçlerinizi dijitalleştirin, zaman kazanın ve daha verimli çalışın.
            </p>
            <motion.div
              className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4 group-hover:text-indigo-600 transition-colors duration-300" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Sistem Entegrasyonları
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Mevcut sistemlerinizle sorunsuz çalışır
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Link className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {integration.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{integration.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">Merak ettiklerinize hızlı cevaplar</p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                faq={faq}
                isOpen={openFaqIndex === index}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Blog ve Haberler</h2>
            <p className="text-lg sm:text-xl text-gray-600">İSG dünyasındaki son gelişmeler</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{post.description}</p>
                <Button variant="link" className="text-blue-600 p-0">
                  Devamını Oku
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Binlerce profesyonel İSG uzmanı platformumuzu tercih ediyor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              İSG Uzmanları Topluluğuna Katılın
            </h2>
            <p className="text-base sm:text-xl mb-8 max-w-2xl mx-auto">
              Ücretsiz hesap oluşturun, profesyonel ağınızı genişletin ve İSG süreçlerinizi dijital
              ortamda yönetmeye hemen başlayın.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100"
              >
                Hemen Üye Ol
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
              <div className="bg-white/20 rounded-lg p-4">
                <Users className="h-8 w-8 mx-auto mb-2 text-white" />
                <p className="text-sm">Ücretsiz Üyelik</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <Shield className="h-8 w-8 mx-auto mb-2 text-white" />
                <p className="text-sm">Güvenli Platform</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-white" />
                <p className="text-sm">Uzman Topluluğu</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
