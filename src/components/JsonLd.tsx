interface JsonLdProps {
  data: Record<string, unknown>;
}

/** `<` is escaped so page copy can never close the script element early. */
const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);

export default JsonLd;
