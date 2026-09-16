export function TechnologyList({ items }: { items: readonly string[] }) {
  return (
    <ul className="inline-tags" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
