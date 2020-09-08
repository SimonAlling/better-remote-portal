# Better Remote Portal

## Build

```bash
npm ci
export REMOTE_PORTAL_HOSTNAME=portal.example.com
npm run build
```

## Install

### Firefox

```bash
firefox dist/*.user.js
```

### Chrome

```bash
google-chrome dist/*.user.js
```
