import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-tsx';
import { useEffect, useMemo, useState } from 'react';
import Editor from 'react-simple-code-editor';
import './styles/prism-theme.css';
import SettingsModal from './components/SettingsModal/SettingsModal';

const languages = [
  { value: 'python', label: 'Python', prism: 'python' },
  { value: 'javascript', label: 'JavaScript', prism: 'javascript' },
  { value: 'jsx', label: 'React (JSX)', prism: 'jsx' },
];

const initialSnippets = {
  python: [
    'def factorial(n: int) -> int:',
    '    """Return n! using recursion."""',
    '    if n <= 1:',
    '        return 1',
    '    return n * factorial(n - 1)',
    '',
    '',
    'def explain_factorial(values: list[int]) -> dict[int, int]:',
    '    return {value: factorial(value) for value in values}',
  ].join('\n'),
  javascript: [
    'export const fetchUser = async (id) => {',
    '  const response = await fetch(`/api/users/${id}`)',
    '  if (!response.ok) {',
    "    throw new Error('Unable to load user')",
    '  }',
    '  const data = await response.json()',
    '  return {',
    '    id: data.id,',
    '    fullName: `${data.firstName} ${data.lastName}`,',
    '    teams: data.teams ?? [],',
    '  }',
    '}',
  ].join('\n'),
  jsx: [
    "import { useEffect, useState } from 'react'",
    '',
    'export function NotificationsBadge() {',
    '  const [unread, setUnread] = useState(0)',
    '',
    '  useEffect(() => {',
    '    const subscription = subscribeToNotifications(count => setUnread(count))',
    '    return () => subscription.unsubscribe()',
    '  }, [])',
    '',
    '  if (unread === 0) {',
    '    return <span className="badge">All caught up</span>',
    '  }',
    '',
    '  return <span className="badge badge--alert">{unread} pending alerts</span>',
    '}',
  ].join('\n'),
};

const knowledgeBase = {
  python: {
    summary:
      'Đoạn script dùng đệ quy để tính giai thừa và dựng dict ánh xạ giá trị với kết quả.',
    insights: [
      'Kiểm tra điều kiện cơ sở n <= 1 để tránh đệ quy vô hạn.',
      'Sử dụng dictionary comprehension giúp trả kết quả gọn với nhiều đầu vào.',
      'Kiểu trả về rõ ràng hỗ trợ việc linting và tài liệu hoá.',
    ],
  },
  javascript: {
    summary:
      'Hàm bất đồng bộ truy cập API người dùng, xử lý lỗi và chuẩn hoá dữ liệu trả về.',
    insights: [
      'Luôn kiểm tra response.ok trước khi parse JSON để tránh lỗi ngầm.',
      'Sử dụng toán tử nullish coalescing (??) để khai báo giá trị mặc định.',
      'Tách logic định dạng tên giúp frontend tái sử dụng dễ dàng.',
    ],
  },
  jsx: {
    summary:
      'Component React hiển thị huy hiệu thông báo theo số lượng chưa đọc lấy từ subscription.',
    insights: [
      'Cleanup trong useEffect bảo đảm huỷ đăng ký khi component unmount.',
      'Điều kiện trả về sớm giúp giao diện rõ ràng hơn.',
      'Class utility có thể dùng cùng Tailwind hoặc CSS Modules tuỳ dự án.',
    ],
  },
};

