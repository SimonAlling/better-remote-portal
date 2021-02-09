# Better Remote Portal

## Build

```bash
npm ci
export REMOTE_PORTAL_HOSTNAME=portal.example.com
npm run build
```

## Install

### Firefox

Install [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey), then install the built userscript:

```bash
firefox dist/*.user.js
```

### Chrome

Install [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=en), then install the built userscript:

```bash
google-chrome dist/*.user.js
```
