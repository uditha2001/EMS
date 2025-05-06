import { useState, useEffect } from 'react';
import {
  GraduationCap,
  FileCheck,
  Database,
  Shield,
  ChevronRight,
  Target,
  CheckCircle,
  Star,
  History,
  MessageSquare,
  UserCheck,
  Calendar,
  ArrowRight,
  Users,
  Code,
  LayoutDashboard,
  ScrollText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LearnMore = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isScrolling, setIsScrolling] = useState(false);

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    setIsScrolling(true);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
    setTimeout(() => setIsScrolling(false), 1000);
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const sections = ['overview', 'features', 'team', 'technology'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  const developmentFeatures = [
    {
      icon: UserCheck,
      title: 'User Management',
      description:
        'Comprehensive role-based access control system with distinct permissions.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: FileCheck,
      title: 'Paper Setting',
      description:
        'Collaborative platform for exam creation, review, and approval workflows.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Calendar,
      title: 'Exam Scheduling',
      description:
        'Advanced timetable management with conflict detection and notifications.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Star,
      title: 'Grading System',
      description:
        'Automated grading with multiple assessment types and result calculation.',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: History,
      title: 'Data Management',
      description:
        'Secure storage and retrieval system for past papers and results.',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: MessageSquare,
      title: 'Analytics',
      description:
        'Comprehensive dashboard for performance tracking and feedback.',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  const teamMembers = [
    {
      name: 'G.D. Senevirathna',
      role: 'Project Manager',
      id: 'SC/2021/12369',
      image: '/images/team/gimhana.jpg',
    },
    {
      name: 'H.U.I. Hettiarachchi',
      role: 'Version Control Lead',
      id: 'SC/2021/12353',
      image: '/images/team/uditha.jpg',
    },
    {
      name: 'K.D.C.I. Geethanjalie',
      role: 'Documentation Lead',
      id: 'SC/2021/12415',
      image: '/images/team/irosha.jpg',
    },
    {
      name: 'M.N.M. Aathif',
      role: 'Developer',
      id: 'SC/2021/12358',
      image: '/images/team/athif.jpg',
    },
    {
      name: 'W.M.U.T. Wanninayaka',
      role: 'Developer',
      id: 'SC/2021/12446',
      image: '/images/team/timasha.jpg',
    },
  ];

  const supervisors = [
    {
      name: 'Dr. K.D.C.G Kapugama',
      role: 'Senior Lecturer (Grade II)',
      id: 'Supervisor',
      image: '/images/team/charaka.png',
    },
    {
      name: 'Ms. I. Nadisha Madhushanie',
      role: 'Lecturer (Probationay)',
      id: 'Supervisor',
      image: '/images/team/nadeesha.png',
    },
  ];

  const technologies = [
    { name: 'Spring Boot', icon: Code, category: 'Backend' },
    { name: 'ReactJS', icon: LayoutDashboard, category: 'Frontend' },
    { name: 'MySQL', icon: Database, category: 'Database' },
    { name: 'AES Encryption', icon: Shield, category: 'Security' },
    { name: 'Spring Security', icon: Shield, category: 'Security' },
    { name: 'REST API', icon: ScrollText, category: 'Backend' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation Bar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-[#3c50e0]" />

              <Link to="/">
                <span className="font-bold text-xl">EMS</span>
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              {['overview', 'features', 'team', 'technology'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize font-medium transition-colors ${
                    activeSection === item
                      ? 'text-[#3c50e0]'
                      : 'text-gray-600 hover:text-[#3c50e0]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              className="bg-[#3c50e0] hover:bg-[#2c40d0] text-white px-4 py-2 rounded transition-colors"
              onClick={() => (window.location.href = '/login')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-[#3c50e0] to-[#5670ef] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Exam Management System</h1>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Streamlining academic assessments for the Department of Computer
              Science, University of Ruhuna
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => scrollToSection('features')}
                className="bg-white hover:bg-gray-100 text-[#3c50e0] font-medium py-3 px-8 rounded-lg transition-all shadow-lg flex items-center justify-center"
              >
                Explore Features <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('team')}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg transition-all flex items-center justify-center"
              >
                Meet the Team <Users className="ml-2 w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Overview Section */}
        <section id="overview" className="py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[#3c50e0]">
                Project Overview
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                The Exam Management System (EMS) is designed to centralize and
                streamline exam-related activities with secure data-sharing and
                role-based access control.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <div className="flex items-start gap-5">
                  <div className={`p-3 rounded-lg bg-blue-100 text-blue-600`}>
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Our Goal</h3>
                    <p className="text-gray-600">
                      To establish a secure, efficient, and streamlined exam
                      management system tailored for departmental needs while
                      reducing administrative overhead.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <div className="flex items-start gap-5">
                  <div className={`p-3 rounded-lg bg-green-100 text-green-600`}>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Key Objectives
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-center gap-3">
                        <ChevronRight className="w-5 h-5 text-[#3c50e0]" />
                        Robust user management systems
                      </li>
                      <li className="flex items-center gap-3">
                        <ChevronRight className="w-5 h-5 text-[#3c50e0]" />
                        Efficient collaboration tools
                      </li>
                      <li className="flex items-center gap-3">
                        <ChevronRight className="w-5 h-5 text-[#3c50e0]" />
                        Automated grading processes
                      </li>
                      <li className="flex items-center gap-3">
                        <ChevronRight className="w-5 h-5 text-[#3c50e0]" />
                        Streamlined scheduling
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section - Tree Visualization */}
        <section id="features" className="py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[#3c50e0]">
                Core Features
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Explore the powerful capabilities of our Exam Management System
              </p>
            </div>

            <div className="relative">
              {/* Tree trunk - now properly positioned */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full transform -translate-x-1/2"></div>

              {/* Features grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {developmentFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all ${
                      index % 2 === 0 ? 'mt-8' : ''
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${feature.color} w-max mb-5`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[#3c50e0]">
                Our Team
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                The talented individuals behind the Exam Management System
              </p>
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Supervisors
              </h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {supervisors.map((supervisor, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mx-auto mb-4">
                      <img
                        src={supervisor.image}
                        alt={supervisor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-lg text-[#3c50e0] mb-1">
                      {supervisor.name}
                    </h4>
                    <p className="text-gray-500 mb-2">{supervisor.role}</p>
                    <div className="bg-[#3c50e0]/10 text-[#3c50e0] text-sm py-1 px-3 rounded-full inline-block">
                      {supervisor.id}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Development Team - Group 11
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mx-auto mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-800 font-medium mb-1">
                      {member.name}
                    </p>
                    <p className="text-gray-500 text-sm mb-2">{member.id}</p>
                    <div className="bg-[#3c50e0]/10 text-[#3c50e0] text-xs py-1 px-2 rounded-full">
                      {member.role}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Technology Stack */}
        <section id="technology" className="py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-[#3c50e0]">
                Technology Stack
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                The modern technologies powering our Exam Management System
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[#3c50e0]/10 text-[#3c50e0]">
                      <tech.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{tech.name}</h3>
                      <p className="text-gray-500 text-sm">{tech.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#3c50e0] py-12 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
                <span className="font-bold text-xl">EMS</span>
              </div>
              <p className="text-white/80">
                Department of Computer Science, University of Ruhuna
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Navigation</h4>
              <ul className="space-y-2">
                {['overview', 'features', 'team', 'technology'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item)}
                      className="text-white/80 hover:text-white capitalize"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <p className="text-white/80">Email: ems@cs.ruh.ac.lk</p>
              <p className="text-white/80">Phone: +94 41 222 2681</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.sci.ruh.ac.lk/computer/"
                    className="text-white/80 hover:text-white"
                  >
                    Department Website
                  </a>
                </li>
                <li>
                  <a
                    href="http://scilms.ruh.ac.lk/science/login/index.php"
                    className="text-white/80 hover:text-white"
                  >
                    LMS
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ruh.ac.lk/index.php/en/"
                    className="text-white/80 hover:text-white"
                  >
                    University Website
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/80">
            <p>
              © 2025 Department of Computer Science, University of Ruhuna. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;
