#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = process.env.API_URL || 'http://localhost:8000';

interface SessionData {
  sessionId: string;
  metadata?: any;
  subsetPath?: string;
}

class FontSubsetterMCPServer {
  private server: Server;
  private sessions: Map<string, SessionData> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'font-subsetter',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'upload_font':
            return await this.uploadFont(args);
          case 'get_font_metadata':
            return await this.getFontMetadata(args);
          case 'generate_subset':
            return await this.generateSubset(args);
          case 'export_font':
            return await this.exportFont(args);
          case 'list_sessions':
            return await this.listSessions();
          case 'cleanup_session':
            return await this.cleanupSession(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'upload_font',
        description: 'Upload a font file and extract metadata',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path to the font file to upload',
            },
            session_id: {
              type: 'string',
              description: 'Optional session ID. If not provided, a new session will be created',
            },
          },
          required: ['file_path'],
        },
      },
      {
        name: 'get_font_metadata',
        description: 'Get metadata for an uploaded font',
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID',
            },
          },
          required: ['session_id'],
        },
      },
      {
        name: 'generate_subset',
        description: 'Generate a font subset with selected characters',
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID',
            },
            characters: {
              type: 'string',
              description: 'Characters to include in the subset',
            },
            font_name_suffix: {
              type: 'string',
              description: 'Suffix to add to the font name (default: "Subset")',
            },
          },
          required: ['session_id', 'characters'],
        },
      },
      {
        name: 'export_font',
        description: 'Export the subset font in specified formats',
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID',
            },
            formats: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['ttf', 'woff', 'woff2'],
              },
              description: 'Output formats (ttf, woff, woff2)',
            },
          },
          required: ['session_id', 'formats'],
        },
      },
      {
        name: 'list_sessions',
        description: 'List all active sessions',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'cleanup_session',
        description: 'Clean up session data and temporary files',
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID to clean up',
            },
          },
          required: ['session_id'],
        },
      },
    ];
  }

  private async uploadFont(args: any) {
    const { file_path, session_id } = args;

    // Create or use existing session
    let sessionData: SessionData;

    if (session_id && this.sessions.has(session_id)) {
      sessionData = this.sessions.get(session_id)!;
    } else {
      const newSessionId = session_id || uuidv4();
      sessionData = { sessionId: newSessionId };
      this.sessions.set(newSessionId, sessionData);
    }

    // In a real implementation, you would:
    // 1. Read the file from file_path
    // 2. Send it to the Python backend
    // For now, we'll return a mock response

    const result = {
      session_id: sessionData.sessionId,
      message: 'Font upload initiated',
      file_path,
      instructions: 'Use the frontend to upload the font file directly to the API',
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async getFontMetadata(args: any) {
    const { session_id } = args;

    const sessionData = this.sessions.get(session_id);

    if (!sessionData) {
      throw new Error('Session not found');
    }

    if (!sessionData.metadata) {
      throw new Error('No font metadata available for this session');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(sessionData.metadata, null, 2),
        },
      ],
    };
  }

  private async generateSubset(args: any) {
    const { session_id, characters, font_name_suffix = 'Subset' } = args;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/subset`, {
        session_id,
        characters,
        font_name_suffix,
      });

      // Store subset path in session
      const sessionData = this.sessions.get(session_id);
      if (sessionData) {
        sessionData.subsetPath = response.data.subset_path;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Failed to generate subset');
      }
      throw error;
    }
  }

  private async exportFont(args: any) {
    const { session_id, formats } = args;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/export`, {
        session_id,
        formats,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Failed to export font');
      }
      throw error;
    }
  }

  private async listSessions() {
    const sessions = Array.from(this.sessions.values()).map((session) => ({
      session_id: session.sessionId,
      has_metadata: !!session.metadata,
      has_subset: !!session.subsetPath,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ sessions, count: sessions.length }, null, 2),
        },
      ],
    };
  }

  private async cleanupSession(args: any) {
    const { session_id } = args;

    try {
      // Call backend cleanup
      await axios.delete(`${API_BASE_URL}/api/session/${session_id}`);

      // Remove from local sessions
      this.sessions.delete(session_id);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ status: 'success', message: 'Session cleaned up' }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Failed to cleanup session');
      }
      throw error;
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Font Subsetter MCP Server running on stdio');
  }
}

// Start the server
const server = new FontSubsetterMCPServer();
server.run().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
