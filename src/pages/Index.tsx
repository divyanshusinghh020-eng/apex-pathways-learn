import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, BookOpen, Users, GraduationCap, Trophy, Globe, User, BookMarked } from 'lucide-react';

// Types
type Language = 'english' | 'hindi' | 'punjabi';
type UserRole = 'student' | 'teacher';
type Page = 'welcome' | 'login' | 'roadmap' | 'classes' | 'streams' | 'subjects' | 'quiz' | 'teacher-dashboard' | 'student-progress';

interface Student {
  id: string;
  name: string;
  class: string;
  status: string;
  progress: { [subject: string]: number };
}

interface Quiz {
  id: string;
  subject: string;
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

// Language content
const content = {
  english: {
    title: "ApexMind",
    subtitle: "Digital Learning Platform for Rural Students",
    welcome: "Welcome to ApexMind - Your Gateway to Quality Education",
    description: "ApexMind is designed to bring world-class education to rural students and teachers. Our platform works offline and provides comprehensive learning materials for classes 1-12.",
    features: [
      "🌟 Offline-first learning platform",
      "📚 Complete curriculum for classes 1-12", 
      "🎯 Subject-specific quizzes and assessments",
      "👨‍🏫 Teacher dashboard for progress tracking",
      "🌍 Multi-language support",
      "📱 Works on low-end devices"
    ],
    loginTitle: "Student Login",
    studentName: "Student Name",
    selectClass: "Select Class", 
    login: "Login",
    teacherLogin: "Teacher Login",
    roadmapTitle: "How to Use ApexMind",
    roadmapSteps: [
      "1. Login with your name and class",
      "2. Select your language preference", 
      "3. Choose your class (1-12)",
      "4. Select stream (for classes 9-12)",
      "5. Pick your subjects",
      "6. Take quizzes and track progress"
    ],
    classes: "Classes",
    selectYourClass: "Select Your Class",
    streams: "Streams",
    subjects: "Subjects",
    quiz: "Quiz",
    back: "Back",
    next: "Next",
    submit: "Submit",
    score: "Score",
    teacherDashboard: "Teacher Dashboard",
    studentProgress: "Student Progress",
  },
  hindi: {
    title: "एपेक्समाइंड",
    subtitle: "ग्रामीण छात्रों के लिए डिजिटल शिक्षा मंच",
    welcome: "एपेक्समाइंड में आपका स्वागत है - गुणवत्तापूर्ण शिक्षा का आपका प्रवेश द्वार",
    description: "एपेक्समाइंड ग्रामीण छात्रों और शिक्षकों के लिए विश्व स्तरीय शिक्षा लाने के लिए डिज़ाइन किया गया है। हमारा प्लेटफॉर्म ऑफलाइन काम करता है और कक्षा 1-12 के लिए व्यापक शिक्षण सामग्री प्रदान करता है।",
    features: [
      "🌟 ऑफलाइन-फर्स्ट लर्निंग प्लेटफॉर्म",
      "📚 कक्षा 1-12 के लिए पूरा पाठ्यक्रम",
      "🎯 विषय-विशिष्ट प्रश्नोत्तरी और मूल्यांकन",
      "👨‍🏫 प्रगति ट्रैकिंग के लिए शिक्षक डैशबोर्ड",
      "🌍 बहु-भाषा समर्थन",
      "📱 कम क्षमता वाले उपकरणों पर काम करता है"
    ],
    loginTitle: "छात्र लॉगिन",
    studentName: "छात्र का नाम",
    selectClass: "कक्षा चुनें",
    login: "लॉगिन",
    teacherLogin: "शिक्षक लॉगिन",
    roadmapTitle: "एपेक्समाइंड का उपयोग कैसे करें",
    roadmapSteps: [
      "1. अपने नाम और कक्षा के साथ लॉगिन करें",
      "2. अपनी भाषा वरीयता चुनें",
      "3. अपनी कक्षा चुनें (1-12)",
      "4. स्ट्रीम चुनें (कक्षा 9-12 के लिए)",
      "5. अपने विषय चुनें",
      "6. प्रश्नोत्तरी लें और प्रगति ट्रैक करें"
    ],
    classes: "कक्षाएं",
    selectYourClass: "अपनी कक्षा चुनें",
    streams: "स्ट्रीम",
    subjects: "विषय",
    quiz: "प्रश्नोत्तरी",
    back: "वापस",
    next: "अगला",
    submit: "जमा करें",
    score: "स्कोर",
    teacherDashboard: "शिक्षक डैशबोर्ड",
    studentProgress: "छात्र प्रगति",
  },
  punjabi: {
    title: "ਐਪੇਕਸਮਾਈਂਡ",
    subtitle: "ਪਿੰਡੂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਡਿਜਿਟਲ ਸਿੱਖਿਆ ਪਲੇਟਫਾਰਮ",
    welcome: "ਐਪੇਕਸਮਾਈਂਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ - ਗੁਣਵੱਤਾ ਸਿੱਖਿਆ ਦਾ ਤੁਹਾਡਾ ਗੇਟਵੇ",
    description: "ਐਪੇਕਸਮਾਈਂਡ ਪਿੰਡੂ ਵਿਦਿਆਰਥੀਆਂ ਅਤੇ ਅਧਿਆਪਕਾਂ ਲਈ ਵਿਸ਼ਵ-ਪੱਧਰੀ ਸਿੱਖਿਆ ਲਿਆਉਣ ਲਈ ਡਿਜ਼ਾਇਨ ਕੀਤਾ ਗਿਆ ਹੈ। ਸਾਡਾ ਪਲੇਟਫਾਰਮ ਔਫਲਾਈਨ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਕਲਾਸ 1-12 ਲਈ ਵਿਆਪਕ ਸਿੱਖਣ ਸਮੱਗਰੀ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।",
    features: [
      "🌟 ਔਫਲਾਈਨ-ਫਰਸਟ ਸਿੱਖਣ ਪਲੇਟਫਾਰਮ",
      "📚 ਕਲਾਸ 1-12 ਲਈ ਪੂਰਾ ਪਾਠਕ੍ਰਮ",
      "🎯 ਵਿਸ਼ੇ-ਵਿਸ਼ੇਸ਼ ਪ੍ਰਸ਼ਨਾਂ ਅਤੇ ਮੁਲਾਂਕਣ",
      "👨‍🏫 ਪ੍ਰਗਤੀ ਟਰੈਕਿੰਗ ਲਈ ਅਧਿਆਪਕ ਡੈਸ਼ਬੋਰਡ",
      "🌍 ਬਹੁ-ਭਾਸ਼ਾ ਸਹਾਇਤਾ",
      "📱 ਘੱਟ ਸਮਰੱਥਾ ਵਾਲੇ ਯੰਤਰਾਂ 'ਤੇ ਕੰਮ ਕਰਦਾ ਹੈ"
    ],
    loginTitle: "ਵਿਦਿਆਰਥੀ ਲਾਗਇਨ",
    studentName: "ਵਿਦਿਆਰਥੀ ਦਾ ਨਾਮ",
    selectClass: "ਕਲਾਸ ਚੁਣੋ",
    login: "ਲਾਗਇਨ",
    teacherLogin: "ਅਧਿਆਪਕ ਲਾਗਇਨ",
    roadmapTitle: "ਐਪੇਕਸਮਾਈਂਡ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ",
    roadmapSteps: [
      "1. ਆਪਣੇ ਨਾਮ ਅਤੇ ਕਲਾਸ ਨਾਲ ਲਾਗਇਨ ਕਰੋ",
      "2. ਆਪਣੀ ਭਾਸ਼ਾ ਪਸੰਦ ਚੁਣੋ",
      "3. ਆਪਣੀ ਕਲਾਸ ਚੁਣੋ (1-12)",
      "4. ਸਟ੍ਰੀਮ ਚੁਣੋ (ਕਲਾਸ 9-12 ਲਈ)",
      "5. ਆਪਣੇ ਵਿਸ਼ੇ ਚੁਣੋ",
      "6. ਪ੍ਰਸ਼ਨ ਲਓ ਅਤੇ ਪ੍ਰਗਤੀ ਟਰੈਕ ਕਰੋ"
    ],
    classes: "ਕਲਾਸਾਂ",
    selectYourClass: "ਆਪਣੀ ਕਲਾਸ ਚੁਣੋ",
    streams: "ਸਟ੍ਰੀਮ",
    subjects: "ਵਿਸ਼ੇ",
    quiz: "ਪ੍ਰਸ਼ਨ",
    back: "ਵਾਪਸ",
    next: "ਅਗਲਾ",
    submit: "ਜਮ੍ਹਾ ਕਰੋ",
    score: "ਸਕੋਰ",
    teacherDashboard: "ਅਧਿਆਪਕ ਡੈਸ਼ਬੋਰਡ",
    studentProgress: "ਵਿਦਿਆਰਥੀ ਪ੍ਰਗਤੀ",
  }
};

// Subject data
const subjectData = {
  "1-8": ["English", "Mathematics", "Science", "Social Studies", "Hindi", "Physical Education"],
  "9-10": {
    science: ["English", "Physics", "Chemistry", "Mathematics", "General Knowledge", "Geography", "History", "Computer", "Physical Education"],
    commerce: ["English", "Economics", "Business Studies", "Accountancy", "General Knowledge", "Physical Education"]
  },
  "11-12": {
    science: {
      pcm: ["Physics", "Chemistry", "Mathematics", "English"],
      pcb: ["Physics", "Chemistry", "Biology", "English"], 
      pcmb: ["Physics", "Chemistry", "Mathematics", "Biology", "English"]
    },
    commerce: ["English", "Economics", "Business Studies", "Accountancy", "General Knowledge", "Physical Education"],
    humanities: ["English", "History", "Geography", "Economics", "Political Science", "Psychology", "Sociology", "Philosophy", "Physical Education"]
  }
};

// Quiz data
const quizData: Quiz[] = [
  {
    id: "physics",
    subject: "Physics",
    questions: [
      {
        question: "What is the SI unit of force?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correct: 0
      },
      {
        question: "The acceleration due to gravity on Earth is approximately:",
        options: ["9.8 m/s²", "10.8 m/s²", "8.9 m/s²", "11.2 m/s²"],
        correct: 0
      },
      {
        question: "Which law states that every action has an equal and opposite reaction?",
        options: ["First law", "Second law", "Third law", "Law of gravitation"],
        correct: 2
      }
    ]
  },
  {
    id: "chemistry",
    subject: "Chemistry", 
    questions: [
      {
        question: "What is the chemical symbol for Gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
      },
      {
        question: "How many electrons does a neutral carbon atom have?",
        options: ["4", "6", "8", "12"],
        correct: 1
      },
      {
        question: "What is the pH of pure water?",
        options: ["6", "7", "8", "9"],
        correct: 1
      }
    ]
  },
  {
    id: "mathematics",
    subject: "Mathematics",
    questions: [
      {
        question: "What is the value of π (pi) approximately?",
        options: ["3.14", "2.71", "1.41", "1.73"],
        correct: 0
      },
      {
        question: "What is the derivative of x²?",
        options: ["x", "2x", "x²", "2x²"],
        correct: 1
      },
      {
        question: "In a right triangle, what is sin(90°)?",
        options: ["0", "1", "∞", "undefined"],
        correct: 1
      }
    ]
  },
  {
    id: "english",
    subject: "English",
    questions: [
      {
        question: "What is the past tense of 'go'?",
        options: ["goed", "went", "gone", "going"],
        correct: 1
      },
      {
        question: "Which of these is a noun?",
        options: ["quickly", "beautiful", "happiness", "run"],
        correct: 2
      },
      {
        question: "What is the plural of 'child'?",
        options: ["childs", "childes", "children", "child"],
        correct: 2
      }
    ]
  }
];

// Mock student data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    class: "10th Science",
    status: "In Progress",
    progress: { Physics: 85, Chemistry: 92, Mathematics: 78, English: 88 }
  },
  {
    id: "2", 
    name: "Priya Sharma",
    class: "12th Commerce",
    status: "Completed",
    progress: { Economics: 95, "Business Studies": 89, Accountancy: 91, English: 87 }
  },
  {
    id: "3",
    name: "Amit Singh",
    class: "11th Science PCM", 
    status: "In Progress",
    progress: { Physics: 76, Chemistry: 83, Mathematics: 92, English: 79 }
  }
];

