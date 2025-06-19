"use client"; // This directive is typically for Next.js and indicates a client-side component.

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

// Interfaces for better type checking
interface Command {
    command: string;
    description: string;
}

interface HistoryItem {
    input: string;
    output: React.ReactNode;
    timestamp: Date;
}

interface Particle {
    id: number;
    left: number;
    animationDelay: number;
    size: number;
    initialTop: number;
}

// Main TerminalPortfolio component
const TerminalPortfolio: React.FC = () => {
    // --- Nested Component: HelpMenuInteractive ---
    // Declared here so it's available before it's used in executeCommand or render
    interface HelpMenuInteractiveProps {
        commands: Command[];
        selectedIndex: number;
        onSelectCommand: (command: string) => void;
    }

    const HelpMenuInteractive: React.FC<HelpMenuInteractiveProps> = ({
        commands,
        selectedIndex,
        onSelectCommand,
    }) => {
        const selectedRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (selectedRef.current) {
                selectedRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }, [selectedIndex]);

        return (
            <div className="bg-white/10 border border-green-400/50 rounded p-4 shadow-md">
                <div className="text-green-400 font-bold mb-3">Available Commands:</div>
                <div className="space-y-1">
                    {commands.map((cmd, index) => (
                        <div
                            key={cmd.command}
                            ref={index === selectedIndex ? selectedRef : null}
                            className={`text-white/80 p-1 rounded cursor-pointer transition-colors duration-150
                                ${index === selectedIndex ? 'bg-green-600/50 text-white' : 'hover:bg-white/10'}
                            `}
                            onClick={() => onSelectCommand(cmd.command)}
                        >
                            <span className="text-green-300 w-16 inline-block min-w-[200px]">
                                {cmd.command}
                            </span>
                            <span className="text-white/70">- {cmd.description}</span>
                        </div>
                    ))}
                </div>
                <div className="text-white/60 text-xs mt-3">
                    Use <span className="text-green-400 font-mono">↑↓</span> to navigate,{' '}
                    <span className="text-green-400 font-mono">Enter</span> to select,{' '}
                    <span className="text-green-400 font-mono">Esc</span> to exit menu.
                </div>
            </div>
        );
    };
    // --- End Nested Component: HelpMenuInteractive ---


    // --- State Declarations ---
    const [input, setInput] = useState<string>("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("~");

    // States for interactive help menu
    const [terminalMode, setTerminalMode] = useState<"input" | "helpMenu">(
        "input"
    );
    const [helpMenuSelectedIndex, setHelpMenuSelectedIndex] = useState<number>(-1);

    // States for command history navigation (different from display history)
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    // Refs for DOM elements
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);


    // --- Static Data & Helper Functions (declared before use) ---

    // Memoize the commands array as it's static content
    const commands = useMemo<Command[]>(
        () => [
            { command: "help", description: "Show available commands" },
            { command: "about", description: "Learn about Vishal Shukla" },
            { command: "skills", description: "View technical skills" },
            { command: "projects", description: "Browse recent projects" },
            { command: "contact", description: "Get contact information" },
            { command: "experience", description: "View work experience" },
            { command: "clear", description: "Clear terminal history" },
            { command: "whoami", description: "Display current user info" },
            { command: "ls", description: "List available sections" },
        ],
        []
    );

    const getErrorContent = useCallback(
        (command: string): React.ReactNode => (
            <div className="text-red-400">
                <p>Command '{command}' not found.</p>
                <p>
                    Type <span className="text-green-400">help</span> to see available
                    commands.
                </p>
            </div>
        ),
        []
    );

    const getWelcomeMessage = useCallback(
        (): React.ReactNode => (
            <div className="space-y-4">
                <div className="text-green-400 font-bold text-lg">
                    ══════════════════════════════════════════
                </div>
                <div className="text-green-400 font-bold text-lg">
                    Welcome to Vishal Shukla's Portfolio
                </div>
                <div className="text-green-400 font-bold text-lg">
                    ══════════════════════════════════════════
                </div>
                <div className="text-white/80 mt-4">
                    <p>
                        - Type <span className="text-green-400 font-mono">help</span> to see
                        available commands and{" "}
                        <span className="text-green-400 font-mono">Tab</span> for
                        auto-completion
                    </p>
                </div>
            </div>
        ),
        []
    );

    const getAboutContent = useCallback(
        (): React.ReactNode => (
            <div className="space-y-4 text-white/90">
                <div className="text-green-400 text-lg font-bold mb-4">
                    $ cat about.txt
                </div>
                <div className="bg-white/5 p-4 rounded border-l-4 border-green-400/70 shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p>
                                <span className="text-green-400">Name:</span> Vishal Shukla
                            </p>
                            <p>
                                <span className="text-green-400">Role:</span> Full-Stack
                                Developer
                            </p>
                            <p>
                                <span className="text-green-400">Location:</span> Lucknow, India
                            </p>
                            <p>
                                <span className="text-green-400">Experience:</span> 4+ years
                            </p>
                        </div>
                    </div>
                    <p className="mb-3">
                        Full-stack developer with over four years of experience,
                        specializing in building end-to-end applications using a mix of
                        frontend and backend technologies. I have a thing for clean code and
                        scalable architecture. If you're reading this, just know—I know a
                        lot of cool stuff.
                    </p>
                    <div className="mt-4">
                        <p className="text-green-400 font-bold">Education:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>
                                Master of Computer Applications - Chandigarh University
                                (Specialization in Machine Learning and Artificial Intelligence)
                            </li>
                            <li>Bachelor of Business Administration - BBAU, Lucknow</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
        []
    );

    const getSkillsContent = useCallback(
        (): React.ReactNode => (
            <div className="space-y-4">
                <div className="text-green-400 text-lg font-bold mb-4">
                    $ cat skills.json
                </div>
                <div className="bg-white/5 p-4 rounded border-l-4 border-green-400/70 shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-green-400 font-bold mb-3">
                                Programming Languages
                            </h3>
                            <div className="space-y-2">
                                {["Python", "Go", "JavaScript", "TypeScript"].map((skill) => (
                                    <div key={skill} className="flex items-center">
                                        <span className="text-green-400 mr-2">▶</span>
                                        <span className="text-white/80">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-green-400 font-bold mb-3">
                                Web Dev Frameworks
                            </h3>
                            <div className="space-y-2">
                                {[
                                    "React.js/Next.js",
                                    "Node.js/Express.js",
                                    "Golang (httprouter)",
                                    "Python (FastAPI)",
                                    "React Native",
                                ].map((skill) => (
                                    <div key={skill} className="flex items-center">
                                        <span className="text-green-400 mr-2">▶</span>
                                        <span className="text-white/80">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-green-400 font-bold mb-3">
                                Databases & DevOps
                            </h3>
                            <div className="space-y-2">
                                {[
                                    "MySQL",
                                    "PostgreSQL",
                                    "SQLite",
                                    "MongoDB",
                                    "Docker",
                                    "Kubernetes",
                                    "Docker Swarm",
                                    "AWS",
                                ].map((skill) => (
                                    <div key={skill} className="flex items-center">
                                        <span className="text-green-400 mr-2">▶</span>
                                        <span className="text-white/80">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-green-400 font-bold mb-3">
                                Software Development Principles
                            </h3>
                            <div className="space-y-2">
                                {[
                                    "System Design",
                                    "Scalable Architecture",
                                    "Design Patterns",
                                    "Responsive & Adaptive Design",
                                    "Progressive Web Apps (PWA)",
                                    "Code Quality & Best Practices",
                                ].map((skill) => (
                                    <div key={skill} className="flex items-center">
                                        <span className="text-green-400 mr-2">▶</span>
                                        <span className="text-white/80">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        []
    );

    const getProjectsContent = useCallback(
        (): React.ReactNode => (
            <div className="space-y-4">
                <div className="text-green-400 text-lg font-bold mb-4">
                    $ ls -la ./projects/
                </div>
                <div className="space-y-4">
                    {[
                        {
                            name: "Hate Speech Analyzer",
                            tech: "FastAPI • Docker • Docker Compose • Hugging Face Transformers • spaCy",
                            description:
                                "Built a full-stack web app to detect hate speech using the unitary/toxic-bert model. FastAPI powered the backend API, with spaCy handling text preprocessing. Developed a responsive frontend with Next.js and containerized the entire system using Docker, managing services efficiently with Docker Compose.",
                            size: "1.2M",
                            date: "2023-10-20",
                        },
                        // You can add more projects here following the same structure
                    ].map((project) => (
                        <div
                            key={project.name}
                            className="bg-white/5 p-4 rounded border-l-4 border-green-400/70 shadow-inner"
                        >
                            <div className="flex flex-wrap items-center justify-between mb-2">
                                <span className="text-green-400 font-mono">
                                    {project.name}/
                                </span>
                                <div className="text-white/60 text-sm">
                                    {project.size} • {project.date}
                                </div>
                            </div>
                            <div className="text-white/60 text-sm mb-2">{project.tech}</div>
                            <div className="text-white/80">{project.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        []
    );

    const getContactContent = useCallback(
        (): React.ReactNode => (
            <div className="space-y-4">
                <div className="text-green-400 text-lg font-bold mb-4">
                    $ cat contact.info
                </div>
                <div className="bg-white/5 p-4 rounded border-l-4 border-green-400/70 shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="text-green-400 font-bold">Contact Information</h3>
                            {[
                                { label: "Email", value: "vishaaxl@gmail.com" },
                                { label: "Phone", value: "+91 8318218163" },
                                { label: "Location", value: "Lucknow, India" },
                            ].map((contact) => (
                                <div
                                    key={contact.label}
                                    className="flex items-center space-x-3"
                                >
                                    <div>
                                        <span className="text-green-400">{contact.label}:</span>
                                        <span className="text-white/80 ml-2">{contact.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-green-400 font-bold">Online Profiles</h3>
                            {[
                                { platform: "GitHub", url: "https://github.com/vishaaxl" },
                                { platform: "Portfolio", url: "https://vishalshukla.in" },
                                // Add other social links if desired
                            ].map((social) => (
                                <div
                                    key={social.platform}
                                    className="flex items-center space-x-3"
                                >
                                    <div>
                                        <span className="text-green-400">{social.platform}:</span>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 ml-2 hover:underline"
                                        >
                                            {social.url}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
        []
    );

    const getExperienceContent = useCallback(
        (): React.ReactNode => (
            <div className="space-y-4">
                <div className="text-green-400 text-lg font-bold mb-4">
                    $ cat experience.log
                </div>
                <div className="space-y-4">
                    {[
                        {
                            company: "Virtue Analytics",
                            role: "Full-stack Engineer",
                            period: "Nov 2023 – Present | Lucknow, India",
                            description:
                                "Led front-end development for an EdTech application designed to help students select colleges based on interests, academic profiles, and budgets. Developed features allowing users to compare options, edit details, upload files, and extract key values from the files to assist in the college selection process. Developed a smart document processing system that converts images of text into machine-readable data. Automating data entry and organize it into tables for easy comparison. Improved decision-making and streamlined operations.",
                        },
                        {
                            company: "Virtue Analytics",
                            role: "Front-end Engineer",
                            period: "May 2023 – Nov 2023 | Lucknow, India",
                            description:
                                "Developed a HIPAA-compliant healthcare application for a US client, ensuring full compliance with data security and privacy regulations. Implemented encryption, access control, and best practices to safeguard sensitive patient data while maintaining regulatory adherence throughout the project lifecycle.",
                        },
                        // You can add more experience entries here
                    ].map((job) => (
                        <div
                            key={job.company + job.role}
                            className="bg-white/5 p-4 rounded border-l-4 border-green-400/70 shadow-inner"
                        >
                            <div className="flex flex-wrap justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-green-400 font-bold">{job.company}</h3>
                                    <p className="text-white/80">{job.role}</p>
                                </div>
                                <span className="text-white/60 text-sm">{job.period}</span>
                            </div>
                            <p className="text-white/80">{job.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
        []
    );

    const getWhoAmIContent = useCallback(
        (): React.ReactNode => (
            <div className="text-white/90">
                <div className="text-green-400 font-mono">vishalshukla</div>
                <div className="mt-2">
                    <p>Full-Stack Developer • Lucknow, India</p>
                    <p>
                        Specializing in Python, Go, JavaScript, React.js, and scalable
                        architecture.
                    </p>
                </div>
            </div>
        ),
        []
    );

    const getLsContent = useCallback(
        (): React.ReactNode => (
            <div className="font-mono text-white/90">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["about/", "skills/", "projects/", "contact/", "experience/"].map(
                        (dir) => (
                            <div key={dir} className="text-green-400">
                                {dir}
                            </div>
                        )
                    )}
                </div>
            </div>
        ),
        []
    );

    const clearTerminal = useCallback(() => {
        setHistory([]);
        setInput("");
        setHistoryIndex(-1); // Reset history index on clear
        setTerminalMode("input"); // Ensure mode is reset
        setHelpMenuSelectedIndex(-1); // Ensure help menu selection is reset
    }, []);


    // --- Core Command Execution Logic ---
    // This must be declared AFTER all content getters and clearTerminal
    const executeCommand = useCallback(
        (cmd: string) => {
            const command = cmd.toLowerCase().trim();

            // Add to command history (for up/down arrow navigation)
            if (cmd.trim() !== "welcome") {
                setCommandHistory((prev) => {
                    if (prev.length === 0 || prev[prev.length - 1] !== cmd) {
                        return [...prev, cmd];
                    }
                    return prev;
                });
            }
            setHistoryIndex(-1); // Reset history index when a new command is executed

            // Clear input immediately after adding to history
            setInput("");

            // Handle 'clear' command separately as it modifies history directly
            if (command === "clear") {
                clearTerminal();
                return;
            }

            // Add the input command to display history first with a null output placeholder
            setHistory((prev) => [
                ...prev,
                { input: cmd, output: null, timestamp: new Date() },
            ]);

            let outputContent: React.ReactNode;
            switch (command) {
                case "help":
                    // When 'help' is executed, enter help menu navigation mode
                    setTerminalMode("helpMenu");
                    setHelpMenuSelectedIndex(0); // Select the first command by default
                    outputContent = (
                        <HelpMenuInteractive
                            commands={commands}
                            selectedIndex={0} // Initial selection
                            onSelectCommand={(selectedCmd) => {
                                // This callback is triggered when a command is clicked in the interactive menu
                                executeCommand(selectedCmd); // Recursively execute the selected command
                                setTerminalMode("input"); // Exit help menu mode
                                setHelpMenuSelectedIndex(-1); // Reset selection
                            }}
                        />
                    );
                    break;
                case "about":
                    outputContent = getAboutContent();
                    break;
                case "skills":
                    outputContent = getSkillsContent();
                    break;
                case "projects":
                    outputContent = getProjectsContent();
                    break;
                case "contact":
                    outputContent = getContactContent();
                    break;
                case "experience":
                    outputContent = getExperienceContent();
                    break;
                case "whoami":
                    outputContent = getWhoAmIContent();
                    break;
                case "ls":
                    outputContent = getLsContent();
                    break;
                default:
                    outputContent = getErrorContent(command);
                    break;
            }

            // Update the last history item with the actual output content
            setHistory((prev) => {
                const lastItemIndex = prev.length - 1;
                if (
                    lastItemIndex >= 0 &&
                    prev[lastItemIndex].input === cmd &&
                    prev[lastItemIndex].output === null
                ) {
                    const newHistory = [...prev];
                    newHistory[lastItemIndex] = {
                        ...newHistory[lastItemIndex],
                        output: outputContent,
                    };
                    return newHistory;
                }
                // Fallback for cases where history might have been unexpectedly modified
                return [
                    ...prev,
                    { input: cmd, output: outputContent, timestamp: new Date() },
                ];
            });
        },
        [
            clearTerminal,
            getAboutContent,
            getSkillsContent,
            getProjectsContent,
            getContactContent,
            getExperienceContent,
            getWhoAmIContent,
            getLsContent,
            getErrorContent,
            commands, // `commands` is a stable memoized array
            HelpMenuInteractive, // Nested component is also a dependency if passed directly
            setCommandHistory,
            setHistoryIndex,
            setTerminalMode,
            setHelpMenuSelectedIndex,
            setInput,
        ]
    );

    // Auto-completion logic
    // Declared before handleKeyDown as handleKeyDown uses it
    const autoComplete = useCallback(() => {
        const currentInput = inputRef.current?.value || "";
        const matches = commands.filter((cmd) =>
            cmd.command.startsWith(currentInput.toLowerCase())
        );
        if (matches.length === 1) {
            setInput(matches[0].command);
        } else if (matches.length > 1) {
            const suggestions = matches.map((m) => m.command).join(" ");
            setHistory((prev) => [
                ...prev,
                {
                    input: currentInput,
                    output: (
                        <div className="text-yellow-400">Suggestions: {suggestions}</div>
                    ),
                    timestamp: new Date(),
                },
            ]);
            setInput(currentInput); // Keep current input for suggestions
        }
    }, [commands]);

    // Handler for form submission (when Enter is pressed in the input field directly)
    // Declared before handleKeyDown as handleKeyDown uses it
    const handleSubmit = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent): void => {
            e.preventDefault();

            if (!input.trim()) {
                return;
            }
            executeCommand(input);
        },
        [input, executeCommand]
    );

    // Handle all key presses in the input field
    // Declared last as it depends on executeCommand, autoComplete, handleSubmit
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (terminalMode === "helpMenu") {
                e.preventDefault(); // Prevent default browser behavior (like scrolling)

                if (e.key === "ArrowUp") {
                    setHelpMenuSelectedIndex((prev) =>
                        Math.max(0, prev - 1)
                    );
                } else if (e.key === "ArrowDown") {
                    setHelpMenuSelectedIndex((prev) =>
                        Math.min(commands.length - 1, prev + 1)
                    );
                } else if (e.key === "Enter") {
                    if (helpMenuSelectedIndex !== -1) {
                        const selectedCommand = commands[helpMenuSelectedIndex].command;
                        executeCommand(selectedCommand); // This will add to history and run
                        setTerminalMode("input"); // After execution, switch back to input mode
                        setHelpMenuSelectedIndex(-1); // Reset selection
                        setInput(""); // Clear input as command is executed
                    }
                } else if (e.key === "Escape") {
                    setTerminalMode("input"); // Exit help menu mode
                    setHelpMenuSelectedIndex(-1);
                    setInput(""); // Clear input
                } else {
                    // If any other key is pressed, exit help menu mode and put the key in input
                    setTerminalMode("input");
                    setHelpMenuSelectedIndex(-1);
                    setInput(e.key); // Start typing with the pressed key
                }
            } else {
                // Standard input mode key handling
                if (e.key === "Enter") {
                    handleSubmit(e);
                } else if (e.key === "Tab") {
                    e.preventDefault();
                    autoComplete();
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (commandHistory.length > 0) {
                        const newIndex = Math.min(
                            historyIndex + 1,
                            commandHistory.length - 1
                        );
                        setHistoryIndex(newIndex);
                        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
                    }
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const newIndex = Math.max(historyIndex - 1, -1); // -1 means no command selected (empty input)
                    setHistoryIndex(newIndex);
                    if (newIndex === -1) {
                        setInput("");
                    } else {
                        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
                    }
                }
            }
        },
        [
            terminalMode,
            helpMenuSelectedIndex,
            commands,
            executeCommand,
            handleSubmit,
            autoComplete,
            commandHistory,
            historyIndex,
        ]
    );

    // --- Effects ---

    // Global Key Listener for focusing input
    useEffect(() => {
        const handleGlobalKeyPress = (e: KeyboardEvent): void => {
            if (
                !inputRef.current?.matches(":focus") &&
                e.key.length === 1 && // Check if it's a single character key
                !e.ctrlKey &&
                !e.altKey &&
                !e.metaKey
            ) {
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleGlobalKeyPress);

        return () => {
            window.removeEventListener("keydown", handleGlobalKeyPress);
        };
    }, []);

    // Auto-focus input when history updates or mode changes
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [history, terminalMode]); // Add terminalMode to dependencies

    // Scroll to bottom of terminal when history updates
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Initial welcome message and particles generation on component mount
    useEffect(() => {
        const generateParticles = (): void => {
            const newParticles: Particle[] = [];
            for (let i = 0; i < 60; i++) {
                newParticles.push({
                    id: i,
                    left: Math.random() * 100,
                    animationDelay: Math.random() * 20,
                    size: Math.random() * 3 + 1,
                    initialTop: Math.random() * 100,
                });
            }
            setParticles(newParticles);
        };

        generateParticles();
        // Add welcome message directly to history
        setHistory((prev) => [
            ...prev,
            { input: "welcome", output: getWelcomeMessage(), timestamp: new Date() },
        ]);
    }, [getWelcomeMessage]);


    // --- JSX Render ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Background Particles */}
            <div className="fixed inset-0 pointer-events-none">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full bg-green-400/20 animate-particle-float"
                        style={{
                            left: `${particle.left}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animationDelay: `${particle.animationDelay}s`,
                            top: `${particle.initialTop}vh`,
                        }}
                    />
                ))}
            </div>

            {/* Terminal Container */}
            <div className="relative w-full max-w-4xl h-[90vh] bg-gray-900/40 backdrop-blur-3xl rounded-xl border border-white/20 shadow-2xl flex flex-col overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-[1.005] hover:shadow-green-500/30">
                {/* Terminal Header */}
                <div className="bg-gray-800/60 p-3 flex items-center justify-between border-b border-white/20 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-green-400 font-mono text-sm">
                            vishal@portfolio:
                            <span className="text-blue-300">{currentPath}</span>$
                        </span>
                    </div>
                    <div className="text-green-400/60 text-xs font-mono">
                        Terminal v2.4.1
                    </div>
                </div>

                {/* Terminal Content */}
                <div
                    ref={terminalRef}
                    className="flex-1 p-4 overflow-y-auto font-mono text-sm custom-scrollbar"
                >
                    {/* Command History */}
                    {history.map((item, index) => {
                        // Check if the current item is the active HelpMenuInteractive
                        const isHelpMenuInteractiveOutput =
                            terminalMode === "helpMenu" &&
                            item.input === "help" &&
                            index === history.length - 1; // It's the last item in history

                        return (
                            <div key={index} className="mb-4">
                                {/* Don't show "vishal@portfolio:~$ welcome" for the initial message */}
                                {item.input !== "welcome" && (
                                    <div className="text-green-400 mb-2">
                                        vishal@portfolio:
                                        <span className="text-blue-300">{currentPath}</span>${" "}
                                        <span className="text-white">{item.input}</span>
                                    </div>
                                )}
                                <div className="ml-0">
                                    {isHelpMenuInteractiveOutput ? (
                                        <HelpMenuInteractive
                                            commands={commands}
                                            selectedIndex={helpMenuSelectedIndex}
                                            onSelectCommand={(selectedCmd) => {
                                                executeCommand(selectedCmd);
                                                setTerminalMode("input");
                                                setHelpMenuSelectedIndex(-1);
                                            }}
                                        />
                                    ) : (
                                        item.output
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Command Input */}
                    <div className="flex items-center py-2">
                        <span className="text-green-400 mr-2">
                            vishal@portfolio:
                            <span className="text-blue-300">{currentPath}</span>$
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown} // Use the unified handleKeyDown
                            className="flex-1 bg-transparent text-white outline-none font-mono placeholder-white/50"
                            placeholder={terminalMode === "helpMenu" ? "" : "Type a command... (try 'help')"}
                            readOnly={terminalMode === "helpMenu"} // Prevent direct typing when in menu mode
                        />
                        {terminalMode !== "helpMenu" && (
                            <span className="text-green-400 animate-pulse ml-1">_</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tailwind CSS and Custom CSS for animations and scrollbar */}
            <style jsx>{`
                @keyframes particle-float {
                    0% {
                        transform: translateY(0vh) translateX(0vw) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-120vh) translateX(5vw) rotate(360deg);
                        opacity: 0;
                    }
                }

                .animate-particle-float {
                    animation: particle-float 25s infinite linear;
                }

                /* Custom Scrollbar Styles for the terminal content area */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(60, 255, 120, 0.6); /* Greenish color */
                    border-radius: 10px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(60, 255, 120, 0.8);
                }
            `}</style>
        </div>
    );
};

export default TerminalPortfolio;