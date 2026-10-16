# claude-code-mods

Three Claude Code mods, changed to work together in the desktop app: the file tree sits inside the Agents pane on the right, and the usage band above the prompt fits on two lines.

| Mod | Upstream | What changed here |
|---|---|---|
| [filetree](plugins/filetree) | [data-goblin/claude-code-filetree](https://github.com/data-goblin/claude-code-filetree) (MIT) | On the desktop the tree also draws inside savvy-progress's Agents pane, below the agents. |
| [savvy-progress](plugins/savvy-progress) | [JohnnyVizz/claude-kit](https://github.com/JohnnyVizz/claude-kit/tree/main/plugins/savvy-progress) (MIT) | The Agents pane draws other mods' content beneath its agents (this is how the tree gets there). |
| [token-weather-usage](plugins/token-weather-usage) | [augiefra/claude-mods](https://github.com/augiefra/claude-mods) (Apache-2.0) | On the desktop the band draws on two lines (context and limits, then cache, cost and agents), with space between. |

## Install

At the prompt of a terminal session:

```
/plugin install filetree --marketplace Esdark/Claude-Code
/plugin install savvy-progress --marketplace Esdark/Claude-Code
/plugin install token-weather-usage --marketplace Esdark/Claude-Code
```

Or run them from a clone, by naming the folders in the `env` block of `~/.claude/settings.json`:

```json
"CLAUDE_CODE_PLUGIN_DIRS": "/path/to/claude-code-mods/plugins/filetree:/path/to/claude-code-mods/plugins/savvy-progress:/path/to/claude-code-mods/plugins/token-weather-usage"
```

To have the Agents pane (and the tree under it) open whenever any subagent starts, set savvy-progress's **Open the agents panel** option to `any`.

## Tests

Each mod has its own tests: `claude plugin test plugins/<mod>`.

## License

Each mod keeps its upstream license and credits, in its own folder: MIT for filetree and savvy-progress, Apache-2.0 with its NOTICE for token-weather-usage.
