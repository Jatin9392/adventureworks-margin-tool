# AdventureWorks Margin Tool - GitHub Pages Version

This folder is the version you can upload to GitHub Pages.

It is static, so it can be shared publicly like:

```text
https://jatin9392.github.io/adventureworks-margin-tool/
```

Important: this version uses `data.json`, which is a snapshot of the SQL Server product data.

The local SQL-backed version is in:

```text
outputs/adventureworks-margin-app
```

Why two versions?

- GitHub Pages can host HTML, CSS, JavaScript, and JSON files.
- GitHub Pages cannot run a backend server.
- GitHub Pages cannot connect directly to your Microsoft SQL Server.

For a public demo, use this folder.
For live daily database data, use the backend/API version and host it on a real server.
