import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  GraduationCap,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { verifyDegree, VerifyDegreeResponse } from '../../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  degreeCard?: VerifyDegreeResponse;
  statusBadge?: 'verified' | 'revoked' | 'not_found' | 'error';
  isSearchingLedger?: boolean;
}

const QUICK_SUGGESTIONS = [
  { label: '🔍 Verify 22CS100', query: 'Verify roll number 22CS100' },
  { label: '🛡️ How does blockchain prevent fake degrees?', query: 'How does blockchain make certificates tamper-proof?' },
  { label: '🎓 How do students access their diploma?', query: 'How do students log in and access their degree?' },
  { label: '⚠️ What does a Revoked status mean?', query: 'What happens when a degree is revoked?' },
  { label: '🏛️ Which universities are on the network?', query: 'Which universities participate in this consortium?' },
];

export default function VaultAIChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Hello! I am **VaultAI**, your decentralized credential assistant. I can query the blockchain in real time to verify academic degrees, explain our cryptographic security, or guide you through your student portal.\n\nTry asking me to verify a student roll number, or choose a topic below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Extract roll number or GUCI from text query
  const extractCredentialId = (text: string): string | null => {
    // Matches patterns like "MUET-22CS100", "22CS100", "22cs001", "21CS045", "0x..."
    const guciMatch = text.match(/\b([A-Z]{3,4}-[0-9]{2}[A-Za-z]{2,4}[0-9]{2,4})\b/i);
    if (guciMatch) return guciMatch[1].toUpperCase();

    const rollMatch = text.match(/\b([0-9]{2}[A-Za-z]{2,4}[0-9]{2,4})\b/i);
    if (rollMatch) return rollMatch[1].toUpperCase();

    const hexMatch = text.match(/\b(0x[a-fA-F0-9]{10,64})\b/);
    if (hexMatch) return hexMatch[1];

    return null;
  };

  const handleSendMessage = async (userQuery: string) => {
    const trimmed = userQuery.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const credentialTarget = extractCredentialId(trimmed);

    // If query contains a Roll Number or GUCI, query the live blockchain ledger!
    if (credentialTarget) {
      try {
        const result = await verifyDegree(credentialTarget);

        setTimeout(() => {
          setIsTyping(false);

          if (result && result.status !== 'NOT_FOUND' && result.status !== 'ERROR') {
            const isRevoked = result.revoked || result.status === 'REVOKED';

            if (isRevoked) {
              const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                sender: 'ai',
                text: `⚠️ **Notice of Revocation**: Credential for **${result.studentName}** (${result.rollNo}) exists on the blockchain ledger, but was **OFFICIALLY REVOKED & CANCELLED** by the University Syndicate on ${
                  result.revocationDate
                    ? new Date(result.revocationDate * 1000).toLocaleDateString()
                    : 'record'
                }.\n\n**Reason:** *"${result.revocationReason || 'Administrative Syndicate Cancellation'}"*\n\nAny physical or digital certificate bearing these details is null and void.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                degreeCard: result,
                statusBadge: 'revoked',
              };
              setMessages((prev) => [...prev, aiMsg]);
            } else {
              const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                sender: 'ai',
                text: `✅ **Official Degree Verified!** I queried the consortium blockchain ledger for **${credentialTarget}**. The cryptographic hash matches the smart contract record permanently anchored on-chain.\n\n- **Graduate:** ${result.studentName}\n- **Roll Number:** ${result.rollNo}\n- **Institution:** ${result.universityCode}\n- **Department:** ${result.department}\n- **CGPA:** ${result.cgpa}\n- **Status:** Active & Conferred`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                degreeCard: result,
                statusBadge: 'verified',
              };
              setMessages((prev) => [...prev, aiMsg]);
            }
          } else {
            const aiMsg: ChatMessage = {
              id: `ai-${Date.now()}`,
              sender: 'ai',
              text: `❌ **No On-Chain Record Found**: I scanned the decentralized ledger for **${credentialTarget}**, but no official degree credential has been minted under this identifier.\n\nPlease ensure the Roll Number is formatted correctly (e.g., \`22CS100\`) or verify that the university registrar has published the graduation batch.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              statusBadge: 'not_found',
            };
            setMessages((prev) => [...prev, aiMsg]);
          }
        }, 800);
      } catch (err: any) {
        setTimeout(() => {
          setIsTyping(false);
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `⚠️ I encountered an issue querying the consortium node for **${credentialTarget}**. Please ensure the backend and blockchain network are reachable, or try checking directly via the [Verify Portal](/verify?id=${credentialTarget}).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            statusBadge: 'error',
          };
          setMessages((prev) => [...prev, aiMsg]);
        }, 600);
      }
      return;
    }

    // Knowledge Base responses
    const lower = trimmed.toLowerCase();

    setTimeout(() => {
      setIsTyping(false);
      let reply = '';

      if (lower.includes('blockchain') || lower.includes('tamper') || lower.includes('fake') || lower.includes('forge') || lower.includes('secure')) {
        reply = `🛡️ **How Blockchain Prevents Forged Degrees:**\n\n1. **Cryptographic Hashing:** When the university issues a degree, its core details (Roll No, Name, CGPA, University) are hashed using SHA-256 and Keccak-256 into a Global Unique Credential ID (GUCI).\n2. **Immutable On-Chain Anchor:** This cryptographic fingerprint is written to our Ethereum smart contract (\`DegreeVault.sol\`). Blocks are sealed by consensus.\n3. **Zero Tampering:** Even if an applicant edits a single character or changes their GPA in Photoshop or a database, the hash of that altered document will completely fail the verification check against the ledger.`;
      } else if (lower.includes('student') || lower.includes('login') || lower.includes('download') || lower.includes('access') || lower.includes('pin')) {
        reply = `🎓 **Student Portal Access:**\n\n- Students can log in at the [Student Portal](/student) by selecting their university and entering their **Roll Number** (e.g. \`22CS100\`) and confidential **6-digit PIN** provided by their registrar.\n- PINs are protected with salted BCrypt hashing and rate-limited against brute-force attacks.\n- Once signed in, graduates can view their high-res ivory graduation parchment, print physical copies, export verification links, or add the credential to LinkedIn!`;
      } else if (lower.includes('revoke') || lower.includes('cancellation') || lower.includes('cancel')) {
        reply = `⚠️ **Degree Revocation Protocol:**\n\n- If a university syndicate or Higher Education Commission revokes an academic award (e.g., due to plagiarism or disciplinary action), authorized officers execute \`revokeDegree()\` on the smart contract.\n- The credential's status is permanently updated on-chain to **REVOKED** along with an official timestamp and cancellation reason.\n- Revoked degrees display an official Red Syndicate Warning Watermark and cannot be printed, verified, or shared.`;
      } else if (lower.includes('universit') || lower.includes('consortium') || lower.includes('who') || lower.includes('partner') || lower.includes('muet') || lower.includes('ned') || lower.includes('nust') || lower.includes('fast')) {
        reply = `🏛️ **Participating Consortium Universities:**\n\nOur decentralized verification network currently features accredited consortium nodes for:\n\n1. **Mehran UET (MUET)** — Jamshoro, Sindh\n2. **NED University (NED)** — Karachi, Sindh\n3. **NUST** — Islamabad\n4. **FAST National University (FAST-NU)** — Islamabad / Nationwide\n\nEach university runs authorized registrar accounts to mint valid credentials.`;
      } else if (lower.includes('ai') || lower.includes('scanner') || lower.includes('ocr') || lower.includes('photo') || lower.includes('scan')) {
        reply = `🤖 **Upcoming AI Document Forensics:**\n\nWe are building an **AI Document Scanner**! When an employer receives a scanned paper copy or photo of a degree, the AI uses OCR to extract the student's name, roll number, and CGPA, then compares them side-by-side against the blockchain ledger to immediately catch any photoshopped text or forged grades.`;
      } else if (lower.includes('admin') || lower.includes('issue') || lower.includes('csv') || lower.includes('registrar')) {
        reply = `⚙️ **Registrar & Administrative Issuance:**\n\n- Authorized university officers sign in at the [Admin Portal](/admin).\n- Officers can issue single degrees instantly or upload large graduation batches via CSV + ZIP archive.\n- Every issuance is cryptographically signed by the registrar's authorized wallet address and recorded directly to the smart contract.`;
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('assalam')) {
        reply = `Hello! How can I assist you with your academic degree verification today? You can ask me to verify a roll number (e.g., \`verify 22CS100\`), or ask how our blockchain consensus works.`;
      } else {
        reply = `I can help you with that! Here are the best ways I can assist:\n\n- **Live Blockchain Verification:** Type *"Verify <Roll Number>"* (e.g., \`Verify 22CS100\`) to check on-chain records.\n- **Security & Architecture:** Ask *"How does blockchain prevent tampering?"*\n- **Student Services:** Ask *"How do I view or print my degree?"*\n- **Revocation Procedures:** Ask *"What is the revocation process?"*`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: 'Conversation cleared. How can I help you today? You can verify any roll number or ask questions about our blockchain credential network.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* ── Floating AI Trigger Button ────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-brand via-teal-600 to-secondary-blue text-white shadow-elevated hover:shadow-glow-teal transition-all duration-300 cursor-pointer border border-white/20"
          aria-label="Open VaultAI Chatbot"
        >
          {/* Subtle Ambient Pulse Aura */}
          <span className="absolute -inset-1 rounded-full bg-teal-brand/30 blur-md group-hover:bg-teal-brand/50 transition-all animate-pulse" />

          <div className="relative flex items-center justify-center">
            {isOpen ? <X size={20} className="relative z-10" /> : <Sparkles size={20} className="relative z-10" />}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-surface-card" />
          </div>

          <span className="relative z-10 text-xs font-bold tracking-wide">
            {isOpen ? 'Close' : 'VaultAI'}
          </span>
        </motion.button>
      </div>

      {/* ── Expandable Glassmorphism Chat Drawer ─────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 shadow-2xl rounded-3xl border border-border-main/80 bg-surface-card/95 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 print:hidden ${
              isExpanded
                ? 'bottom-6 right-6 w-[94vw] sm:w-[600px] h-[85vh] max-h-[800px]'
                : 'bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh]'
            }`}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border-main bg-gradient-to-r from-teal-brand/10 via-surface-card to-secondary-blue/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-brand to-secondary-blue text-white flex items-center justify-center shadow-xs">
                  <Bot size={20} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface-card" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-content-main tracking-tight">
                      VaultAI Assistant
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-md bg-teal-brand/15 text-teal-brand text-[10px] font-bold uppercase tracking-wider">
                      Live Node
                    </span>
                  </div>
                  <p className="text-[11px] text-content-muted">
                    Blockchain & Credential Intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-content-muted">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg hover:bg-surface-muted hover:text-content-main transition-colors cursor-pointer"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Restore window size' : 'Expand window'}
                  className="p-1.5 rounded-lg hover:bg-surface-muted hover:text-content-main transition-colors cursor-pointer hidden sm:block"
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg hover:bg-surface-muted hover:text-content-main transition-colors cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0 border border-teal-brand/20 mt-0.5 shadow-2xs">
                        <Bot size={15} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap break-words ${
                        isUser
                          ? 'bg-teal-brand text-white font-medium rounded-tr-xs shadow-xs'
                          : 'bg-surface-page/90 text-content-main border border-border-main rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {/* Render formatted message text */}
                      <div className="prose prose-xs dark:prose-invert max-w-none">
                        {msg.text}
                      </div>

                      {/* Interactive Embedded Degree Result Card */}
                      {msg.degreeCard && (
                        <div className="mt-3 pt-3 border-t border-border-subtle/80 space-y-2">
                          <div
                            className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 ${
                              msg.statusBadge === 'revoked'
                                ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                                : 'bg-teal-brand/5 border-teal-brand/30 text-content-main'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1">
                                {msg.statusBadge === 'revoked' ? (
                                  <>
                                    <AlertTriangle size={14} className="text-red-500 shrink-0" />
                                    <span>REVOKED CREDENTIAL</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                    <span className="text-teal-brand">AUTHENTIC ON-CHAIN RECORD</span>
                                  </>
                                )}
                              </div>
                              <p className="text-xs font-extrabold text-content-main">
                                {msg.degreeCard.studentName}
                              </p>
                              <p className="text-[11px] text-content-secondary mt-0.5">
                                {msg.degreeCard.department} • {msg.degreeCard.universityCode}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-[10px] text-content-muted">
                                <span>Roll: <strong className="text-content-main">{msg.degreeCard.rollNo}</strong></span>
                                <span>•</span>
                                <span>CGPA: <strong className="text-content-main">{msg.degreeCard.cgpa}</strong></span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/verify?id=${msg.degreeCard?.globalCredentialId || msg.degreeCard?.rollNo}`);
                              }}
                              className="px-2 py-1 rounded-lg bg-surface-card hover:bg-surface-muted text-content-main border border-border-main text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-2xs"
                            >
                              <span>View</span>
                              <ExternalLink size={10} />
                            </button>
                          </div>
                        </div>
                      )}

                      <span
                        className={`block text-[9px] mt-1.5 ${
                          isUser ? 'text-teal-100 text-right' : 'text-content-muted text-left'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-xl bg-surface-muted text-content-main flex items-center justify-center shrink-0 border border-border-subtle mt-0.5">
                        <User size={15} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Animation */}
              {isTyping && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-xl bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0 border border-teal-brand/20 shadow-2xs">
                    <Bot size={15} />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-surface-page/90 border border-border-main flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-brand animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] text-content-muted ml-2 font-medium">Querying ledger...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 bg-surface-muted/40 border-t border-border-subtle/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(s.query)}
                  className="px-2.5 py-1 rounded-full bg-surface-card hover:bg-teal-brand/10 text-content-secondary hover:text-teal-brand border border-border-subtle hover:border-teal-brand/30 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 border-t border-border-main bg-surface-card flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask or enter Roll No (e.g. 22CS100)..."
                className="flex-1 h-10 px-3.5 rounded-xl bg-surface-page border border-border-main text-content-main text-xs font-medium placeholder:text-content-muted/70 focus:ring-2 focus:ring-teal-brand/40 focus:border-teal-brand outline-none transition-all shadow-xs"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-teal-brand hover:bg-teal-brand/90 text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-button-primary hover:shadow-button-primary-hover"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