const featureTiles = [
  {
    title: 'Giải thích tổng quan',
    caption:
      'Tóm tắt logic đoạn code thành ngôn ngữ dễ hiểu chỉ với một cú nhấp.',
    icon: '🧠',
  },
  {
    title: 'Giải thích từng dòng',
    caption:
      'Highlight từng dòng và giải thích tác dụng giúp người mới dễ theo kịp.',
    icon: '🔍',
  },
  {
    title: 'Hỗ trợ nhiều ngôn ngữ',
    caption: 'Chuyển đổi nhanh giữa Python, JavaScript và React JSX.',
    icon: '🌐',
  },
  {
    title: 'Lưu phiên làm việc',
    caption: 'Đăng nhập để đồng bộ lịch sử giải thích và chia sẻ với mentor.',
    icon: '📦',
  },
];

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') ?? 'dark',
  );
  const [language, setLanguage] = useState(languages[0].value);
  const [codeMap, setCodeMap] = useState(initialSnippets);
  const [authTab, setAuthTab] = useState('login');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const currentLanguage =
    languages.find((item) => item.value === language) ?? languages[0];
  const activeCode = codeMap[language];

  const explanation = useMemo(() => {
    const lines = activeCode.split('\n');
    const details = lines.map((line, index) => {
      const content = line.trim();
      if (!content) {
        return `Dòng ${index + 1}: (trống để tạo khoảng thở cho người đọc)`;
      }
      if (content.startsWith('#') || content.startsWith('//')) {
        return `Dòng ${index + 1}: Chú thích – ${content.replace(
          /^([#/\s]+)/,
          '',
        )}`;
      }
      return `Dòng ${index + 1}: ${content}`;
    });

    return {
      summary:
        knowledgeBase[language]?.summary ??
        'Đoạn code đang chờ được AI giải thích.',
      insights: knowledgeBase[language]?.insights ?? [],
      details,
    };
  }, [activeCode, language]);

  const highlightCode = (codeText) => {
    const grammar =
      Prism.languages[currentLanguage.prism] ?? Prism.languages.javascript;
    return Prism.highlight(codeText, grammar, currentLanguage.prism);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleCodeChange = (value) => {
    setCodeMap((prev) => ({
      ...prev,
      [language]: value,
    }));
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-1/2 h-80 w-80 translate-x-1/2 rounded-full bg-sky-400/30 blur-3xl dark:bg-sky-500/20" />
      <div className="pointer-events-none absolute top-1/3 left-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[120px] dark:bg-indigo-500/20" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-5 pb-20 pt-10 sm:px-10">
        <nav className="flex items-center justify-between rounded-full border border-slate-200/60 bg-white/80 px-5 py-3 shadow-lg shadow-slate-200/30 backdrop-blur dark:border-slate-800/60 dark:bg-midnight-900/80 dark:shadow-black/50">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-lg font-bold text-white shadow-glow">
              CE
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
                Code Explainer
              </p>
              <h1 className="text-base font-semibold text-slate-900 dark:text-white">
                AI Assistant for Junior Devs
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-300 sm:flex">
              <button className="rounded-full px-4 py-1.5 transition hover:text-sky-500 dark:hover:text-sky-300">
                Sản phẩm
              </button>
              <button className="rounded-full px-4 py-1.5 transition hover:text-sky-500 dark:hover:text-sky-300">
                Giá
              </button>
              <button className="rounded-full px-4 py-1.5 transition hover:text-sky-500 dark:hover:text-sky-300">
                Tài liệu
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                setTheme((mode) => (mode === 'dark' ? 'light' : 'dark'))
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-sky-400 hover:text-sky-500 dark:border-slate-700 dark:bg-midnight-800 dark:hover:border-slate-500 dark:hover:text-sky-300"
              aria-label="Đổi theme"
            >
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 18a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm0-14a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1zm9 7a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-2a1 1 0 0 1 0-2zm-14 1a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm11.07 6.07a1 1 0 0 1 1.41 1.41l-1.42 1.42a1 1 0 0 1-1.41-1.41zM7.34 5.64A1 1 0 1 1 5.93 4.2l1.42-1.41A1 1 0 0 1 8.76 4.2zM5.64 18.36a1 1 0 1 1-1.41-1.41l1.42-1.42a1 1 0 0 1 1.41 1.41zM18.36 5.64a1 1 0 0 1-1.41-1.41l1.42-1.42a1 1 0 1 1 1.41 1.41z" />
                </svg>
              )}
            </button>
            <button className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-sky-300 sm:block">
              Đăng nhập
            </button>
            <button className="hidden rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 sm:block">
              Đăng ký
            </button>
          </div>
        </nav>

        <header className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 backdrop-blur dark:border-slate-700/80 dark:bg-midnight-900/70 dark:text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              AI Code Mentor
            </span>
            <h2 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              Hiểu code phức tạp, tự tin góp ý cùng đội ngũ chỉ trong vài giây.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Code Explainer giúp bạn giải thích bất kỳ đoạn code nào bằng tiếng
              Việt dễ hiểu. Chọn ngôn ngữ, bấm "Giải thích" và nhận ngay phần
              tổng quan cùng giải thích từng dòng cho người mới bắt đầu.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110">
                <span className="relative z-10">Bắt đầu giải thích</span>
                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
                  →
                </span>
                <span className="absolute inset-0 rounded-full opacity-0 transition group-hover:opacity-100">
                  <span className="absolute inset-0 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </span>
              </button>
              <button className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-sky-300">
                Xem demo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M5 3v18l15-9-15-9z" />
                </svg>
              </button>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 text-left shadow-lg shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-midnight-900/70 dark:shadow-black/40">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Ngôn ngữ
                </dt>
                <dd className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  20+
                </dd>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Dự kiến phát triển thêm TypeScript, Go, Java.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 text-left shadow-lg shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-midnight-900/70 dark:shadow-black/40">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Thời gian
                </dt>
                <dd className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  5 giây
                </dd>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  AI phân tích code và trả lời gần như tức thì.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 text-left shadow-lg shadow-slate-200/40 backdrop-blur dark:border-slate-700/70 dark:bg-midnight-900/70 dark:shadow-black/40">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Hài lòng
                </dt>
                <dd className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  98%
                </dd>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Khảo sát nội bộ từ hơn 600 lập trình viên mới.
                </p>
              </div>
            </dl>
          </div>

          <div className="relative rounded-3xl border border-slate-200/60 bg-white/60 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-midnight-900/60 dark:shadow-black/70">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-sky-400/10 via-transparent to-purple-500/10" />
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-glow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    Chọn ngôn ngữ
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tự động highlight và format
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow dark:border-slate-700 dark:bg-midnight-800 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Đang sẵn sàng
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              {languages.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleLanguageChange(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${option.value === language
                    ? 'border-transparent bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white shadow-glow'
                    : 'border-slate-200/80 bg-white/50 text-slate-600 hover:border-sky-400 hover:text-sky-500 dark:border-slate-700/70 dark:bg-midnight-900/60 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-sky-300'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/95 p-4 shadow-xl shadow-slate-900/50 dark:border-slate-700 dark:bg-slate-950/90">
              <div className="pointer-events-none absolute -top-24 right-10 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
              <Editor
                value={activeCode}
                onValueChange={handleCodeChange}
                highlight={highlightCode}
                padding={20}
                className="code-editor text-sm leading-relaxed"
                textareaId="code-input"
                aria-label="Code input"
              />
              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-emerald-400/40 transition hover:brightness-110">
                Giải thích ngay
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M13 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_minmax(0,1.4fr)]">
          <div className="grid gap-6 sm:grid-cols-2">
            {featureTiles.map((tile) => (
              <article
                key={tile.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-glow dark:border-slate-700/80 dark:bg-midnight-900/70 dark:shadow-black/50"
              >
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -top-20 right-10 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" />
                </div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-2xl shadow-glow">
                  <span>{tile.icon}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  {tile.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {tile.caption}
                </p>
              </article>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <article className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-700/70 dark:bg-midnight-900/70 dark:shadow-black/60">
              <header className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                    Tổng quan
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                    Giải thích chung
                  </h4>
                </div>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                  98% chính xác
                </span>
              </header>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {explanation.summary}
              </p>
              <ul className="grid gap-3 text-sm text-slate-500 dark:text-slate-400">
                {explanation.insights.map((insight) => (
                  <li
                    key={insight}
                    className="flex items-start gap-2 rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 shadow-sm shadow-slate-200/40 dark:border-slate-700/60 dark:bg-midnight-900/70 dark:text-slate-300"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-700/70 dark:bg-midnight-900/70 dark:shadow-black/60">
              <header>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  Line-by-line
                </p>
                <h4 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Giải thích từng dòng
                </h4>
              </header>
              <div
                className="space-y-3 overflow-y-auto pr-2 text-sm text-slate-600 dark:text-slate-300"
                style={{ maxHeight: '260px' }}
              >
                {explanation.details.map((line) => (
                  <p
                    key={line}
                    className="rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-3 shadow-sm shadow-slate-200/30 dark:border-slate-700/60 dark:bg-midnight-900/60"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="mt-16 grid gap-8 rounded-3xl border border-slate-200/60 bg-white/70 p-10 shadow-2xl shadow-slate-200/60 backdrop-blur dark:border-slate-700/70 dark:bg-midnight-900/70 dark:shadow-black/70 lg:grid-cols-[1.2fr_minmax(0,0.9fr)]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              Cộng đồng
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              Đăng nhập để lưu phiên bản giải thích ưa thích của bạn
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Trải nghiệm miễn phí với giới hạn 20 lần giải thích mỗi ngày. Nâng
              cấp lên tài khoản Pro để mở kho kiến thức, nhận đề xuất cải tiến
              code và kết nối mentor theo giờ.
            </p>
            <ul className="grid gap-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-500">
                  ✓
                </span>
                Lưu tự động mọi phiên làm việc và đồng bộ trên mọi thiết bị.
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/20 text-sky-500">
                  ✓
                </span>
                Theo dõi tiến độ học tập qua dashboard trực quan.
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-400/20 text-purple-500">
                  ✓
                </span>
                Nhận gợi ý snippet và test case gợi ý theo ngữ cảnh.
              </li>
            </ul>
          </div>

          <form
            onSubmit={handleAuthSubmit}
            className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-7 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-700/70 dark:bg-midnight-900/80 dark:shadow-black/60"
          >
            <div className="absolute -top-24 right-6 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="mb-6 inline-flex rounded-full border border-slate-200/70 bg-white/90 p-1 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-700/70 dark:bg-midnight-900/90 dark:text-slate-300">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`rounded-full px-4 py-2 transition ${authTab === 'login'
                  ? 'bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white shadow-glow'
                  : 'hover:text-sky-500 dark:hover:text-sky-300'
                  }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`rounded-full px-4 py-2 transition ${authTab === 'register'
                  ? 'bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white shadow-glow'
                  : 'hover:text-sky-500 dark:hover:text-sky-300'
                  }`}
              >
                Đăng ký
              </button>
            </div>

            <div className="space-y-4">
              {authTab === 'register' && (
                <div className="text-sm">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block font-semibold text-slate-600 dark:text-slate-200"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm shadow-slate-200/40 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-midnight-800 dark:text-slate-100 dark:shadow-black/40 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                  />
                </div>
              )}

              <div className="text-sm">
                <label
                  htmlFor="email"
                  className="mb-2 block font-semibold text-slate-600 dark:text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ban@congty.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm shadow-slate-200/40 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-midnight-800 dark:text-slate-100 dark:shadow-black/40 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                />
              </div>

              <div className="text-sm">
                <label
                  htmlFor="password"
                  className="mb-2 block font-semibold text-slate-600 dark:text-slate-200"
                >
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    authTab === 'login' ? 'current-password' : 'new-password'
                  }
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm shadow-slate-200/40 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-midnight-800 dark:text-slate-100 dark:shadow-black/40 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                />
              </div>

              {authTab === 'login' && (
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border border-slate-300 text-sky-500 focus:ring-sky-400 dark:border-slate-600 dark:bg-midnight-800"
                    />
                    Ghi nhớ tài khoản
                  </label>
                  <button
                    type="button"
                    className="font-semibold text-sky-600 hover:underline dark:text-sky-400"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
              >
                {authTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Khi tiếp tục, bạn đồng ý với{' '}
                <button
                  type="button"
                  className="font-semibold text-sky-600 hover:underline dark:text-sky-400"
                >
                  Điều khoản
                </button>{' '}
                và{' '}
                <button
                  type="button"
                  className="font-semibold text-sky-600 hover:underline dark:text-sky-400"
                >
                  Chính sách bảo mật
                </button>
                .
              </p>
            </div>
          </form>
        </section>

        {/* Nút mở modal Settings */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Hiển thị modal nếu bật */}
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}

        <footer className="mt-20 flex flex-col items-center gap-4 pb-10 text-xs text-slate-500 sm:flex-row sm:justify-between dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} Code Explainer. Made with ❤️ tại Việt
            Nam.
          </p>
          <div className="flex items-center gap-4">
            <button className="hover:text-sky-500 dark:hover:text-sky-300">
              Hướng dẫn
            </button>
            <button className="hover:text-sky-500 dark:hover:text-sky-300">
              Blog
            </button>
            <button className="hover:text-sky-500 dark:hover:text-sky-300">
              Hỗ trợ
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
