import { FC } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism.css';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
  const highlighted = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.typescript,
    language
  );

  return (
    <div className="relative rounded-md bg-slate-950 p-4 my-2">
      <pre className="overflow-x-auto">
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
};
