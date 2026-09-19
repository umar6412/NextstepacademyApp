"""add password reset token columns

Revision ID: 001
Revises:
Create Date: 2026-09-09
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("password_reset_token", sa.String(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("reset_token_expires_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "reset_token_expires_at")
    op.drop_column("users", "password_reset_token")
