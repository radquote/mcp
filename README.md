# rad quote MCP

The rad quote MCP server lets you create projects from uploaded files directly from your AI assistant.

Pick the install path that matches you:

| Your situation | Path |
| --- | --- |
| I use **Claude Desktop** and do not want to install Node or open a terminal | **[Claude Desktop UI](./docs/claude-desktop-gui.md)** — paste `https://api.limits.run/mcp?key=<YOUR_API_KEY>` into the Custom Connector form |
| I am a developer, I have Node 18+, I use Cursor / Codex / Windsurf / Claude Code | **[One-command CLI](#one-command-cli)** |
| I want a double-click install for Claude Desktop and have Node 18+ on my machine | **[.mcpb bundle](./docs/mcpb.md)** |

---

## One-command CLI

```bash
npx @radquote/mcp-setup@alpha install --env=stage
```

Requires Node 18+. Detects every supported client on your machine and writes the configuration for it. By default it configures all of them; pass `--client=<id>` to target one, or `--pick` to choose interactively.

Supported clients: `claude-code`, `claude-desktop`, `cursor`, `windsurf`, `codex`.

More detail: [`packages/setup/README.md`](./packages/setup/README.md).

## Manual config snippets

If you prefer to edit configuration files yourself, copy the snippet for your client from [`examples/`](./examples). Replace `<MCP_URL>` with `https://api.limits.run/mcp` (stage) and `<YOUR_API_KEY>` with your rad quote workspace API key.

## What you get

Three tools appear in your AI assistant:

- `get_upload_url` — obtain a short-lived signed URL for uploading one file.
- `create_project_import_job` — create a new project by importing tasks from previously uploaded files; optionally copy rates from an existing project as a read-only template.
- `get_project_import_job` — look up the current status of an import job by id. When the job is complete, the response contains `project_id` of the newly created project; when it has failed, the response carries a human-readable `error`.

And one orchestration prompt:

- `estimate_project_workflow` — a single entry point that walks the agent through the full flow: upload the file, create the import job, poll the job every 15 seconds, and reply with a link to the resulting project (or with the failure reason). Arguments: `file` (required absolute local path), `title`, `client_title`, `minimum_budget`, `source_project_id` (all optional).

## Workflow: create a project from a file

The `estimate_project_workflow` prompt packages the full recipe so you do not have to spell out the steps to the agent. Invocation depends on the client:

- **Claude Code:** `/mcp__radquote-stage__estimate_project_workflow`, then fill in `file` and the optional fields.
- **Claude Desktop / Cursor / Windsurf:** pick `estimate_project_workflow` from your client's prompts menu and fill the arguments.
- **Codex:** invoke via your normal MCP prompt command.

> The workflow requires the agent to PUT the file to a signed URL. That means it works in clients that can run shell commands (Claude Code, Cursor, Codex, Windsurf) but not in Claude Desktop's built-in chat, which cannot perform arbitrary HTTP uploads. In Claude Desktop, upload the file some other way and then invoke `create_project_import_job` with its public URL directly.

For reference, the PUT step looks like:

```bash
curl -X PUT --upload-file ./my-file.xlsx \
  -H "Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \
  "<upload_url>"
```

The response is `HTTP 201` with a JSON body containing `url` — feed that into `create_project_import_job.file`.

## Status

**Pre-release.** The production endpoint URL and the MCP Registry listing are being finalized. Currently only the **stage** environment (`https://api.limits.run/mcp`) is wired up — intended for internal QA and partner integration. Running the CLI with `--env=prod` prints a clear "not configured" message until production ships.

See [`docs/stage.md`](./docs/stage.md) for details on the stage environment.

## License

[MIT](./LICENSE)
