import { 
  BookOpen, 
  Code2, 
  Cpu, 
  GitBranch,
  AlertCircle,
  MessageSquare,
  Bug,
  Workflow 
} from "lucide-react";

export const FeaturesData = [
  {
    title: "Smart Documentation",
    description: 
      "AI-powered documentation generation with context understanding and best practices",
    icon: <BookOpen className="w-6 h-6 text-violet-400" />,
  },
  {
    title: "Automated Testing",
    description: "Intelligent test case generation for unit and integration testing",
    icon: <Workflow className="w-6 h-6 text-violet-400" />,
  },
  {
    title: "Code Analysis",
    description: "Deep code analysis for identifying code smells and optimization opportunities",
    icon: <Code2 className="w-6 h-6 text-violet-400" />,
  },
  {
    title: "Performance Insights",
    description: "Performance optimization suggestions and bottleneck detection",
    icon: <Cpu className="w-6 h-6 text-violet-400" />,
  },
  {
    title: "Version Control",
    description: "Seamless integration with Git and automatic change documentation",
    icon: <GitBranch className="w-6 h-6 text-violet-400" />,
  },
  {
    title: "Code Review",
    description: "Automated code review suggestions and best practice enforcement",
    icon: <MessageSquare className="w-6 h-6 text-violet-400" />,
  },
  {
    title: "Bug Detection",
    description: "Proactive bug detection and security vulnerability scanning",
    icon: <Bug className="w-6 h-6 text-violet-400" />,
  },
  {
    title: "Quality Alerts",
    description: "Real-time alerts for code quality issues and technical debt",
    icon: <AlertCircle className="w-6 h-6 text-violet-400" />,
  },
];