const ApexMind = () => {
  const [language, setLanguage] = useState<Language>('english');
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [studentName, setStudentName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedSubStream, setSelectedSubStream] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const t = content[language];

  // Save login history
  const saveLoginHistory = (name: string, classNum: string) => {
    const history = JSON.parse(localStorage.getItem('apexmind_logins') || '[]');
    const newEntry = {
      name,
      class: classNum,
      timestamp: new Date().toISOString(),
      language
    };
    history.push(newEntry);
    localStorage.setItem('apexmind_logins', JSON.stringify(history));
  };

  const handleLogin = () => {
    if (studentName && selectedClass) {
      saveLoginHistory(studentName, selectedClass);
      setCurrentPage('roadmap');
    }
  };

  const handleQuizStart = (subject: string) => {
    const quiz = quizData.find(q => q.subject.toLowerCase() === subject.toLowerCase());
    if (quiz) {
      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
      setQuizCompleted(false);
      setSelectedAnswer(null);
      setCurrentPage('quiz');
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null && currentQuiz) {
      if (selectedAnswer === currentQuiz.questions[currentQuestionIndex].correct) {
        setQuizScore(prev => prev + 1);
      }
      
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
        // Save quiz result
        const results = JSON.parse(localStorage.getItem('apexmind_quiz_results') || '{}');
        results[`${studentName}_${currentQuiz.subject}`] = {
          score: quizScore + (selectedAnswer === currentQuiz.questions[currentQuestionIndex].correct ? 1 : 0),
          total: currentQuiz.questions.length,
          date: new Date().toISOString()
        };
        localStorage.setItem('apexmind_quiz_results', JSON.stringify(results));
      }
    }
  };

  const renderWelcomePage = () => (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="p-6 border-b border-border">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="language"
              size="sm"
              onClick={() => setLanguage('english')}
              className={language === 'english' ? 'bg-primary text-primary-foreground' : ''}
            >
              EN
            </Button>
            <Button
              variant="language"
              size="sm"
              onClick={() => setLanguage('hindi')}
              className={language === 'hindi' ? 'bg-primary text-primary-foreground' : ''}
            >
              हि
            </Button>
            <Button
              variant="language"
              size="sm"
              onClick={() => setLanguage('punjabi')}
              className={language === 'punjabi' ? 'bg-primary text-primary-foreground' : ''}
            >
              ਪੰ
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {t.welcome}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => setCurrentPage('login')}>
              <User className="mr-2 h-5 w-5" />
              {t.loginTitle}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => { setUserRole('teacher'); setCurrentPage('teacher-dashboard'); }}>
              <Users className="mr-2 h-5 w-5" />
              {t.teacherLogin}
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.map((feature, index) => (
            <Card key={index} className="hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <p className="text-lg">{feature}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Quick Access */}
        <section className="text-center space-y-4">
          <h3 className="text-2xl font-semibold text-primary">{t.roadmapTitle}</h3>
          <Button variant="subject" onClick={() => setCurrentPage('roadmap')}>
            <BookOpen className="mr-2 h-5 w-5" />
            View Learning Guide
          </Button>
        </section>
      </main>
    </div>
  );

  const renderLoginPage = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            {t.loginTitle}
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t.studentName}</Label>
            <Input
              id="name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">{t.selectClass}</Label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border border-input bg-background rounded-md"
            >
              <option value="">Select class...</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={`${i + 1}`}>
                  Class {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-3">
            <Button variant="back" onClick={() => setCurrentPage('welcome')} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back}
            </Button>
            <Button variant="hero" onClick={handleLogin} className="flex-1" disabled={!studentName || !selectedClass}>
              {t.login}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRoadmapPage = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {t.roadmapTitle}
          </h1>
          <Button variant="back" onClick={() => setCurrentPage('welcome')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Button>
        </div>

        <div className="grid gap-6">
          {t.roadmapSteps.map((step, index) => (
            <Card key={index} className="hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-lg">{step}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" onClick={() => setCurrentPage('classes')}>
            <GraduationCap className="mr-2 h-5 w-5" />
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  );

  const renderClassesPage = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
            {t.selectYourClass}
          </h1>
          <Button variant="back" onClick={() => setCurrentPage('roadmap')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <Button
              key={i + 1}
              variant="class"
              size="lg"
              className="h-20 text-xl"
              onClick={() => {
                setSelectedClass(`${i + 1}`);
                if (i + 1 >= 9) {
                  setCurrentPage('streams');
                } else {
                  setCurrentPage('subjects');
                }
              }}
            >
              <BookMarked className="mr-2 h-6 w-6" />
              Class {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStreamsPage = () => {
    const classNum = parseInt(selectedClass);
    const isHigherSecondary = classNum >= 11;

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-warning bg-clip-text text-transparent">
              {t.streams} - Class {selectedClass}
            </h1>
            <Button variant="back" onClick={() => setCurrentPage('classes')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back}
            </Button>
          </div>

          <div className="grid gap-6">
            {classNum >= 9 && classNum <= 10 && (
              <>
                <Button
                  variant="stream"
                  size="lg"
                  className="h-20 text-xl"
                  onClick={() => {
                    setSelectedStream('science');
                    setCurrentPage('subjects');
                  }}
                >
                  🧪 Science Stream
                </Button>
                <Button
                  variant="stream"
                  size="lg"
                  className="h-20 text-xl"
                  onClick={() => {
                    setSelectedStream('commerce');
                    setCurrentPage('subjects');
                  }}
                >
                  💼 Commerce Stream
                </Button>
              </>
            )}

            {isHigherSecondary && (
              <>
                <Button
                  variant="stream"
                  size="lg"
                  className="h-20 text-xl"
                  onClick={() => {
                    setSelectedStream('science');
                    if (classNum >= 11) {
                      // Show sub-streams for 11-12
                      setCurrentPage('subjects');
                    } else {
                      setCurrentPage('subjects');
                    }
                  }}
                >
                  🧪 Science Stream
                </Button>
                <Button
                  variant="stream"
                  size="lg"
                  className="h-20 text-xl"
                  onClick={() => {
                    setSelectedStream('commerce');
                    setCurrentPage('subjects');
                  }}
                >
                  💼 Commerce Stream
                </Button>
                <Button
                  variant="stream"
                  size="lg"
                  className="h-20 text-xl"
                  onClick={() => {
                    setSelectedStream('humanities');
                    setCurrentPage('subjects');
                  }}
                >
                  📚 Humanities Stream
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSubjectsPage = () => {
    const classNum = parseInt(selectedClass);
    let subjects: string[] = [];

    if (classNum <= 8) {
      subjects = subjectData["1-8"];
    } else if (classNum >= 9 && classNum <= 10) {
      const streamData = subjectData["9-10"] as any;
      subjects = streamData[selectedStream] || [];
    } else if (classNum >= 11 && classNum <= 12) {
      const streamData = subjectData["11-12"] as any;
      if (selectedStream === 'science') {
        // Show sub-stream selection for science
        if (!selectedSubStream) {
          return (
            <div className="min-h-screen bg-background p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
                    Science Sub-Streams - Class {selectedClass}
                  </h1>
                  <Button variant="back" onClick={() => setCurrentPage('streams')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.back}
                  </Button>
                </div>

                <div className="grid gap-6">
                  <Button
                    variant="subject"
                    size="lg"
                    className="h-20 text-xl"
                    onClick={() => {
                      setSelectedSubStream('pcm');
                      setCurrentPage('subjects');
                    }}
                  >
                    📐 PCM (Physics, Chemistry, Mathematics)
                  </Button>
                  <Button
                    variant="subject"
                    size="lg"
                    className="h-20 text-xl"
                    onClick={() => {
                      setSelectedSubStream('pcb');
                      setCurrentPage('subjects');
                    }}
                  >
                    🧬 PCB (Physics, Chemistry, Biology)
                  </Button>
                  <Button
                    variant="subject"
                    size="lg"
                    className="h-20 text-xl"
                    onClick={() => {
                      setSelectedSubStream('pcmb');
                      setCurrentPage('subjects');
                    }}
                  >
                    🔬 PCMB (Physics, Chemistry, Mathematics, Biology)
                  </Button>
                </div>
              </div>
            </div>
          );
        } else {
          subjects = streamData.science[selectedSubStream] || [];
          // Add optional subjects
          subjects = [...subjects, "Computer Programming (C Language)", "Physical Education"];
        }
      } else {
        subjects = streamData[selectedStream] || [];
      }
    }

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
              {t.subjects} - Class {selectedClass} {selectedStream} {selectedSubStream}
            </h1>
            <Button variant="back" onClick={() => {
              if (selectedSubStream) {
                setSelectedSubStream('');
              } else if (classNum >= 9) {
                setCurrentPage('streams');
              } else {
                setCurrentPage('classes');
              }
            }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <Button
                key={index}
                variant="subject"
                size="lg"
                className="h-20 text-lg"
                onClick={() => handleQuizStart(subject)}
              >
                <Trophy className="mr-2 h-5 w-5" />
                {subject}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuizPage = () => {
    if (!currentQuiz) return null;

    if (quizCompleted) {
      const finalScore = quizScore + (selectedAnswer === currentQuiz.questions[currentQuestionIndex].correct ? 1 : 0);
      const percentage = Math.round((finalScore / currentQuiz.questions.length) * 100);
      
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-success bg-clip-text text-transparent">
                Quiz Completed!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl">🎉</div>
              <div>
                <p className="text-2xl font-bold">{t.score}: {finalScore}/{currentQuiz.questions.length}</p>
                <p className="text-xl text-muted-foreground">{percentage}%</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="back" onClick={() => setCurrentPage('subjects')} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.back}
                </Button>
                <Button variant="quiz" onClick={() => handleQuizStart(currentQuiz.subject)} className="flex-1">
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-quiz bg-clip-text text-transparent">
              {currentQuiz.subject} Quiz
            </h1>
            <div className="text-muted-foreground">
              {currentQuestionIndex + 1} / {currentQuiz.questions.length}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
              
              <div className="flex space-x-3 pt-4">
                <Button variant="back" onClick={() => setCurrentPage('subjects')} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.back}
                </Button>
                <Button 
                  variant="quiz" 
                  onClick={handleNextQuestion} 
                  className="flex-1"
                  disabled={selectedAnswer === null}
                >
                  {currentQuestionIndex < currentQuiz.questions.length - 1 ? t.next : t.submit}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderTeacherDashboard = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {t.teacherDashboard}
          </h1>
          <Button variant="back" onClick={() => { setUserRole('student'); setCurrentPage('welcome'); }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Student View
          </Button>
        </div>

        <div className="grid gap-6">
          {mockStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{student.name}</h3>
                    <p className="text-muted-foreground">{student.class}</p>
                    <p className="text-sm">Status: <span className={student.status === 'Completed' ? 'text-success' : 'text-warning'}>{student.status}</span></p>
                  </div>
                  <Button 
                    variant="subject" 
                    onClick={() => {
                      setSelectedStudent(student);
                      setCurrentPage('student-progress');
                    }}
                  >
                    View Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentProgress = () => {
    if (!selectedStudent) return null;

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
              {selectedStudent.name} - Progress Report
            </h1>
            <Button variant="back" onClick={() => setCurrentPage('teacher-dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedStudent.name}</CardTitle>
              <CardDescription>{selectedStudent.class} • Status: {selectedStudent.status}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(selectedStudent.progress).map(([subject, score]) => (
                <div key={subject} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">{subject}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-background rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${score >= 90 ? 'bg-success' : score >= 70 ? 'bg-warning' : 'bg-destructive'}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-lg">{score}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Register service worker for offline functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  // Render current page
  switch (currentPage) {
    case 'welcome':
      return renderWelcomePage();
    case 'login':
      return renderLoginPage();
    case 'roadmap':
      return renderRoadmapPage();
    case 'classes':
      return renderClassesPage();
    case 'streams':
      return renderStreamsPage();
    case 'subjects':
      return renderSubjectsPage();
    case 'quiz':
      return renderQuizPage();
    case 'teacher-dashboard':
      return renderTeacherDashboard();
    case 'student-progress':
      return renderStudentProgress();
    default:
      return renderWelcomePage();
  }
};

export default ApexMind;