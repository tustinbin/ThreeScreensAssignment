# One Fact — architecture

Vanilla ES modules. No bundler required — serve the folder over HTTP.

```
src/
  main.js              bootstrap + event wiring
  config.js            constants / storage keys
  data/interest-tree.js
  lib/                 storage + small utils
  api/wikipedia.js     HTTP only
  domain/              pure logic (parse, match, format)
  state/store.js       single mutable store + persistence
  ui/                  DOM reads/writes
  services/            use-cases (load fact, save/heart/share)
```

**Rules of thumb**
- `domain/` and `lib/` stay free of DOM and `store`
- `api/` only fetches
- `ui/` only renders; mutations go through `store` or `services`
- `services/` orchestrate API + domain + store + UI
