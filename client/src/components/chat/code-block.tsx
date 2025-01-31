import { FC } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
  // Extract the language from markdown code blocks if present
  const match = code.match(/^```(\w+)/);
  const detectedLang = match ? match[1] : language;
  const cleanCode = code.replace(/^```(\w+)?\n/, '').replace(/```$/, '');

  const highlighted = Prism.highlight(
    cleanCode,
    Prism.languages[detectedLang] || Prism.languages.typescript,
    detectedLang
  );

  return (
    <div className="relative rounded-lg bg-slate-950 p-4 my-4">
      <div className="absolute right-3 top-3 text-xs text-slate-400">
        {detectedLang}
      </div>
      <pre className="overflow-x-auto">
        <code
          className={`language-${detectedLang} text-sm`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
};