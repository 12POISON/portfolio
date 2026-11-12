// Chapter header — mono index label + crosshair + binary row texture.
// Pure server markup; the rule line is animated by the director via [data-rule].

export default function ChapHead({ num, title, note }: { num: string; title: string; note?: string }) {
  return (
    <header className="chap-head">
      <span className="mono chap-num" data-reveal>
        {num} / {title}
      </span>
      <span className="chap-rule" data-rule aria-hidden="true" />
      <span className="mono chap-bin" aria-hidden="true" data-reveal>
        01001&nbsp;10110&nbsp;01101
      </span>
      {note ? (
        <span className="mono chap-note" data-reveal>
          {note}
        </span>
      ) : null}
      <span className="chap-cross" aria-hidden="true" data-reveal>
        +
      </span>
    </header>
  );
}
