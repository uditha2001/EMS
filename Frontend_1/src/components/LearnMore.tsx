import {
  GraduationCap,
  FileCheck,
  Database,
  Shield,
  ChevronRight,
  Target,
  CheckCircle,
  Star,
  Book,
  BarChart,
  History,
  MessageSquare,
  UserCheck,
} from 'lucide-react';

const LearnMore = () => {
  const developmentFeatures = [
    {
      icon: UserCheck,
      title: 'User Management',
      description:
        'Comprehensive role-based access control system with distinct permissions for administrators, lecturers, and moderators. Features user authentication, profile management, and secure password handling.',
    },
    {
      icon: FileCheck,
      title: 'Paper Setting and Moderation',
      description:
        'Collaborative platform for exam creation, review, and approval workflows. Includes version control, comment system, and automated validation checks.',
    },
    {
      icon: Star,
      title: 'Grading and Result Management',
      description:
        'Automated grading system with support for multiple assessment types, result calculation, and grade moderation. Includes appeal handling and result publication features.',
    },
    {
      icon: History,
      title: 'Historical Data Management',
      description:
        'Secure storage and retrieval system for past papers, results, and assessment data. Features advanced search capabilities and data archival processes.',
    },
    {
      icon: MessageSquare,
      title: 'Feedback and Analytics',
      description:
        'Comprehensive analytics dashboard for performance tracking, trend analysis, and feedback collection. Generates detailed reports for continuous improvement.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header Section */}
      <div className="pt-16 pb-12 text-center">
        <GraduationCap className="w-16 h-16 mx-auto text-blue-400 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Exam Management System</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto px-6">
          Department of Computer Science, University of Ruhuna
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* Overview Section */}
        <div className="bg-white/5 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">
            Project Overview
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8">
            The Exam Management System (EMS) is designed to centralize and
            streamline exam-related activities within the Department of Computer
            Science. Our system integrates secure data-sharing mechanisms and
            role-based access control to enhance productivity while ensuring
            data integrity.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Goal</h3>
                  <p className="text-gray-400">
                    To establish a secure, efficient, and streamlined exam
                    management system tailored for departmental needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Key Objectives</h3>
                  <ul className="text-gray-400 space-y-2">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Develop robust user management systems
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Facilitate efficient collaboration
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Automate grading processes
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Features */}
        <h2 className="text-2xl font-semibold mb-6 text-blue-400">
          Development Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {developmentFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-6 backdrop-blur-sm"
            >
              <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Team Details */}
        <div className="bg-white/5 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">
            Project Team
          </h2>

          {/* Supervisors */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Supervision</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300">Main Supervisor</h4>
                <p className="text-gray-300">Dr. K.D.C.G Kapugama</p>
                <p className="text-gray-400">Senior Lecturer</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300">
                  Assistant Supervisor
                </h4>
                <p className="text-gray-300">Ms. I. Nadisha Madhushanie</p>
                <p className="text-gray-400">Lecturer</p>
              </div>
            </div>
          </div>

          {/* Development Team */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Development Team - Group 11
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300">H.U.I. Hettiarachchi</p>
                <p className="text-gray-400">SC/2021/12353</p>
                <p className="text-blue-300 text-sm mt-2">Technical Leader</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300">G.D. Senevirathna</p>
                <p className="text-gray-400">SC/2021/12369</p>
                <p className="text-blue-300 text-sm mt-2">Scrum Master</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300">K.D.C.I. Geethanjalie</p>
                <p className="text-gray-400">SC/2021/12415</p>
                <p className="text-blue-300 text-sm mt-2">Developer</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300">M.N.M. Aathif</p>
                <p className="text-gray-400">SC/2021/12358</p>
                <p className="text-blue-300 text-sm mt-2">Developer</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300">W.M.U.T. Wanninayaka</p>
                <p className="text-gray-400">SC/2021/12446</p>
                <p className="text-blue-300 text-sm mt-2">Developer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white/5 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-white/5 rounded-lg">
              <Book className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-semibold mb-2">Backend</h3>
              <p className="text-gray-400">Spring Boot & Spring Security</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <BarChart className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-semibold mb-2">Frontend</h3>
              <p className="text-gray-400">ReactJS</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <Database className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-semibold mb-2">Database</h3>
              <p className="text-gray-400">MySQL</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <Shield className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-semibold mb-2">Encryption</h3>
              <p className="text-gray-400">
                AES (Advanced Encryption Standard)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
