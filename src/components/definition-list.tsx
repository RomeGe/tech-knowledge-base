interface DefinitionListProps {
  items: { term: string; definition: string }[];
}

// Styled definition list component
export function DefinitionList({ items }: DefinitionListProps) {
  return (
    <dl className="space-y-4 my-4">
      {items.map((item, i) => (
        <div key={i} className="border-l-2 border-accent-subtle pl-4">
          <dt className="text-sm font-medium text-text-primary mb-1">
            {item.term}
          </dt>
          <dd className="text-sm text-text-secondary leading-relaxed">
            {item.definition}
          </dd>
        </div>
      ))}
    </dl>
  );
}
