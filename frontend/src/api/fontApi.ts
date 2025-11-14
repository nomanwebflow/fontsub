import type { FontMetadata, SubsetRequest, SubsetResponse, ExportRequest, ExportResponse } from '@/types/font';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class FontApi {
  private sessionId: string | null = null;

  async uploadFont(file: File): Promise<FontMetadata> {
    const formData = new FormData();
    formData.append('file', file);

    if (this.sessionId) {
      formData.append('session_id', this.sessionId);
    }

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload font');
    }

    const metadata: FontMetadata = await response.json();

    if (metadata.session_id) {
      this.sessionId = metadata.session_id;
    }

    return metadata;
  }

  async generateSubset(characters: string, fontNameSuffix: string = 'Subset', customFontName?: string): Promise<SubsetResponse> {
    if (!this.sessionId) {
      throw new Error('No active session. Please upload a font first.');
    }

    const request: SubsetRequest = {
      session_id: this.sessionId,
      characters,
      font_name_suffix: fontNameSuffix,
      custom_font_name: customFontName,
    };

    const response = await fetch(`${API_BASE_URL}/api/subset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate subset');
    }

    return response.json();
  }

  async exportFont(formats: string[], customFontName?: string): Promise<ExportResponse> {
    if (!this.sessionId) {
      throw new Error('No active session. Please upload a font first.');
    }

    const request: ExportRequest = {
      session_id: this.sessionId,
      formats,
      font_name: customFontName,
    };

    const response = await fetch(`${API_BASE_URL}/api/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to export font');
    }

    return response.json();
  }

  getDownloadUrl(filename: string): string {
    if (!this.sessionId) {
      throw new Error('No active session');
    }
    return `${API_BASE_URL}/api/download/${this.sessionId}/${filename}`;
  }

  async cleanupSession(): Promise<void> {
    if (!this.sessionId) return;

    try {
      await fetch(`${API_BASE_URL}/api/session/${this.sessionId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to cleanup session:', error);
    } finally {
      this.sessionId = null;
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

export const fontApi = new FontApi();
