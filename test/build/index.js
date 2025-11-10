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
server.tool("add-numbers", "Add two numbers", {
    a: z.number().describe("Frist number"),
    b: z.number().describe("Frist number"),
}, ({ a, b }) => {
    return {
        content: [{ type: "text", text: `Total is ${a + b}` }],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("error in main!:", error);
    process.exit(1);
});
