import Alert from '../common/Alert';

function DocParagraph({ text }) {
  return <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>;
}

function DocHeading({ level, text }) {
  const Tag = level === 2 ? 'h2' : 'h3';
  const className =
    level === 2
      ? 'text-lg font-semibold text-foreground'
      : 'mt-6 mb-2 text-base font-semibold text-foreground first:mt-0';
  return <Tag className={className}>{text}</Tag>;
}

function DocList({ items }) {
  return (
    <ul className="list-disc space-y-1.5 pl-6 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DocCode({ text }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground">
      {text}
    </pre>
  );
}

function DocTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-36 text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted-surface">
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-3 py-2 font-medium text-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')} className="border-b border-border last:border-b-0">
              {row.map((cell, index) => (
                <td key={`${index}-${cell}`} className="px-3 py-2 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocCallout({ variant, title, text }) {
  const alertVariant =
    variant === 'warning' ? 'warning' : variant === 'info' ? 'info' : 'info';
  return (
    <Alert variant={alertVariant} title={title}>
      {text}
    </Alert>
  );
}

function renderBlock(block, index) {
  switch (block.type) {
    case 'paragraph':
      return <DocParagraph key={index} text={block.text} />;
    case 'heading':
      return <DocHeading key={index} level={block.level ?? 3} text={block.text} />;
    case 'list':
      return <DocList key={index} items={block.items} />;
    case 'code':
      return <DocCode key={index} text={block.text} />;
    case 'table':
      return <DocTable key={index} headers={block.headers} rows={block.rows} />;
    case 'callout':
      return (
        <DocCallout
          key={index}
          variant={block.variant}
          title={block.title}
          text={block.text}
        />
      );
    default:
      return null;
  }
}

export default function DocContent({ content }) {
  if (!content?.blocks?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {content.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
