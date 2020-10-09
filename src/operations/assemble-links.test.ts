import { extractLink, hasHiddenTargetDomain } from "./assemble-links";

it("recognizes when the target domain is hidden", () => {
    expect(hasHiddenTargetDomain(`/foo/,DanaInfo=.abcdefghijkL1mn2o3456PQr.-,SSL+index.html?foo=bar`)).toBe(true);
    expect(hasHiddenTargetDomain(`/foo/,DanaInfo=example.com,SSL+index.html?foo=bar`)).toBe(false);
});

it("works when there's no link to extract and assemble", () => {
    expect(extractLink(new Text(``))).toBe(null);
    expect(extractLink(new Text(`Skip to Content`))).toBe(null);
});

it("can extract an HTTP link", () => {
    expect(extractLink(new Text(
        `Access to the Web site is blocked by your administrator. Please notify your system administrator. Made http request for GET /MicrosoftDocs/azure-docs/issues/62236 HTTP/1.1 to github.com:80`
    ))).toEqual({ index: 98, url: `http://github.com/MicrosoftDocs/azure-docs/issues/62236` });
});

it("can extract an HTTPS link", () => {
    expect(extractLink(new Text(
        `Access to the Web site is blocked by your administrator. Please notify your system administrator. Made https request for GET /MicrosoftDocs/azure-docs/issues/62236 HTTP/1.1 to github.com:443`
    ))).toEqual({ index: 98, url: `https://github.com/MicrosoftDocs/azure-docs/issues/62236` });
});

it("works when there's a query string", () => {
    expect(extractLink(new Text(
        `Access to the Web site is blocked by your administrator. Please notify your system administrator. Made http request for GET /MicrosoftDocs/azure-docs/issues/62236?foo=bar HTTP/1.1 to github.com:80`
    ))).toEqual({ index: 98, url: `http://github.com/MicrosoftDocs/azure-docs/issues/62236?foo=bar` });
});

it("works when path is /", () => {
    expect(extractLink(new Text(
        `Access to the Web site is blocked by your administrator. Please notify your system administrator. Made https request for GET / HTTP/1.1 to example.com:443`
    ))).toEqual({ index: 98, url: `https://example.com/` });
});

it("works with different indices /", () => {
    expect(extractLink(new Text(
        `Access to the Web site is blocked by your administrator. Made https request for GET / HTTP/1.1 to example.com:443`
    ))).toEqual({ index: 57, url: `https://example.com/` });
});
