"""
Session manager for tracking user sessions and temporary data.
"""
import uuid
from typing import Dict, Optional, List
from datetime import datetime, timedelta
import logging

from app.models.font_models import FontMetadata

logger = logging.getLogger(__name__)


class SessionManager:
    """Manages user sessions and associated data"""

    def __init__(self, session_timeout_minutes: int = 60):
        """
        Initialize session manager.

        Args:
            session_timeout_minutes: Session timeout in minutes
        """
        self.sessions: Dict[str, Dict] = {}
        self.session_timeout = timedelta(minutes=session_timeout_minutes)

    def create_session(self) -> str:
        """
        Create a new session.

        Returns:
            Session ID
        """
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "created_at": datetime.now(),
            "last_accessed": datetime.now(),
            "fonts": [],  # List of FontMetadata
            "subset_paths": [],  # List of subset paths
            "exported_files": []  # List of exported file paths
        }

        logger.info(f"Created session: {session_id}")
        return session_id

    def get_session(self, session_id: str) -> Optional[Dict]:
        """
        Get session data.

        Args:
            session_id: Session ID

        Returns:
            Session data or None if not found
        """
        if session_id in self.sessions:
            session = self.sessions[session_id]

            # Check if session is expired
            if datetime.now() - session["last_accessed"] > self.session_timeout:
                logger.info(f"Session expired: {session_id}")
                self.cleanup_session(session_id)
                return None

            # Update last accessed time
            session["last_accessed"] = datetime.now()
            return session

        return None

    def add_font(self, session_id: str, metadata: FontMetadata):
        """
        Add font metadata to session.

        Args:
            session_id: Session ID
            metadata: Font metadata
        """
        session = self.get_session(session_id)
        if session:
            session["fonts"].append(metadata)
            logger.info(f"Added font to session: {session_id}, total fonts: {len(session['fonts'])}")

    def get_fonts(self, session_id: str) -> List[FontMetadata]:
        """
        Get all font metadata from session.

        Args:
            session_id: Session ID

        Returns:
            List of FontMetadata
        """
        session = self.get_session(session_id)
        if session:
            return session.get("fonts", [])
        return []

    def get_font_by_index(self, session_id: str, index: int) -> Optional[FontMetadata]:
        """
        Get font metadata by index.

        Args:
            session_id: Session ID
            index: Font index

        Returns:
            FontMetadata or None
        """
        fonts = self.get_fonts(session_id)
        if 0 <= index < len(fonts):
            return fonts[index]
        return None

    def add_subset_path(self, session_id: str, subset_path: str):
        """
        Add subset font path to session.

        Args:
            session_id: Session ID
            subset_path: Path to subset font
        """
        session = self.get_session(session_id)
        if session:
            session["subset_paths"].append(subset_path)
            logger.info(f"Added subset path for session: {session_id}")

    def get_subset_paths(self, session_id: str) -> List[str]:
        """
        Get all subset font paths from session.

        Args:
            session_id: Session ID

        Returns:
            List of subset font paths
        """
        session = self.get_session(session_id)
        if session:
            return session.get("subset_paths", [])
        return []

    def clear_subset_paths(self, session_id: str):
        """
        Clear all subset paths from session.

        Args:
            session_id: Session ID
        """
        session = self.get_session(session_id)
        if session:
            session["subset_paths"] = []
            logger.info(f"Cleared subset paths for session: {session_id}")

    def add_exported_file(self, session_id: str, file_path: str):
        """
        Add exported file path to session.

        Args:
            session_id: Session ID
            file_path: Path to exported file
        """
        session = self.get_session(session_id)
        if session:
            session["exported_files"].append(file_path)
            logger.info(f"Added exported file for session: {session_id}")

    def get_exported_files(self, session_id: str) -> List[str]:
        """
        Get all exported file paths from session.

        Args:
            session_id: Session ID

        Returns:
            List of exported file paths
        """
        session = self.get_session(session_id)
        if session:
            return session.get("exported_files", [])
        return []

    def clear_exported_files(self, session_id: str):
        """
        Clear all exported file paths from session.

        Args:
            session_id: Session ID
        """
        session = self.get_session(session_id)
        if session:
            session["exported_files"] = []
            logger.info(f"Cleared exported files for session: {session_id}")

    def cleanup_session(self, session_id: str):
        """
        Remove session data.

        Args:
            session_id: Session ID
        """
        if session_id in self.sessions:
            del self.sessions[session_id]
            logger.info(f"Cleaned up session: {session_id}")

    def cleanup_expired_sessions(self):
        """Clean up all expired sessions"""
        now = datetime.now()
        expired_sessions = [
            sid for sid, session in self.sessions.items()
            if now - session["last_accessed"] > self.session_timeout
        ]

        for session_id in expired_sessions:
            self.cleanup_session(session_id)

        if expired_sessions:
            logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
