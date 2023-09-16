import { Text } from "slate";
import escapeHtml from "escape-html";

export const slateSerializer = value => {
  const serialize = node => {
    if (Text.isText(node)) {
      return escapeHtml(node.text);
    }

    const children = node.children.map(n => serialize(n)).join("");

    switch (node.type) {
      case "quote":
        return `<blockquote><p>${children}</p></blockquote>`;
      case "paragraph":
        return `<p>${children}</p>`;
      case "link":
        return `<a href="${escapeHtml(node.url)}">${children}</a>`;
      case "ordered-list":
        return `<ol>${children}</ol>`;
      case "unordered-list":
        return `<ul>${children}</ul>`;
      case "list-item":
        return `<li>${children}</li>`;
      case "block-quote":
        const style = {
          borderLeft: "2px solid #a0aec0",
          margi: "8px 0",
          padddingLeft: "8px",
          fontStyle: "italic"
        };
        return `<blockquote style="${style}">${children}</blockquote>`;
      default:
        return children;
    }
  };

  return serialize({ children: value });
};
