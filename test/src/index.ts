import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "first-mcp",
  version: "1.0.0",
  capabilities: {
    resorces: {},
    tools: {},
  },
});

server.tool(
  "add-numbers",
  "Add two numbers",
  {
    a: z.number().describe("Frist number"),
    b: z.number().describe("Frist number"),
  },
  ({ a, b }) => {
    return {
      content: [{ type: "text", text: `Total is ${a + b}` }],
    };
  }
);

server.tool(
  "get_github_repos",
  "Get github repositories from the given username",
  {
    username: z.string().describe("Username"),
  },
  async ({ username }) => {
    const res = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: { "User-Agent": "MCP-Server" },
    });

    if (!res.ok) {
      throw new Error("Github API error");
    }

    const repos = await res.json();

    const repoosList = repos
      .map((repo: any, i: number) => `${i + 1}. ${repo.name}`)
      .join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `Github repositories for ${username}: (${repos.length} repos): \n\n ${repoosList}`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("error in main!:", error);
  process.exit(1);
});
