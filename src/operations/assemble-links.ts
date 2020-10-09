import { log } from "userscripter/lib";

type TextNodeAndLink = {
    node: Text
    link: IndexedLink
}

type IndexedLink = {
    index: number
    url: string
}

export default function(e: {
    body: HTMLElement,
}) {
    if (hasHiddenTargetDomain(e.body.ownerDocument.location.pathname)) {
        // We don't return an error (string) because this is not something we can do anything about.
        log.error(`I cannot assemble any link(s) because the target domain has been intentionally hidden.`);
        return;
    }
    const nodesWithMaybeLinks = getTextNodes(e.body).map(node => ({
        node,
        link: extractLink(node),
    }));
    const nodesWithLinks = nodesWithMaybeLinks.filter(hasLink);
    if (nodesWithLinks.length === 0) {
        return `I think there should be at least one link to assemble, but I found none.`;
    }
    for (const { node, link } of nodesWithLinks) {
        const { index, url } = link;
        if (index === -1 || index === undefined) {
            return [
                `I found link pieces and assembled them to`,
                ``,
                `    ${link}`,
                ``,
                `but could not replace them with an actual link.`,
            ].join("\n");
        }
        const linkPart = node.splitText(index);
        const actualLink = document.createElement("a");
        actualLink.href = url;
        actualLink.text = url;
        linkPart.replaceWith(actualLink);
    }
}

export function hasHiddenTargetDomain(pathname: string): boolean {
    // Example URL with hidden target domain: https://portal.example.com/foo/,DanaInfo=.abcdefghijkL1mn2o3456PQr.-,SSL+index.html?foo=bar
    return /\/,DanaInfo=\./.test(pathname);
}

export function extractLink(node: Text): IndexedLink | null {
    // Example URL containing link pieces: https://portal.example.com/foo/,DanaInfo=simonalling.se,SSL+bar.html?baz=qux
    // Assembled URL: https://simonalling.se/foo/bar?baz=qux
    const text = node.textContent as string;
    const REGEX_LINK_PART = /Made ([a-z]+) request for [A-Z]+ (.+?) HTTP\/[\d\.]+ to (.+?):\d+/;
    const match = text.match(REGEX_LINK_PART);
    if (match === null || match === undefined) {
        return null;
    }
    const index = text.search(REGEX_LINK_PART);
    const scheme = match[1];
    const path = match[2];
    const hostname = match[3];
    return {
        index: index,
        url: `${scheme}://${hostname}${path}`,
    };
}

function hasLink(x: { node: Text, link: IndexedLink | null }): x is TextNodeAndLink {
    return x.link !== null;
}

function getTextNodes(node: Node): readonly Text[] {
    return (
        isTextNode(node)
            ? [node]
            : Array.from(node.childNodes).flatMap(getTextNodes)
    );
}

function isTextNode(node: Node): node is Text {
    return node.nodeType === Node.TEXT_NODE; // I think this is safer than `node instanceof Text`.
}
